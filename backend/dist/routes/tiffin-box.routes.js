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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tiffin_box_service_1 = require("../services/tiffin-box.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Get available tiffin boxes
router.get('/available', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'DELIVERY_PARTNER']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boxes = yield tiffin_box_service_1.tiffinBoxService.getAvailableTiffinBoxes();
        res.json(boxes);
    }
    catch (error) {
        next(error);
    }
}));
// Get damaged tiffin boxes
router.get('/damaged', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boxes = yield tiffin_box_service_1.tiffinBoxService.getDamagedBoxes();
        res.json(boxes);
    }
    catch (error) {
        next(error);
    }
}));
// Report damage
router.post('/:boxId/damage', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'DELIVERY_PARTNER']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        damageReport: zod_1.z.string()
    })
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const box = yield tiffin_box_service_1.tiffinBoxService.reportDamage(req.params.boxId, req.body.damageReport);
        res.json(box);
    }
    catch (error) {
        next(error);
    }
}));
// Update status
router.patch('/:boxId/status', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (0, validation_middleware_1.validateRequest)({
    body: zod_1.z.object({
        status: zod_1.z.enum(['AVAILABLE', 'IN_USE', 'DAMAGED', 'RETIRED'])
    })
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const box = yield tiffin_box_service_1.tiffinBoxService.updateStatus(req.params.boxId, req.body.status);
        res.json(box);
    }
    catch (error) {
        next(error);
    }
}));
// Create new tiffin box
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const box = yield tiffin_box_service_1.tiffinBoxService.createTiffinBox();
        res.json(box);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
