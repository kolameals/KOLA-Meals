import { AppError } from '../types/error.types.js';
import prisma from '../lib/prisma.js';
import { RawMaterial } from '@prisma/client';

export const rawMaterialService = {
  async getAllRawMaterials() {
    return prisma.rawMaterial.findMany({
      orderBy: { name: 'asc' }
    });
  },

  async getRawMaterialById(id: string) {
    return prisma.rawMaterial.findUnique({
      where: { id },
      include: {
        recipeItems: {
          include: {
            recipe: true
          }
        }
      }
    });
  },

  async createRawMaterial(data: Omit<RawMaterial, 'id' | 'createdAt' | 'lastUpdated'>) {
    return prisma.rawMaterial.create({
      data
    });
  },

  async updateRawMaterial(id: string, data: Partial<Omit<RawMaterial, 'id' | 'createdAt' | 'lastUpdated'>>) {
    return prisma.rawMaterial.update({
      where: { id },
      data
    });
  },

  async deleteRawMaterial(id: string) {
    // First check if the raw material is used in any recipes
    const recipeItems = await prisma.recipeItem.findMany({
      where: { rawMaterialId: id }
    });

    if (recipeItems.length > 0) {
      throw new Error('Cannot delete raw material that is used in recipes');
    }

    return prisma.rawMaterial.delete({
      where: { id }
    });
  },

  async updateStock(id: string, quantity: number) {
    const rawMaterial = await prisma.rawMaterial.findUnique({
      where: { id }
    });

    if (!rawMaterial) {
      throw new Error('Raw material not found');
    }

    return prisma.rawMaterial.update({
      where: { id },
      data: {
        currentStock: rawMaterial.currentStock + quantity
      }
    });
  }
}; 