import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';
import logger from '../config/logger.config';

// Define string literal types for enums
export type FeedbackType = 'GENERAL' | 'MEAL_QUALITY' | 'DELIVERY' | 'SERVICE' | 'OTHER';
export type FeedbackStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

interface FeedbackCategories {
  taste: number;
  packaging: number;
  portion: number;
}

interface CategorySums {
  taste: number;
  packaging: number;
  portion: number;
}

class FeedbackService {
  async getFeedbacks(filters?: {
    type?: FeedbackType;
    status?: FeedbackStatus;
    userId?: string;
  }) {
    try {
      const where = {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.userId && { userId: filters.userId }),
      };

      const feedbacks = await prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          responses: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          issues: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return feedbacks;
    } catch (error) {
      logger.error('Error fetching feedbacks:', { error });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching feedbacks', 500);
    }
  }

  async getFeedbackById(id: string) {
    try {
      const feedback = await prisma.feedback.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          responses: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          issues: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!feedback) {
        throw new AppError('Feedback not found', 404);
      }

      return feedback;
    } catch (error) {
      logger.error('Error fetching feedback:', { error, id });
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching feedback', 500);
    }
  }

  async createFeedback(data: {
    userId: string;
    type: FeedbackType;
    title: string;
    description: string;
    rating?: number;
  }) {
    try {
      const feedback = await prisma.feedback.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          description: data.description,
          rating: data.rating,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return feedback;
    } catch (error) {
      logger.error('Error creating feedback:', { error, data });
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating feedback', 500);
    }
  }

  async updateFeedbackStatus(id: string, status: FeedbackStatus) {
    try {
      const feedback = await prisma.feedback.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return feedback;
    } catch (error) {
      logger.error('Error updating feedback status:', { error, id, status });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating feedback status', 500);
    }
  }

  async addResponse(data: {
    feedbackId: string;
    userId: string;
    message: string;
  }) {
    try {
      const response = await prisma.feedbackResponse.create({
        data: {
          feedbackId: data.feedbackId,
          userId: data.userId,
          message: data.message,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return response;
    } catch (error) {
      logger.error('Error adding feedback response:', { error, data });
      if (error instanceof AppError) throw error;
      throw new AppError('Error adding feedback response', 500);
    }
  }

  async createIssue(data: {
    feedbackId: string;
    title: string;
    description: string;
    priority: IssuePriority;
    assignedTo?: string;
  }) {
    try {
      const issue = await prisma.issue.create({
        data: {
          feedbackId: data.feedbackId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          assignedTo: data.assignedTo,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return issue;
    } catch (error) {
      logger.error('Error creating issue:', { error, data });
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating issue', 500);
    }
  }

  async updateIssueStatus(id: string, status: IssueStatus) {
    try {
      const issue = await prisma.issue.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return issue;
    } catch (error) {
      logger.error('Error updating issue status:', { error, id, status });
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating issue status', 500);
    }
  }

  async assignIssue(id: string, userId: string) {
    try {
      const issue = await prisma.issue.update({
        where: { id },
        data: { assignedTo: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return issue;
    } catch (error) {
      logger.error('Error assigning issue:', { error, id, userId });
      if (error instanceof AppError) throw error;
      throw new AppError('Error assigning issue', 500);
    }
  }

  async submitFeedback(
    userId: string,
    mealId: string,
    rating: number,
    comments?: string,
    categories?: FeedbackCategories
  ) {
    try {
      const feedback = await prisma.mealFeedback.create({
        data: {
          userId,
          mealId,
          rating,
          comments,
          categories: categories as any
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return feedback;
    } catch (error) {
      logger.error('Error in submitFeedback:', error);
      throw error;
    }
  }

  async getMealFeedback(mealId: string) {
    try {
      const feedback = await prisma.mealFeedback.findMany({
        where: { mealId },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return feedback;
    } catch (error) {
      logger.error('Error in getMealFeedback:', error);
      throw error;
    }
  }

  async getMealStats(mealId: string) {
    try {
      const feedback = await prisma.mealFeedback.findMany({
        where: { mealId }
      });

      if (feedback.length === 0) {
        return {
          averageRating: 0,
          totalFeedback: 0,
          categoryAverages: {
            taste: 0,
            packaging: 0,
            portion: 0
          }
        };
      }

      const totalRating = feedback.reduce((sum: number, f: { rating: number }) => sum + f.rating, 0);
      const averageRating = totalRating / feedback.length;

      const categorySums = feedback.reduce(
        (sums: CategorySums, f: { categories: unknown }) => {
          const categories = f.categories as FeedbackCategories;
          return {
            taste: sums.taste + categories.taste,
            packaging: sums.packaging + categories.packaging,
            portion: sums.portion + categories.portion
          };
        },
        { taste: 0, packaging: 0, portion: 0 }
      );

      return {
        averageRating,
        totalFeedback: feedback.length,
        categoryAverages: {
          taste: categorySums.taste / feedback.length,
          packaging: categorySums.packaging / feedback.length,
          portion: categorySums.portion / feedback.length
        }
      };
    } catch (error) {
      logger.error('Error in getMealStats:', error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService(); 