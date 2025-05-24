import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

const router = Router();

// Calculate recipe cost
router.post('/calculate-cost', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { recipeItems } = req.body;
    let totalCost = 0;

    for (const item of recipeItems) {
      const rawMaterial = await prisma.rawMaterial.findUnique({
        where: { id: item.rawMaterialId }
      });
      if (rawMaterial) {
        totalCost += item.quantity * rawMaterial.costPerUnit;
      }
    }

    res.json({ success: true, data: { cost: totalCost } });
  } catch (error) {
    console.error('Error calculating recipe cost:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate cost' });
  }
});

// Get all recipes
router.get('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recipes' });
  }
});

// Get recipe by ID
router.get('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: req.params.id },
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch recipe' });
  }
});

// Create recipe (admin only)
router.post('/', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { recipeItems, ...recipeData } = req.body;
    
    // Calculate total cost
    let totalCost = 0;
    for (const item of recipeItems) {
      const rawMaterial = await prisma.rawMaterial.findUnique({
        where: { id: item.rawMaterialId }
      });
      if (rawMaterial) {
        totalCost += item.quantity * rawMaterial.costPerUnit;
      }
    }

    // Calculate cost per serving
    const costPerServing = totalCost / recipeData.servings;
    
    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        costPerServing,
        recipeItems: {
          create: recipeItems
        }
      },
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ success: false, error: 'Failed to create recipe' });
  }
});

// Update recipe (admin only)
router.put('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { recipeItems, ...recipeData } = req.body;
    
    // Delete existing recipe items
    await prisma.recipeItem.deleteMany({
      where: { recipeId: req.params.id }
    });

    // Update recipe and create new recipe items
    const recipe = await prisma.recipe.update({
      where: { id: req.params.id },
      data: {
        ...recipeData,
        recipeItems: {
          create: recipeItems
        }
      },
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ success: false, error: 'Failed to update recipe' });
  }
});

// Delete recipe (admin only)
router.delete('/:id', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    // Delete recipe items first
    await prisma.recipeItem.deleteMany({
      where: { recipeId: req.params.id }
    });

    // Then delete the recipe
    await prisma.recipe.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ success: false, error: 'Failed to delete recipe' });
  }
});

export default router; 