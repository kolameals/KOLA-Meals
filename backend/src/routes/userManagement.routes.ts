import express from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserRole } from '../types/user.types';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getDeliveryPartners,
  createDeliveryPartner,
  getActiveSubscribers
} from '../controllers/userManagement.controller';

const router = express.Router();

// User Management Routes
router.get(
  '/',
  authMiddleware([UserRole.ADMIN]),
  getUsers
);

router.get(
  '/active-subscribers',
  authMiddleware([UserRole.ADMIN]),
  getActiveSubscribers
);

router.get(
  '/addresses',
  authMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const addresses = await prisma.address.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true
            }
          }
        }
      });
      res.json({ success: true, data: addresses });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
    }
  }
);

router.get(
  '/by-apartment',
  authMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          addresses: {
            select: {
              apartment: true,
              tower: true,
              floor: true,
              roomNumber: true
            }
          },
          subscription: {
            select: {
              status: true
            }
          }
        }
      });

      // Group users by apartment
      const apartmentData = users.reduce((acc: any, user) => {
        user.addresses.forEach(address => {
          const key = address.apartment;
          if (!acc[key]) {
            acc[key] = {
              apartment: key,
              users: [],
              totalUsers: 0,
              activeSubscribers: 0
            };
          }
          acc[key].users.push({
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            floor: address.floor,
            roomNumber: address.roomNumber,
            hasActiveSubscription: user.subscription?.status === 'ACTIVE'
          });
          acc[key].totalUsers++;
          if (user.subscription?.status === 'ACTIVE') {
            acc[key].activeSubscribers++;
          }
        });
        return acc;
      }, {});

      res.json({ success: true, data: Object.values(apartmentData) });
    } catch (error) {
      console.error('Error fetching users by apartment:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch users by apartment' });
    }
  }
);

router.post(
  '/',
  authMiddleware([UserRole.ADMIN]),
  createUser
);

router.put(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  updateUser
);

router.delete(
  '/:id',
  authMiddleware([UserRole.ADMIN]),
  deleteUser
);

// Delivery Partner Routes
router.get(
  '/admin/delivery-partners',
  authMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [deliveryPartners, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            role: 'DELIVERY_PARTNER'
          },
          include: {
            deliveryAgent: {
              include: {
                apartment: {
                  include: {
                    towers: true
                  }
                }
              }
            }
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.user.count({
          where: {
            role: 'DELIVERY_PARTNER'
          }
        })
      ]);

      // Transform the response to include tower details
      const transformedPartners = deliveryPartners.map(partner => {
        const agent = (partner as any).deliveryAgent;
        return {
          ...partner,
          deliveryAgent: agent ? {
            ...agent,
            assignedTowerDetails: Array.isArray(agent.assignedTowers) && agent.apartment && Array.isArray(agent.apartment.towers)
              ? agent.assignedTowers.map((towerId: string) => {
                  const tower = agent.apartment.towers.find((t: any) => t.id === towerId);
                  return tower ? {
                    id: tower.id,
                    name: tower.name,
                    floors: tower.floors,
                    roomsPerFloor: tower.roomsPerFloor
                  } : null;
                }).filter(Boolean)
              : []
          } : null
        };
      });

      res.json({
        data: transformedPartners,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching delivery partners:', error);
      res.status(500).json({ 
        error: 'Error fetching delivery partners',
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      });
    }
  }
);

router.post(
  '/admin/delivery-partners',
  authMiddleware([UserRole.ADMIN]),
  createDeliveryPartner
);

router.post(
  '/admin/delivery-partners/reset-assignments',
  authMiddleware(['ADMIN']),
  async (req: Request, res: Response) => {
    try {
      // Fetch all delivery agent IDs
      const agents = await prisma.deliveryAgent.findMany({ select: { id: true } });
      // Update each agent individually
      await Promise.all(
        agents.map(agent =>
          prisma.deliveryAgent.update({
            where: { id: agent.id },
            data: {
              isAvailable: true,
              currentLocation: '',
              assignedTowers: { set: [] },
              assignedRooms: { set: [] }
            }
          })
        )
      );

      res.json({
        success: true,
        message: 'All delivery partner assignments have been reset successfully'
      });
    } catch (error) {
      console.error('Error resetting assignments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset assignments'
      });
    }
  }
);

export default router; 