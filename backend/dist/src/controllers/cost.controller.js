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
exports.getCostCategories = exports.getCostSummary = exports.createFacilityCost = exports.getFacilityCostById = exports.getFacilityCosts = exports.createEquipmentCost = exports.getEquipmentCostById = exports.getEquipmentCosts = exports.createStaffCost = exports.getStaffCostById = exports.getStaffCosts = exports.updateDeliveryCostConfig = exports.getDeliveryCostConfig = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
// Get delivery cost configuration
const getDeliveryCostConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield prisma_1.default.deliveryCostConfig.findFirst();
        if (!config) {
            return res.status(404).json({ error: 'Delivery cost configuration not found' });
        }
        res.json(config);
    }
    catch (error) {
        console.error('Error fetching delivery cost config:', error);
        res.status(500).json({ error: 'Failed to fetch delivery cost configuration' });
    }
});
exports.getDeliveryCostConfig = getDeliveryCostConfig;
// Update delivery cost configuration
const updateDeliveryCostConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { costPerAgent } = req.body;
        if (typeof costPerAgent !== 'number' || costPerAgent <= 0) {
            return res.status(400).json({ error: 'Invalid cost per agent value' });
        }
        const config = yield prisma_1.default.deliveryCostConfig.upsert({
            where: { id: 1 },
            update: { costPerAgent: new client_1.Prisma.Decimal(costPerAgent) },
            create: { costPerAgent: new client_1.Prisma.Decimal(costPerAgent) }
        });
        res.json(config);
    }
    catch (error) {
        console.error('Error updating delivery cost config:', error);
        res.status(500).json({ error: 'Failed to update delivery cost configuration' });
    }
});
exports.updateDeliveryCostConfig = updateDeliveryCostConfig;
// Staff Costs
const getStaffCosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Get the current delivery cost configuration
        const costConfig = yield prisma_1.default.deliveryCostConfig.findFirst();
        const costPerAgent = costConfig ? Number(costConfig.costPerAgent) : 8000;
        const [deliveryPartners, total] = yield Promise.all([
            prisma_1.default.user.findMany({
                where: {
                    role: 'DELIVERY_PARTNER'
                },
                include: {
                    deliveryAgent: {
                        include: {
                            apartment: {
                                include: {
                                    towers: true
                                }
                            }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma_1.default.user.count({
                where: {
                    role: 'DELIVERY_PARTNER'
                }
            })
        ]);
        // Transform the response to match the frontend's expected StaffCost structure
        const staffCosts = deliveryPartners.map(partner => {
            return {
                id: partner.id,
                userId: partner.id,
                baseSalary: costPerAgent,
                allowances: 0,
                deductions: 0,
                paymentFrequency: 'MONTHLY',
                bankDetails: {
                    accountNumber: '',
                    bankName: '',
                    ifscCode: ''
                },
                createdAt: partner.createdAt,
                updatedAt: partner.updatedAt,
                user: {
                    id: partner.id,
                    name: partner.name,
                    email: partner.email,
                    phoneNumber: partner.phoneNumber || '',
                    role: partner.role
                }
            };
        });
        res.json(staffCosts);
    }
    catch (error) {
        console.error('Error fetching staff costs:', error);
        res.status(500).json({ error: 'Failed to fetch staff costs' });
    }
});
exports.getStaffCosts = getStaffCosts;
const getStaffCostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const costId = parseInt(id, 10);
        if (isNaN(costId)) {
            return res.status(400).json({ error: 'Invalid cost ID' });
        }
        const cost = yield prisma_1.default.staffCost.findUnique({
            where: { id: costId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                        role: true
                    }
                }
            }
        });
        if (!cost) {
            return res.status(404).json({ error: 'Staff cost not found' });
        }
        res.json(cost);
    }
    catch (error) {
        console.error('Error fetching staff cost:', error);
        res.status(500).json({ error: 'Failed to fetch staff cost' });
    }
});
exports.getStaffCostById = getStaffCostById;
const createStaffCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, baseSalary, allowances, deductions, paymentFrequency, bankDetails } = req.body;
        const cost = yield prisma_1.default.staffCost.create({
            data: {
                userId,
                baseSalary: new client_1.Prisma.Decimal(baseSalary),
                allowances: new client_1.Prisma.Decimal(allowances),
                deductions: new client_1.Prisma.Decimal(deductions),
                paymentFrequency,
                bankDetails
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                        role: true
                    }
                }
            }
        });
        res.status(201).json(cost);
    }
    catch (error) {
        console.error('Error creating staff cost:', error);
        res.status(500).json({ error: 'Failed to create staff cost' });
    }
});
exports.createStaffCost = createStaffCost;
// Equipment Costs
const getEquipmentCosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const costs = yield prisma_1.default.equipmentCost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(costs);
    }
    catch (error) {
        console.error('Error fetching equipment costs:', error);
        res.status(500).json({ error: 'Failed to fetch equipment costs' });
    }
});
exports.getEquipmentCosts = getEquipmentCosts;
const getEquipmentCostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const costId = parseInt(id, 10);
        if (isNaN(costId)) {
            return res.status(400).json({ error: 'Invalid cost ID' });
        }
        const cost = yield prisma_1.default.equipmentCost.findUnique({
            where: { id: costId }
        });
        if (!cost) {
            return res.status(404).json({ error: 'Equipment cost not found' });
        }
        res.json(cost);
    }
    catch (error) {
        console.error('Error fetching equipment cost:', error);
        res.status(500).json({ error: 'Failed to fetch equipment cost' });
    }
});
exports.getEquipmentCostById = getEquipmentCostById;
const createEquipmentCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, paymentType, purchaseDate, purchaseAmount, emiAmount, emiFrequency, totalEmis, remainingEmis, monthlyRent, securityDeposit, rentDuration } = req.body;
        const cost = yield prisma_1.default.equipmentCost.create({
            data: {
                name,
                description,
                paymentType,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                purchaseAmount: purchaseAmount ? new client_1.Prisma.Decimal(purchaseAmount) : null,
                emiAmount: emiAmount ? new client_1.Prisma.Decimal(emiAmount) : null,
                emiFrequency,
                totalEmis,
                remainingEmis,
                monthlyRent: monthlyRent ? new client_1.Prisma.Decimal(monthlyRent) : null,
                securityDeposit: securityDeposit ? new client_1.Prisma.Decimal(securityDeposit) : null,
                rentDuration
            }
        });
        res.status(201).json(cost);
    }
    catch (error) {
        console.error('Error creating equipment cost:', error);
        res.status(500).json({ error: 'Failed to create equipment cost' });
    }
});
exports.createEquipmentCost = createEquipmentCost;
// Facility Costs
const getFacilityCosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const costs = yield prisma_1.default.facilityCost.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(costs);
    }
    catch (error) {
        console.error('Error fetching facility costs:', error);
        res.status(500).json({ error: 'Failed to fetch facility costs' });
    }
});
exports.getFacilityCosts = getFacilityCosts;
const getFacilityCostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const costId = parseInt(id, 10);
        if (isNaN(costId)) {
            return res.status(400).json({ error: 'Invalid cost ID' });
        }
        const cost = yield prisma_1.default.facilityCost.findUnique({
            where: { id: costId }
        });
        if (!cost) {
            return res.status(404).json({ error: 'Facility cost not found' });
        }
        res.json(cost);
    }
    catch (error) {
        console.error('Error fetching facility cost:', error);
        res.status(500).json({ error: 'Failed to fetch facility cost' });
    }
});
exports.getFacilityCostById = getFacilityCostById;
const createFacilityCost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, type, rentAmount, maintenanceAmount, utilitiesAmount, frequency, startDate, endDate } = req.body;
        const cost = yield prisma_1.default.facilityCost.create({
            data: {
                name,
                description,
                type,
                rentAmount: rentAmount ? new client_1.Prisma.Decimal(rentAmount) : null,
                maintenanceAmount: maintenanceAmount ? new client_1.Prisma.Decimal(maintenanceAmount) : null,
                utilitiesAmount: utilitiesAmount ? new client_1.Prisma.Decimal(utilitiesAmount) : null,
                frequency,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null
            }
        });
        res.status(201).json(cost);
    }
    catch (error) {
        console.error('Error creating facility cost:', error);
        res.status(500).json({ error: 'Failed to create facility cost' });
    }
});
exports.createFacilityCost = createFacilityCost;
// Cost Summary
const getCostSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const end = endDate ? new Date(endDate) : new Date();
        // Get the current delivery cost configuration
        const costConfig = yield prisma_1.default.deliveryCostConfig.findFirst();
        const costPerAgent = costConfig ? Number(costConfig.costPerAgent) : 8000;
        // Get all delivery partners to calculate total staff cost
        const deliveryPartners = yield prisma_1.default.user.findMany({
            where: {
                role: 'DELIVERY_PARTNER'
            }
        });
        const [equipmentCosts, facilityCosts] = yield Promise.all([
            prisma_1.default.equipmentCost.findMany({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            }),
            prisma_1.default.facilityCost.findMany({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            })
        ]);
        // Calculate total staff cost using the configured cost per agent
        const totalStaffCost = deliveryPartners.length * costPerAgent;
        const summary = {
            staffCosts: {
                total: totalStaffCost,
                count: deliveryPartners.length,
                costPerAgent
            },
            equipmentCosts: {
                total: equipmentCosts.reduce((sum, cost) => sum + (cost.purchaseAmount ? Number(cost.purchaseAmount) : 0) + (cost.emiAmount ? Number(cost.emiAmount) : 0), 0),
                count: equipmentCosts.length
            },
            facilityCosts: {
                total: facilityCosts.reduce((sum, cost) => sum + (cost.rentAmount ? Number(cost.rentAmount) : 0) + (cost.maintenanceAmount ? Number(cost.maintenanceAmount) : 0) + (cost.utilitiesAmount ? Number(cost.utilitiesAmount) : 0), 0),
                count: facilityCosts.length
            }
        };
        res.json(summary);
    }
    catch (error) {
        console.error('Error fetching cost summary:', error);
        res.status(500).json({ error: 'Failed to fetch cost summary' });
    }
});
exports.getCostSummary = getCostSummary;
// Get cost categories
const getCostCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma_1.default.costCategory.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching cost categories:', error);
        res.status(500).json({ error: 'Failed to fetch cost categories' });
    }
});
exports.getCostCategories = getCostCategories;
