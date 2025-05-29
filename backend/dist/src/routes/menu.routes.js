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
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const menu_service_1 = require("../services/menu.service");
const menu_types_1 = require("../types/menu.types");
const zod_1 = require("zod");
const router = express_1.default.Router();
// Menu Item Routes
router.post('/items', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = menu_types_1.createMenuItemSchema.parse(req.body);
        const menuItem = yield menu_service_1.menuService.createMenuItem(data);
        res.status(201).json(menuItem);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}));
router.put('/items/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = menu_types_1.updateMenuItemSchema.parse(req.body);
        const menuItem = yield menu_service_1.menuService.updateMenuItem(req.params.id, data);
        res.json(menuItem);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}));
router.delete('/items/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield menu_service_1.menuService.deleteMenuItem(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Daily Menu Routes
router.post('/daily', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = menu_types_1.createDailyMenuSchema.parse(req.body);
        const dailyMenu = yield menu_service_1.menuService.createDailyMenu(data);
        res.status(201).json(dailyMenu);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}));
router.put('/daily/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = menu_types_1.updateDailyMenuSchema.parse(req.body);
        const dailyMenu = yield menu_service_1.menuService.updateDailyMenu(req.params.id, data);
        res.json(dailyMenu);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}));
router.get('/daily/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dailyMenu = yield menu_service_1.menuService.getDailyMenuById(req.params.id);
        if (!dailyMenu) {
            return res.status(404).json({ error: 'Daily menu not found' });
        }
        res.json(dailyMenu);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/daily/date/:date', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date(req.params.date);
        const dailyMenu = yield menu_service_1.menuService.getDailyMenuByDate(date);
        if (!dailyMenu) {
            return res.status(404).json({ error: 'Daily menu not found' });
        }
        res.json(dailyMenu);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Menu Calendar Routes
router.post('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = menu_types_1.createMenuCalendarSchema.parse(req.body);
        const menuCalendar = yield menu_service_1.menuService.createMenuCalendar(data);
        res.status(201).json(menuCalendar);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}));
router.put('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = menu_types_1.updateMenuCalendarSchema.parse(req.body);
        const menuCalendar = yield menu_service_1.menuService.updateMenuCalendar(req.params.id, data);
        res.json(menuCalendar);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}));
router.get('/:id', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuCalendar = yield menu_service_1.menuService.getMenuCalendarById(req.params.id);
        if (!menuCalendar) {
            return res.status(404).json({ error: 'Menu calendar not found' });
        }
        res.json(menuCalendar);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN', 'CUSTOMER']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const menuCalendar = yield menu_service_1.menuService.getMenuCalendarByDateRange(new Date(startDate), new Date(endDate));
        if (!menuCalendar) {
            return res.status(404).json({ error: 'Menu calendar not found' });
        }
        res.json(menuCalendar);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
