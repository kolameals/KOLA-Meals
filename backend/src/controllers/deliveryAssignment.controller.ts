import { Request, Response } from 'express';
import { PrismaClient, DeliveryAssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const deliveryAssignmentController = {
  async getAssignments(req: Request, res: Response) {
    try {
      const assignments = await prisma.deliveryAssignment.findMany({
        include: {
          deliveryAgent: {
            include: {
              user: true,
            },
          },
          apartment: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      res.json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async createTeamAssignment(req: Request, res: Response) {
    try {
      const { 
        apartmentId, 
        startDate, 
        endDate,
        teamMembers 
      } = req.body;

      // teamMembers should be an array of { deliveryAgentId, towerNumbers, mealCount }
      if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
        return res.status(400).json({ message: 'Team members are required' });
      }

      // Check if any delivery agent is already assigned during this period
      for (const member of teamMembers) {
        const existingAssignment = await prisma.deliveryAssignment.findFirst({
          where: {
            deliveryAgentId: member.deliveryAgentId,
            OR: [
              {
                AND: [
                  { startDate: { lte: new Date(startDate) } },
                  { endDate: { gte: new Date(startDate) } },
                ],
              },
              {
                AND: [
                  { startDate: { lte: new Date(endDate) } },
                  { endDate: { gte: new Date(endDate) } },
                ],
              },
            ],
          },
        });

        if (existingAssignment) {
          return res.status(400).json({
            message: `Delivery agent ${member.deliveryAgentId} is already assigned during this period`,
          });
        }
      }

      // Create assignments for all team members
      const assignments = await Promise.all(
        teamMembers.map(member =>
          prisma.deliveryAssignment.create({
            data: {
              deliveryAgentId: member.deliveryAgentId,
              apartmentId,
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              towerNumbers: member.towerNumbers,
              mealCount: member.mealCount || 35,
              status: DeliveryAssignmentStatus.PENDING,
            },
            include: {
              deliveryAgent: {
                include: {
                  user: true,
                },
              },
              apartment: true,
            },
          })
        )
      );

      res.status(201).json(assignments);
    } catch (error) {
      console.error('Error creating team assignment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate, status, towerNumbers, mealCount } = req.body;

      const assignment = await prisma.deliveryAssignment.update({
        where: { id },
        data: {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          status: status as DeliveryAssignmentStatus,
          towerNumbers,
          mealCount,
        },
        include: {
          deliveryAgent: {
            include: {
              user: true,
            },
          },
          apartment: true,
        },
      });

      res.json(assignment);
    } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.deliveryAssignment.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getCurrentAssignments(req: Request, res: Response) {
    try {
      const currentDate = new Date();

      const assignments = await prisma.deliveryAssignment.findMany({
        where: {
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        include: {
          deliveryAgent: {
            include: {
              user: true,
            },
          },
          apartment: true,
        },
      });

      res.json(assignments);
    } catch (error) {
      console.error('Error fetching current assignments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getTeamAssignments(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const currentDate = new Date();

      const assignments = await prisma.deliveryAssignment.findMany({
        where: {
          deliveryAgent: {
            teamId,
          },
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        include: {
          deliveryAgent: {
            include: {
              user: true,
            },
          },
          apartment: true,
        },
      });

      res.json(assignments);
    } catch (error) {
      console.error('Error fetching team assignments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}; 