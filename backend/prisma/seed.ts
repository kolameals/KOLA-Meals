import { PrismaClient, Role, SubscriptionStatus, MealType } from '@prisma/client';
import { MealCategory } from '../src/types/meal.types';
import * as bcrypt from 'bcryptjs';
import { seedDeliveryAgents } from '../src/database/seeds/delivery-agents';
import { recipes } from '../src/database/seeds/recipes.seed';
import { rawMaterials } from '../src/database/seeds/raw-materials.seed';

const prisma = new PrismaClient();

const southIndianRecipes = [
  // Breakfast Items
  {
    name: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato filling, served with sambar and coconut chutney.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Prepare dosa batter with rice and urad dal\n2. Make potato masala filling\n3. Spread dosa batter on hot griddle\n4. Add filling and fold',
    preparationTime: 30,
    cookingTime: 15,
    servings: 2,
    costPerServing: 50,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500'
  },
  {
    name: 'Idli Sambar',
    description: 'Steamed rice and lentil cakes served with spiced lentil soup and coconut chutney.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Prepare idli batter\n2. Steam in idli molds\n3. Make sambar with vegetables\n4. Serve hot with chutney',
    preparationTime: 20,
    cookingTime: 20,
    servings: 4,
    costPerServing: 40,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Pongal',
    description: 'Creamy rice and moong dal porridge seasoned with black pepper and cumin.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Cook rice and dal together\n2. Add ghee and spices\n3. Cook until creamy\n4. Serve hot',
    preparationTime: 15,
    cookingTime: 25,
    servings: 4,
    costPerServing: 35,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Egg Dosa',
    description: 'Crispy dosa topped with beaten egg and spices.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Prepare dosa batter\n2. Spread on griddle\n3. Add beaten egg\n4. Cook until crispy',
    preparationTime: 20,
    cookingTime: 10,
    servings: 2,
    costPerServing: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Upma',
    description: 'Savory semolina porridge with vegetables and spices.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Roast semolina\n2. Sauté vegetables\n3. Add water and cook\n4. Season with spices',
    preparationTime: 10,
    cookingTime: 15,
    servings: 3,
    costPerServing: 30,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },

  // Lunch Items
  {
    name: 'Meals Plate',
    description: 'Traditional South Indian thali with rice, sambar, rasam, curries, and papad.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Prepare all curries\n2. Make sambar and rasam\n3. Cook rice\n4. Arrange on banana leaf',
    preparationTime: 45,
    cookingTime: 30,
    servings: 1,
    costPerServing: 120,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Chicken Chettinad',
    description: 'Spicy chicken curry in Chettinad style with coconut and black pepper.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Marinate chicken\n2. Prepare masala paste\n3. Cook chicken in masala\n4. Finish with curry leaves',
    preparationTime: 30,
    cookingTime: 40,
    servings: 4,
    costPerServing: 150,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Fish Curry',
    description: 'Fish cooked in tangy tamarind and coconut gravy.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Clean and cut fish\n2. Prepare masala\n3. Cook in tamarind gravy\n4. Add coconut milk',
    preparationTime: 25,
    cookingTime: 30,
    servings: 4,
    costPerServing: 180,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Avial',
    description: 'Mixed vegetables in coconut and yogurt gravy.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cut vegetables\n2. Prepare coconut paste\n3. Cook vegetables\n4. Add yogurt and curry leaves',
    preparationTime: 30,
    cookingTime: 25,
    servings: 4,
    costPerServing: 80,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Mutton Pepper Fry',
    description: 'Spicy mutton stir-fry with black pepper and curry leaves.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Marinate mutton\n2. Prepare masala\n3. Cook mutton\n4. Finish with pepper',
    preparationTime: 35,
    cookingTime: 45,
    servings: 4,
    costPerServing: 200,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },

  // Dinner Items
  {
    name: 'Kerala Fish Molee',
    description: 'Fish cooked in coconut milk with mild spices.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Clean fish\n2. Prepare coconut milk\n3. Cook fish gently\n4. Add vegetables',
    preparationTime: 25,
    cookingTime: 30,
    servings: 4,
    costPerServing: 160,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Vegetable Stew',
    description: 'Mild coconut milk based vegetable stew with whole spices.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Cut vegetables\n2. Prepare coconut milk\n3. Cook vegetables\n4. Add whole spices',
    preparationTime: 20,
    cookingTime: 25,
    servings: 4,
    costPerServing: 70,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Chicken Stew',
    description: 'Kerala style chicken stew in coconut milk.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Cut chicken\n2. Prepare coconut milk\n3. Cook chicken\n4. Add vegetables',
    preparationTime: 25,
    cookingTime: 35,
    servings: 4,
    costPerServing: 140,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Puttu',
    description: 'Steamed rice flour cylinders with coconut.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Mix rice flour\n2. Layer with coconut\n3. Steam\n4. Serve with curry',
    preparationTime: 15,
    cookingTime: 20,
    servings: 4,
    costPerServing: 50,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Appam',
    description: 'Lacy rice and coconut pancakes.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Prepare batter\n2. Ferment\n3. Cook in appam pan\n4. Serve with stew',
    preparationTime: 20,
    cookingTime: 15,
    servings: 4,
    costPerServing: 60,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },

  // Additional Items
  {
    name: 'Vada Sambar',
    description: 'Crispy lentil fritters served with sambar.',
    category: MealCategory.VEGETARIAN,
    type: MealType.BREAKFAST,
    instructions: '1. Prepare vada batter\n2. Shape and fry\n3. Make sambar\n4. Serve hot',
    preparationTime: 25,
    cookingTime: 20,
    servings: 4,
    costPerServing: 45,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Kerala Parotta',
    description: 'Layered flatbread made with maida.',
    category: MealCategory.VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Prepare dough\n2. Make layers\n3. Cook on griddle\n4. Serve with curry',
    preparationTime: 30,
    cookingTime: 20,
    servings: 4,
    costPerServing: 40,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Prawn Curry',
    description: 'Prawns cooked in spicy coconut gravy.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Clean prawns\n2. Prepare masala\n3. Cook in gravy\n4. Add coconut milk',
    preparationTime: 25,
    cookingTime: 25,
    servings: 4,
    costPerServing: 220,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Kootu Curry',
    description: 'Mixed vegetables and lentils in coconut gravy.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cook vegetables\n2. Prepare coconut paste\n3. Combine and cook\n4. Season with spices',
    preparationTime: 25,
    cookingTime: 30,
    servings: 4,
    costPerServing: 65,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Kerala Biryani',
    description: 'Fragrant rice dish with chicken and spices.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Marinate chicken\n2. Prepare rice\n3. Layer and cook\n4. Garnish with fried onions',
    preparationTime: 40,
    cookingTime: 45,
    servings: 4,
    costPerServing: 180,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Parippu Curry',
    description: 'Yellow dal with coconut and spices.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cook dal\n2. Prepare coconut paste\n3. Combine and cook\n4. Season with spices',
    preparationTime: 15,
    cookingTime: 25,
    servings: 4,
    costPerServing: 40,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Kerala Fish Fry',
    description: 'Spiced fish fillets shallow fried.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Marinate fish\n2. Prepare masala\n3. Shallow fry\n4. Serve with chutney',
    preparationTime: 20,
    cookingTime: 15,
    servings: 4,
    costPerServing: 160,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Thenga Choru',
    description: 'Coconut rice with tempered spices.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Cook rice\n2. Prepare coconut paste\n3. Temper spices\n4. Combine all',
    preparationTime: 20,
    cookingTime: 25,
    servings: 4,
    costPerServing: 50,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Kerala Chicken Roast',
    description: 'Spicy dry chicken roast with curry leaves.',
    category: MealCategory.NON_VEGETARIAN,
    type: MealType.DINNER,
    instructions: '1. Marinate chicken\n2. Prepare masala\n3. Roast chicken\n4. Finish with curry leaves',
    preparationTime: 30,
    cookingTime: 40,
    servings: 4,
    costPerServing: 170,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  },
  {
    name: 'Kerala Vegetable Biryani',
    description: 'Fragrant rice dish with mixed vegetables.',
    category: MealCategory.VEGETARIAN,
    type: MealType.LUNCH,
    instructions: '1. Prepare vegetables\n2. Cook rice\n3. Layer and cook\n4. Garnish with fried onions',
    preparationTime: 35,
    cookingTime: 40,
    servings: 4,
    costPerServing: 120,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
  }
];

