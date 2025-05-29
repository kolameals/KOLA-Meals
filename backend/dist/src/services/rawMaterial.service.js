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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawMaterialService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.rawMaterialService = {
    getAllRawMaterials() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.rawMaterial.findMany({
                orderBy: { name: 'asc' }
            });
        });
    },
    getRawMaterialById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.rawMaterial.findUnique({
                where: { id },
                include: {
                    recipeItems: {
                        include: {
                            recipe: true
                        }
                    }
                }
            });
        });
    },
    createRawMaterial(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.rawMaterial.create({
                data
            });
        });
    },
    updateRawMaterial(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.rawMaterial.update({
                where: { id },
                data
            });
        });
    },
    deleteRawMaterial(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if the raw material is used in any recipes
            const recipeItems = yield prisma_1.default.recipeItem.findMany({
                where: { rawMaterialId: id }
            });
            if (recipeItems.length > 0) {
                throw new Error('Cannot delete raw material that is used in recipes');
            }
            return prisma_1.default.rawMaterial.delete({
                where: { id }
            });
        });
    },
    updateStock(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawMaterial = yield prisma_1.default.rawMaterial.findUnique({
                where: { id }
            });
            if (!rawMaterial) {
                throw new Error('Raw material not found');
            }
            return prisma_1.default.rawMaterial.update({
                where: { id },
                data: {
                    currentStock: rawMaterial.currentStock + quantity
                }
            });
        });
    }
};
