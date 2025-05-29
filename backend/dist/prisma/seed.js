"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const meal_types_1 = require("../src/types/meal.types");
const bcrypt = __importStar(require("bcryptjs"));
const delivery_agents_1 = require("../src/database/seeds/delivery-agents");
const recipes_seed_1 = require("../src/database/seeds/recipes.seed");
const raw_materials_seed_1 = require("../src/database/seeds/raw-materials.seed");
const prisma = new client_1.PrismaClient();
const southIndianRecipes = [
    // Breakfast Items
    {
        name: 'Masala Dosa',
        description: 'Crispy rice and lentil crepe filled with spiced potato filling, served with sambar and coconut chutney.',
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.BREAKFAST,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.BREAKFAST,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.BREAKFAST,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.BREAKFAST,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.BREAKFAST,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.BREAKFAST,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.LUNCH,
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
        category: meal_types_1.MealCategory.NON_VEGETARIAN,
        type: client_1.MealType.DINNER,
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
        category: meal_types_1.MealCategory.VEGETARIAN,
        type: client_1.MealType.LUNCH,
        instructions: '1. Prepare vegetables\n2. Cook rice\n3. Layer and cook\n4. Garnish with fried onions',
        preparationTime: 35,
        cookingTime: 40,
        servings: 4,
        costPerServing: 120,
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500'
    }
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Start seeding...');
        try {
            // Clean up all data in correct order
            yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Delete in reverse order of dependencies
                yield tx.recipeItem.deleteMany().catch(() => { });
                yield tx.recipe.deleteMany().catch(() => { });
                yield tx.productionItem.deleteMany().catch(() => { });
                yield tx.productionSchedule.deleteMany().catch(() => { });
                yield tx.menuItem.deleteMany().catch(() => { });
                yield tx.dailyMenu.deleteMany().catch(() => { });
                yield tx.menuCalendar.deleteMany().catch(() => { });
                yield tx.mealFeedback.deleteMany().catch(() => { });
                yield tx.orderItem.deleteMany().catch(() => { });
                yield tx.order.deleteMany().catch(() => { });
                yield tx.payment.deleteMany().catch(() => { });
                yield tx.subscription.deleteMany().catch(() => { });
                yield tx.plan.deleteMany().catch(() => { });
                yield tx.deliveryStatus.deleteMany().catch(() => { });
                yield tx.delivery.deleteMany().catch(() => { });
                yield tx.deliveryAgent.deleteMany().catch(() => { });
                yield tx.address.deleteMany().catch(() => { });
                yield tx.feedbackResponse.deleteMany().catch(() => { });
                yield tx.feedback.deleteMany().catch(() => { });
                yield tx.issue.deleteMany().catch(() => { });
                yield tx.wasteRecord.deleteMany().catch(() => { });
                yield tx.inventoryItem.deleteMany().catch(() => { });
                yield tx.rawMaterial.deleteMany().catch(() => { });
                yield tx.tiffinBox.deleteMany().catch(() => { });
                yield tx.tower.deleteMany().catch(() => { });
                yield tx.apartment.deleteMany().catch(() => { });
                yield tx.costApproval.deleteMany().catch(() => { });
                yield tx.cost.deleteMany().catch(() => { });
                yield tx.costCategory.deleteMany().catch(() => { });
                yield tx.staffCost.deleteMany().catch(() => { });
                yield tx.equipmentCost.deleteMany().catch(() => { });
                yield tx.facilityCost.deleteMany().catch(() => { });
                yield tx.user.deleteMany().catch(() => { });
            }));
            // Create admin user
            const adminPassword = yield bcrypt.hash('admin123', 10);
            const admin = yield prisma.user.create({
                data: {
                    email: 'admin@kola.com',
                    password: adminPassword,
                    name: 'Admin User',
                    phoneNumber: '1234567890',
                    role: client_1.Role.ADMIN
                }
            });
            // Create shrayank admin user
            yield prisma.user.create({
                data: {
                    email: 'shrayank@kolameals.com',
                    password: yield bcrypt.hash('Shrayank@1234', 10),
                    name: 'Shrayank K',
                    phoneNumber: '9999999999',
                    role: client_1.Role.ADMIN
                }
            });
            // Seed delivery agents
            yield (0, delivery_agents_1.seedDeliveryAgents)();
            // Create cost categories
            const categories = yield Promise.all([
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
            yield prisma.staffCost.create({
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
            yield prisma.equipmentCost.create({
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
            yield prisma.facilityCost.create({
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
            yield prisma.deliveryCostConfig.upsert({
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
            for (const material of raw_materials_seed_1.rawMaterials) {
                const created = yield prisma.rawMaterial.create({
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
            for (const recipe of recipes_seed_1.recipes) {
                // First create the meal
                const meal = yield prisma.meal.create({
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
                const createdRecipe = yield prisma.recipe.create({
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
                        yield prisma.recipeItem.create({
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
        }
        catch (error) {
            console.error('Error during seeding:', error);
            throw error;
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
