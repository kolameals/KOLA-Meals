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
const production_service_1 = require("../services/production.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all production schedules (optionally filter by date/mealType)
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, mealType } = req.query;
        const schedules = yield production_service_1.productionService.getSchedules({
            startDate: date ? new Date(date) : undefined,
            mealType: mealType
        });
        res.json(schedules);
    }
    catch (error) {
        console.error('Error fetching production schedules:', error);
        res.status(500).json({ error: 'Failed to fetch production schedules' });
    }
}));
// Get a single production schedule by ID
router.get('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield production_service_1.productionService.getScheduleById(req.params.id);
        if (!schedule)
            return res.status(404).json({ error: 'Schedule not found' });
        res.json(schedule);
    }
    catch (error) {
        console.error('Error fetching production schedule:', error);
        res.status(500).json({ error: 'Failed to fetch production schedule' });
    }
}));
// Create a new production schedule
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield production_service_1.productionService.createSchedule(req.body);
        res.status(201).json(schedule);
    }
    catch (error) {
        console.error('Error creating production schedule:', error);
        res.status(500).json({ error: 'Failed to create production schedule' });
    }
}));
// Update a production schedule
router.put('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedule = yield production_service_1.productionService.updateSchedule(req.params.id, req.body);
        res.json(schedule);
    }
    catch (error) {
        console.error('Error updating production schedule:', error);
        res.status(500).json({ error: 'Failed to update production schedule' });
    }
}));
// Delete a production schedule
router.delete('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield production_service_1.productionService.deleteSchedule(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting production schedule:', error);
        res.status(500).json({ error: 'Failed to delete production schedule' });
    }
}));
// Update a production item (actual quantity, status)
router.patch('/item/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield production_service_1.productionService.updateProductionItem(req.params.id, req.body);
        res.json(item);
    }
    catch (error) {
        console.error('Error updating production item:', error);
        res.status(500).json({ error: 'Failed to update production item' });
    }
}));
// Auto-generate a production schedule for a date/mealType
router.post('/auto-generate', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, mealType, startTime, endTime } = req.body;
        const schedule = yield production_service_1.productionService.autoGenerateSchedule(date, mealType);
        res.status(201).json(schedule);
    }
    catch (error) {
        console.error('Error auto-generating production schedule:', error);
        const message = error instanceof Error ? error.message : 'Failed to auto-generate production schedule';
        res.status(500).json({ error: message });
    }
}));
exports.default = router;
