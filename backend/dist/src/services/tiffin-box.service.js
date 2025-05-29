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
exports.tiffinBoxService = void 0;
const client_1 = require("@prisma/client");
const error_types_1 = require("../types/error.types");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
exports.tiffinBoxService = {
    getAvailableTiffinBoxes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const boxes = yield prisma_1.default.tiffinBox.findMany({
                    where: {
                        status: client_1.TiffinBoxStatusEnum.AVAILABLE
                    },
                    orderBy: {
                        lastUsed: 'asc'
                    }
                });
                return boxes;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching available tiffin boxes:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching available tiffin boxes', 500);
            }
        });
    },
    reportDamage(boxId, damageReport) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const box = yield prisma_1.default.tiffinBox.findUnique({
                    where: { id: boxId }
                });
                if (!box) {
                    throw new error_types_1.AppError('Tiffin box not found', 404);
                }
                const updatedBox = yield prisma_1.default.tiffinBox.update({
                    where: { id: boxId },
                    data: {
                        status: client_1.TiffinBoxStatusEnum.DAMAGED,
                        damageReport,
                        lastUsed: new Date()
                    }
                });
                return updatedBox;
            }
            catch (error) {
                logger_config_1.default.error('Error reporting tiffin box damage:', { error, boxId });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error reporting tiffin box damage', 500);
            }
        });
    },
    updateStatus(boxId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const box = yield prisma_1.default.tiffinBox.findUnique({
                    where: { id: boxId }
                });
                if (!box) {
                    throw new error_types_1.AppError('Tiffin box not found', 404);
                }
                const updatedBox = yield prisma_1.default.tiffinBox.update({
                    where: { id: boxId },
                    data: {
                        status,
                        lastUsed: new Date()
                    }
                });
                return updatedBox;
            }
            catch (error) {
                logger_config_1.default.error('Error updating tiffin box status:', { error, boxId, status });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error updating tiffin box status', 500);
            }
        });
    },
    getDamagedBoxes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const boxes = yield prisma_1.default.tiffinBox.findMany({
                    where: {
                        status: client_1.TiffinBoxStatusEnum.DAMAGED
                    },
                    orderBy: {
                        lastUsed: 'desc'
                    }
                });
                return boxes;
            }
            catch (error) {
                logger_config_1.default.error('Error fetching damaged tiffin boxes:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error fetching damaged tiffin boxes', 500);
            }
        });
    },
    createTiffinBox() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const box = yield prisma_1.default.tiffinBox.create({
                    data: {
                        status: client_1.TiffinBoxStatusEnum.AVAILABLE,
                        lastUsed: new Date()
                    }
                });
                return box;
            }
            catch (error) {
                logger_config_1.default.error('Error creating tiffin box:', { error });
                if (error instanceof error_types_1.AppError)
                    throw error;
                throw new error_types_1.AppError('Error creating tiffin box', 500);
            }
        });
    }
};
