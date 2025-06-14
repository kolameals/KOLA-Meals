import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';
import { MealType } from '@prisma/client';
import { MealCategory } from '../types/meal.types';
import { GeminiService } from '../services/gemini.service';

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
        },
        meal: true
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
        },
        meal: true
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
    
    // Validate category and type
    if (!Object.values(MealCategory).includes(recipeData.category)) {
      return res.status(400).json({ success: false, error: 'Invalid category' });
    }
    if (!Object.values(MealType).includes(recipeData.type)) {
      return res.status(400).json({ success: false, error: 'Invalid meal type' });
    }

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

    // First create the meal
    const meal = await prisma.meal.create({
      data: {
        name: recipeData.name,
        description: recipeData.description,
        category: recipeData.category as MealCategory,
        type: recipeData.type as MealType,
        price: 0, // Default price, can be updated later
        image: recipeData.imageUrl
      }
    });
    
    // Then create the recipe with the meal connection
    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        costPerServing,
        mealId: meal.id,
        recipeItems: {
          create: recipeItems
        }
      },
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        },
        meal: true
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

    // Validate category and type
    if (recipeData.category && !Object.values(MealCategory).includes(recipeData.category)) {
      return res.status(400).json({ success: false, error: 'Invalid category' });
    }
    if (recipeData.type && !Object.values(MealType).includes(recipeData.type)) {
      return res.status(400).json({ success: false, error: 'Invalid meal type' });
    }

    // Get the existing recipe to find the meal ID
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: req.params.id },
      include: { meal: true }
    });

    if (!existingRecipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    
    // Update the associated meal
    await prisma.meal.update({
      where: { id: existingRecipe.mealId },
      data: {
        name: recipeData.name,
        description: recipeData.description,
        category: recipeData.category as MealCategory,
        type: recipeData.type as MealType,
        image: recipeData.imageUrl
      }
    });
    
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
        },
        meal: true
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

// Generate recipe using Gemini AI
router.post('/generate', authMiddleware(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { prompt, servings } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const recipe = await GeminiService.generateRecipe(prompt, servings || 1);
    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ success: false, error: 'Failed to generate recipe' });
  }
});

export default router; 