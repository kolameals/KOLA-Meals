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
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get towers with optional filtering by tower names
router.get('/', (0, auth_middleware_1.authMiddleware)(['ADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { towers: towerQuery } = req.query;
        const towerNames = towerQuery ?
            (Array.isArray(towerQuery) ? towerQuery : [towerQuery]).map(t => String(t)) :
            [];
        const addresses = yield prisma_1.default.address.findMany({
            where: towerNames.length > 0 ? {
                tower: {
                    in: towerNames
                }
            } : undefined,
            select: {
                tower: true,
                floor: true,
                roomNumber: true,
                userId: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            },
            distinct: ['tower', 'floor', 'roomNumber']
        });
        // Group addresses by tower
        const towerMap = addresses.reduce((acc, address) => {
            if (!acc[address.tower]) {
                acc[address.tower] = {
                    name: address.tower,
                    floors: new Set(),
                    rooms: []
                };
            }
            acc[address.tower].floors.add(address.floor);
            acc[address.tower].rooms.push({
                floor: address.floor,
                roomNumber: address.roomNumber,
                userId: address.userId,
                user: address.user
            });
            return acc;
        }, {});
        // Convert to array and format floors
        const formattedTowers = Object.values(towerMap).map((tower) => ({
            name: tower.name,
            floors: Array.from(tower.floors).sort((a, b) => parseInt(a) - parseInt(b)),
            rooms: tower.rooms.sort((a, b) => {
                if (a.floor === b.floor) {
                    return parseInt(a.roomNumber) - parseInt(b.roomNumber);
                }
                return parseInt(a.floor) - parseInt(b.floor);
            })
        }));
        res.json(formattedTowers);
    }
    catch (error) {
        console.error('Error fetching towers:', error);
        res.status(500).json({ error: 'Failed to fetch towers' });
    }
}));
exports.default = router;
