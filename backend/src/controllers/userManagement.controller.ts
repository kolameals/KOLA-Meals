import { Request, Response } from 'express';
import { userManagementService } from '../services/userManagement.service';
import { validateCreateUser, validateUpdateUser } from '../validators/userManagement.validator';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await userManagementService.getUsers(page, limit);
    res.json({ data: users });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validationError = validateCreateUser(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const user = await userManagementService.createUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const validationError = validateUpdateUser(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const user = await userManagementService.updateUser(req.params.id, req.body);
    res.json({ data: user });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userManagementService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getDeliveryPartners = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const deliveryPartners = await userManagementService.getDeliveryPartners(page, limit);
    res.json({ data: deliveryPartners });
  } catch (error) {
    console.error('Error in getDeliveryPartners:', error);
    res.status(500).json({ error: 'Failed to fetch delivery partners' });
  }
};

export const createDeliveryPartner = async (req: Request, res: Response) => {
  try {
    const validationError = validateCreateUser(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const deliveryPartner = await userManagementService.createDeliveryPartner(req.body);
    res.status(201).json({ data: deliveryPartner });
  } catch (error) {
    console.error('Error in createDeliveryPartner:', error);
    res.status(500).json({ error: 'Failed to create delivery partner' });
  }
}; 