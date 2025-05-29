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
exports.deliveryAssignmentController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.deliveryAssignmentController = {
    getAssignments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assignments = yield prisma.deliveryAssignment.findMany({
                    include: {
                        deliveryAgent: {
                            include: {
                                user: true,
                            },
                        },
                        apartment: true,
                    },
                    orderBy: {
                        startDate: 'desc',
                    },
                });
                res.json(assignments);
            }
            catch (error) {
                console.error('Error fetching assignments:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    createTeamAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { apartmentId, startDate, endDate, teamMembers } = req.body;
                // teamMembers should be an array of { deliveryAgentId, towerNumbers, mealCount }
                if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
                    return res.status(400).json({ message: 'Team members are required' });
                }
                // Check if any delivery agent is already assigned during this period
                for (const member of teamMembers) {
                    const existingAssignment = yield prisma.deliveryAssignment.findFirst({
                        where: {
                            deliveryAgentId: member.deliveryAgentId,
                            OR: [
                                {
                                    AND: [
                                        { startDate: { lte: new Date(startDate) } },
                                        { endDate: { gte: new Date(startDate) } },
                                    ],
                                },
                                {
                                    AND: [
                                        { startDate: { lte: new Date(endDate) } },
                                        { endDate: { gte: new Date(endDate) } },
                                    ],
                                },
                            ],
                        },
                    });
                    if (existingAssignment) {
                        return res.status(400).json({
                            message: `Delivery agent ${member.deliveryAgentId} is already assigned during this period`,
                        });
                    }
                }
                // Create assignments for all team members
                const assignments = yield Promise.all(teamMembers.map(member => prisma.deliveryAssignment.create({
                    data: {
                        deliveryAgentId: member.deliveryAgentId,
                        apartmentId,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        towerNumbers: member.towerNumbers,
                        mealCount: member.mealCount || 35,
                        status: client_1.DeliveryAssignmentStatus.PENDING,
                    },
                    include: {
                        deliveryAgent: {
                            include: {
                                user: true,
                            },
                        },
                        apartment: true,
                    },
                })));
                res.status(201).json(assignments);
            }
            catch (error) {
                console.error('Error creating team assignment:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    updateAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { startDate, endDate, status, towerNumbers, mealCount } = req.body;
                const assignment = yield prisma.deliveryAssignment.update({
                    where: { id },
                    data: {
                        startDate: startDate ? new Date(startDate) : undefined,
                        endDate: endDate ? new Date(endDate) : undefined,
                        status: status,
                        towerNumbers,
                        mealCount,
                    },
                    include: {
                        deliveryAgent: {
                            include: {
                                user: true,
                            },
                        },
                        apartment: true,
                    },
                });
                res.json(assignment);
            }
            catch (error) {
                console.error('Error updating assignment:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    deleteAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma.deliveryAssignment.delete({
                    where: { id },
                });
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting assignment:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    getCurrentAssignments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                const assignments = yield prisma.deliveryAssignment.findMany({
                    where: {
                        startDate: { lte: currentDate },
                        endDate: { gte: currentDate },
                    },
                    include: {
                        deliveryAgent: {
                            include: {
                                user: true,
                            },
                        },
                        apartment: true,
                    },
                });
                res.json(assignments);
            }
            catch (error) {
                console.error('Error fetching current assignments:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
    getTeamAssignments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { apartmentId } = req.params;
                const currentDate = new Date();
                const assignments = yield prisma.deliveryAssignment.findMany({
                    where: {
                        apartmentId,
                        startDate: { lte: currentDate },
                        endDate: { gte: currentDate },
                    },
                    include: {
                        deliveryAgent: {
                            include: {
                                user: true,
                            },
                        },
                        apartment: true,
                    },
                });
                res.json(assignments);
            }
            catch (error) {
                console.error('Error fetching team assignments:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    },
};
