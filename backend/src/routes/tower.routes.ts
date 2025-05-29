import { Router } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth.middleware';
import { ParsedQs } from 'qs';

const router = Router();

// Get towers with optional filtering by tower names
router.get('/', authMiddleware(['ADMIN']), async (req, res) => {
  try {
    const { towers: towerQuery } = req.query;
    const towerNames = towerQuery ? 
      (Array.isArray(towerQuery) ? towerQuery : [towerQuery]).map(t => String(t)) : 
      [];

    const addresses = await prisma.address.findMany({
      where: towerNames.length > 0 ? {
        tower: {
          in: towerNames
        }
      } : undefined,
      select: {
        tower: true,
        floor: true,
        roomNumber: true,
        userId: true,
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        }
      },
      distinct: ['tower', 'floor', 'roomNumber']
    });

    // Group addresses by tower
    const towerMap = addresses.reduce((acc: any, address) => {
      if (!acc[address.tower]) {
        acc[address.tower] = {
          name: address.tower,
          floors: new Set<string>(),
          rooms: []
        };
      }
      
      acc[address.tower].floors.add(address.floor);
      acc[address.tower].rooms.push({
        floor: address.floor,
        roomNumber: address.roomNumber,
        userId: address.userId,
        user: address.user
      });
      
      return acc;
    }, {});

    // Convert to array and format floors
    const formattedTowers = Object.values(towerMap).map((tower: any) => ({
      name: tower.name,
      floors: Array.from(tower.floors).sort((a, b) => parseInt(a as string) - parseInt(b as string)),
      rooms: tower.rooms.sort((a: any, b: any) => {
        if (a.floor === b.floor) {
          return parseInt(a.roomNumber) - parseInt(b.roomNumber);
        }
        return parseInt(a.floor) - parseInt(b.floor);
      })
    }));

    res.json(formattedTowers);
  } catch (error) {
    console.error('Error fetching towers:', error);
    res.status(500).json({ error: 'Failed to fetch towers' });
  }
});

export default router; 