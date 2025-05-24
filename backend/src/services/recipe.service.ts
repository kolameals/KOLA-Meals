import { AppError } from '../types/error.types';
import prisma from '../lib/prisma';
import { Recipe, RecipeItem } from '@prisma/client';

export const recipeService = {
  async getAllRecipes() {
    return prisma.recipe.findMany({
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  async getRecipeById(id: string) {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
  },

  async createRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> & {
    recipeItems: Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>[];
  }) {
    const { recipeItems, ...recipeData } = data;

    return prisma.recipe.create({
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
  },

  async updateRecipe(id: string, data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>> & {
    recipeItems?: Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>[];
  }) {
    const { recipeItems, ...recipeData } = data;

    // If recipeItems are provided, delete existing items and create new ones
    if (recipeItems) {
      await prisma.recipeItem.deleteMany({
        where: { recipeId: id }
      });
    }

    return prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        ...(recipeItems && {
          recipeItems: {
            create: recipeItems
          }
        })
      },
      include: {
        recipeItems: {
          include: {
            rawMaterial: true
          }
        }
      }
    });
  },

  async deleteRecipe(id: string) {
    // First delete all recipe items
    await prisma.recipeItem.deleteMany({
      where: { recipeId: id }
    });

    // Then delete the recipe
    return prisma.recipe.delete({
      where: { id }
    });
  },

  async calculateCost(recipeItems: Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>[]) {
    let totalCost = 0;

    for (const item of recipeItems) {
      const rawMaterial = await prisma.rawMaterial.findUnique({
        where: { id: item.rawMaterialId }
      });

      if (rawMaterial) {
        totalCost += rawMaterial.costPerUnit * item.quantity;
      }
    }

    return totalCost;
  }
}; 