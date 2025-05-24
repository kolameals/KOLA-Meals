import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers
} from '../services/user.service';
import { validateRequest } from '../middleware/validation.middleware';
import prisma from '../lib/prisma';
import bcryptjs from 'bcryptjs';

const router = Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     role:
 *                       type: string
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         plan:
 *                           type: string
 *                         status:
 *                           type: string
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userObj = req.user as import('../types').AuthenticatedUser;
    const user = await getUser(userObj.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.put('/profile', authMiddleware, validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      phoneNumber: { type: 'string' }
    },
    required: []
  }
}), async (req: Request, res: Response) => {
  try {
    const userObj = req.user as import('../types').AuthenticatedUser;
    const user = await updateUser(userObj.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user profile' });
  }
});

/**
 * @swagger
 * /api/users/addresses:
 *   get:
 *     summary: Get user addresses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       postalCode:
 *                         type: string
 *                       country:
 *                         type: string
 *                       isDefault:
 *                         type: boolean
 *       401:
 *         description: Not authenticated
 */
router.get('/addresses', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userObj = req.user as import('../types').AuthenticatedUser;
    const user = await getUser(userObj.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching addresses' });
  }
});

/**
 * @swagger
 * /api/users/addresses:
 *   post:
 *     summary: Add new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apartment
 *               - tower
 *               - floor
 *               - roomNumber
 *               - street
 *               - city
 *               - state
 *               - postalCode
 *               - country
 *               - isDefault
 *             properties:
 *               apartment:
 *                 type: string
 *                 example: 1
 *               tower:
 *                 type: string
 *                 example: A
 *               floor:
 *                 type: string
 *                 example: 2
 *               roomNumber:
 *                 type: string
 *                 example: 3
 *               street:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: New York
 *               state:
 *                 type: string
 *                 example: NY
 *               postalCode:
 *                 type: string
 *                 example: 10001
 *               country:
 *                 type: string
 *                 example: USA
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     apartment:
 *                       type: string
 *                     tower:
 *                       type: string
 *                     floor:
 *                       type: string
 *                     roomNumber:
 *                       type: string
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     postalCode:
 *                       type: string
 *                     country:
 *                       type: string
 *                     isDefault:
 *                       type: boolean
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post('/addresses', authMiddleware, validateRequest({
  body: {
    type: 'object',
    properties: {
      apartment: { type: 'string', required: true },
      tower: { type: 'string', required: true },
      floor: { type: 'string', required: true },
      roomNumber: { type: 'string', required: true },
      street: { type: 'string', required: true },
      city: { type: 'string', required: true },
      state: { type: 'string', required: true },
      postalCode: { type: 'string', required: true },
      country: { type: 'string', required: true },
      isDefault: { type: 'boolean', required: true }
    }
  }
}), async (req: Request, res: Response) => {
  try {
    const userObj = req.user as import('../types').AuthenticatedUser;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userObj.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If this is the first address or isDefault is true, set all other addresses to non-default
    if (req.body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: userObj.id },
        data: { isDefault: false }
      });
    }

    // Create the new address
    const address = await prisma.address.create({
      data: {
        ...req.body,
        userId: userObj.id
      }
    });

    res.status(201).json({ 
      success: true, 
      data: address 
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ 
      error: 'Error adding address',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CUSTOMER, DELIVERY_PARTNER]
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post('/', authMiddleware(['ADMIN']), validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phoneNumber: { type: 'string' },
      password: { type: 'string', minLength: 6 },
      role: { type: 'string', enum: ['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER'] }
    },
    required: ['name', 'password']
  }
}), async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Admin routes
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getAllUsers(page, limit);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/:userId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userObj = req.user as import('../types').AuthenticatedUser;
    const user = await getUser(userObj.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update user route
router.patch('/:userId', authMiddleware(['ADMIN']), validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phoneNumber: { type: 'string' },
      password: { type: 'string', minLength: 6 },
      role: { type: 'string', enum: ['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER'] }
    },
    required: []
  }
}), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await updateUser(userId, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete user route
router.delete('/:userId', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

/**
 * Admin: List all delivery partners
 */
router.get('/admin/delivery-partners', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const deliveryPartners = await prisma.user.findMany({
      where: {
        role: 'DELIVERY_PARTNER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json({ success: true, data: deliveryPartners });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching delivery partners' });
  }
});

/**
 * Admin: Create a new delivery partner
 */
router.post('/admin/delivery-partners', authMiddleware(['ADMIN']), validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phoneNumber: { type: 'string' },
      password: { type: 'string', minLength: 6 }
    },
    required: ['name', 'email', 'phoneNumber', 'password']
  }
}), async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check if user with email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or phone number already exists' });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 12);

    const deliveryPartner = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        role: 'DELIVERY_PARTNER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json({ success: true, data: deliveryPartner });
  } catch (error) {
    res.status(500).json({ error: 'Error creating delivery partner' });
  }
});

/**
 * Admin: Update a delivery partner
 */
router.put('/admin/delivery-partners/:id', authMiddleware(['ADMIN']), validateRequest({
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phoneNumber: { type: 'string' }
    },
    required: []
  }
}), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;

    // Check if user exists and is a delivery partner
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        role: 'DELIVERY_PARTNER'
      }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Delivery partner not found' });
    }

    // Check if email or phone is being changed and if it conflicts with existing users
    if (email || phoneNumber) {
      const conflictingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phoneNumber: phoneNumber || undefined }
          ],
          NOT: {
            id
          }
        }
      });

      if (conflictingUser) {
        return res.status(400).json({ error: 'User with this email or phone number already exists' });
      }
    }

    const updatedPartner = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ success: true, data: updatedPartner });
  } catch (error) {
    res.status(500).json({ error: 'Error updating delivery partner' });
  }
});

/**
 * Admin: Delete a delivery partner
 */
router.delete('/admin/delivery-partners/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists and is a delivery partner
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        role: 'DELIVERY_PARTNER'
      }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Delivery partner not found' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Delivery partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting delivery partner' });
  }
});

export default router; 