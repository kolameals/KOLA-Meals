"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.recipeService = {
    getAllRecipes() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.recipe.findMany({
                include: {
                    recipeItems: {
                        include: {
                            rawMaterial: true
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
        });
    },
    getRecipeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.recipe.findUnique({
                where: { id },
                include: {
                    recipeItems: {
                        include: {
                            rawMaterial: true
                        }
                    }
                }
            });
        });
    },
    createRecipe(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recipeItems } = data, recipeData = __rest(data, ["recipeItems"]);
            return prisma_1.default.recipe.create({
                data: Object.assign(Object.assign({}, recipeData), { recipeItems: {
                        create: recipeItems
                    } }),
                include: {
                    recipeItems: {
                        include: {
                            rawMaterial: true
                        }
                    }
                }
            });
        });
    },
    updateRecipe(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recipeItems } = data, recipeData = __rest(data, ["recipeItems"]);
            // If recipeItems are provided, delete existing items and create new ones
            if (recipeItems) {
                yield prisma_1.default.recipeItem.deleteMany({
                    where: { recipeId: id }
                });
            }
            return prisma_1.default.recipe.update({
                where: { id },
                data: Object.assign(Object.assign({}, recipeData), (recipeItems && {
                    recipeItems: {
                        create: recipeItems
                    }
                })),
                include: {
                    recipeItems: {
                        include: {
                            rawMaterial: true
                        }
                    }
                }
            });
        });
    },
    deleteRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // First delete all recipe items
            yield prisma_1.default.recipeItem.deleteMany({
                where: { recipeId: id }
            });
            // Then delete the recipe
            return prisma_1.default.recipe.delete({
                where: { id }
            });
        });
    },
    calculateCost(recipeItems) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalCost = 0;
            for (const item of recipeItems) {
                const rawMaterial = yield prisma_1.default.rawMaterial.findUnique({
                    where: { id: item.rawMaterialId }
                });
                if (rawMaterial) {
                    totalCost += rawMaterial.costPerUnit * item.quantity;
                }
            }
            return totalCost;
        });
    }
};