async function main() {
  console.log('Start seeding...');

  try {
    // Clean up all data in correct order
    await prisma.$transaction(async (tx) => {
      // Delete in reverse order of dependencies
      await tx.recipeItem.deleteMany().catch(() => {});
      await tx.recipe.deleteMany().catch(() => {});
      await tx.productionItem.deleteMany().catch(() => {});
      await tx.productionSchedule.deleteMany().catch(() => {});
      await tx.menuItem.deleteMany().catch(() => {});
      await tx.dailyMenu.deleteMany().catch(() => {});
      await tx.menuCalendar.deleteMany().catch(() => {});
      await tx.mealFeedback.deleteMany().catch(() => {});
      await tx.orderItem.deleteMany().catch(() => {});
      await tx.order.deleteMany().catch(() => {});
      await tx.payment.deleteMany().catch(() => {});
      await tx.subscription.deleteMany().catch(() => {});
      await tx.plan.deleteMany().catch(() => {});
      await tx.deliveryStatus.deleteMany().catch(() => {});
      await tx.delivery.deleteMany().catch(() => {});
      await tx.deliveryAgent.deleteMany().catch(() => {});
      await tx.address.deleteMany().catch(() => {});
      await tx.feedbackResponse.deleteMany().catch(() => {});
      await tx.feedback.deleteMany().catch(() => {});
      await tx.issue.deleteMany().catch(() => {});
      await tx.wasteRecord.deleteMany().catch(() => {});
      await tx.inventoryItem.deleteMany().catch(() => {});
      await tx.rawMaterial.deleteMany().catch(() => {});
      await tx.tiffinBox.deleteMany().catch(() => {});
      await tx.tower.deleteMany().catch(() => {});
      await tx.apartment.deleteMany().catch(() => {});
      await tx.costApproval.deleteMany().catch(() => {});
      await tx.cost.deleteMany().catch(() => {});
      await tx.costCategory.deleteMany().catch(() => {});
      await tx.staffCost.deleteMany().catch(() => {});
      await tx.equipmentCost.deleteMany().catch(() => {});
      await tx.facilityCost.deleteMany().catch(() => {});
      await tx.user.deleteMany().catch(() => {});
    });

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@kola.com',
        password: adminPassword,
        name: 'Admin User',
        phoneNumber: '1234567890',
        role: Role.ADMIN
      }
    });

    // Create shrayank admin user
    await prisma.user.create({
      data: {
        email: 'shrayank@kolameals.com',
        password: await bcrypt.hash('Shrayank@1234', 10),
        name: 'Shrayank K',
        phoneNumber: '9999999999',
        role: Role.ADMIN
      }
    });

    // Seed delivery agents
    await seedDeliveryAgents();

    // Create cost categories
    const categories = await Promise.all([
      prisma.costCategory.create({
        data: {
          name: 'Staff Salaries',
          description: 'Monthly staff salaries and wages',
          type: 'STAFF',
          frequency: 'MONTHLY'
        }
      }),
      prisma.costCategory.create({
        data: {
          name: 'Equipment',
          description: 'Kitchen equipment and maintenance',
          type: 'EQUIPMENT',
          frequency: 'ONE_TIME'
        }
      }),
      prisma.costCategory.create({
        data: {
          name: 'Facility',
          description: 'Rent, utilities, and maintenance',
          type: 'FACILITY',
          frequency: 'MONTHLY'
        }
      })
    ]);

    // Create sample staff cost
    await prisma.staffCost.create({
      data: {
        userId: admin.id,
        baseSalary: 25000,
        allowances: 5000,
        deductions: 2000,
        paymentFrequency: 'MONTHLY',
        bankDetails: {
          accountNumber: '1234567890',
          bankName: 'Sample Bank',
          ifscCode: 'SMPL0001234'
        }
      }
    });

    // Create sample equipment cost
    await prisma.equipmentCost.create({
      data: {
        name: 'Commercial Oven',
        description: 'Large commercial oven for bulk cooking',
        purchaseDate: new Date(),
        purchaseAmount: 150000,
        emiAmount: 15000,
        emiFrequency: 'MONTHLY',
        totalEmis: 12,
        remainingEmis: 12
      }
    });

    // Create sample facility cost
    await prisma.facilityCost.create({
      data: {
        name: 'Kitchen Space',
        description: 'Commercial kitchen rental',
        rentAmount: 50000,
        maintenanceAmount: 5000,
        utilitiesAmount: 10000,
        frequency: 'MONTHLY'
      }
    });

    // Create default delivery cost configuration
    await prisma.deliveryCostConfig.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        costPerAgent: 8000.00
      }
    });

    // Seed raw materials
    console.log('Seeding raw materials...');
    const rawMaterialMap = new Map();
    for (const material of rawMaterials) {
      const created = await prisma.rawMaterial.create({
        data: {
          name: material.name,
          category: material.category,
          unit: material.unit,
          currentStock: material.currentStock,
          minimumStock: material.minimumStock,
          costPerUnit: material.costPerUnit
        }
      });
      rawMaterialMap.set(material.name, created.id);
    }
    console.log('Raw materials seeded successfully!');

    // Seed recipes
    console.log('Seeding recipes...');
    for (const recipe of recipes) {
      // First create the meal
      const meal = await prisma.meal.create({
        data: {
          name: recipe.name,
          description: recipe.description,
          price: recipe.costPerServing,
          type: recipe.type,
          category: recipe.category,
          image: recipe.imageUrl
        }
      });

      // Then create the recipe linked to the meal
      const createdRecipe = await prisma.recipe.create({
        data: {
          name: recipe.name,
          description: recipe.description,
          instructions: recipe.instructions,
          preparationTime: recipe.preparationTime,
          cookingTime: recipe.cookingTime,
          servings: recipe.servings,
          costPerServing: recipe.costPerServing,
          category: recipe.category,
          type: recipe.type,
          imageUrl: recipe.imageUrl,
          mealId: meal.id
        }
      });

      // Create recipe items
      for (const ingredient of recipe.ingredients) {
        const rawMaterialId = rawMaterialMap.get(ingredient.name);
        if (rawMaterialId) {
          // Skip ingredients with non-numeric quantities
          if (ingredient.quantity === 'to taste' || isNaN(parseFloat(ingredient.quantity))) {
            continue;
          }
          
          await prisma.recipeItem.create({
            data: {
              recipe: {
                connect: {
                  id: createdRecipe.id
                }
              },
              rawMaterial: {
                connect: {
                  id: rawMaterialId
                }
              },
              quantity: parseFloat(ingredient.quantity),
              unit: ingredient.unit
            }
          });
        }
      }
    }
    console.log('Recipes seeded successfully!');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 