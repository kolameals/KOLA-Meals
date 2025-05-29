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
exports.getActiveSubscribers = exports.getNonSubscribedUsers = exports.getUsersByApartment = exports.createDeliveryPartner = exports.getDeliveryPartners = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const userManagement_service_1 = require("../services/userManagement.service");
const userManagement_validator_1 = require("../validators/userManagement.validator");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        // Debug: Log request parameters
        console.log('Request parameters:', { page, limit, search });
        const result = yield userManagement_service_1.userManagementService.getUsers(page, limit, search);
        // Debug: Log the raw data from service
        console.log('Raw data from service:', JSON.stringify(result.data[0], null, 2));
        // Send the raw data without any transformation
        res.json(result);
    }
    catch (error) {
        console.error('Error in getUsers controller:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, userManagement_validator_1.validateCreateUser)(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const user = yield userManagement_service_1.userManagementService.createUser(req.body);
        res.status(201).json({ data: user });
    }
    catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, userManagement_validator_1.validateUpdateUser)(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const user = yield userManagement_service_1.userManagementService.updateUser(req.params.id, req.body);
        res.json({ data: user });
    }
    catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userManagement_service_1.userManagementService.deleteUser(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.deleteUser = deleteUser;
const getDeliveryPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const deliveryPartners = yield userManagement_service_1.userManagementService.getDeliveryPartners(page, limit);
        res.json({ data: deliveryPartners });
    }
    catch (error) {
        console.error('Error in getDeliveryPartners:', error);
        res.status(500).json({ error: 'Failed to fetch delivery partners' });
    }
});
exports.getDeliveryPartners = getDeliveryPartners;
const createDeliveryPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, userManagement_validator_1.validateCreateUser)(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        const deliveryPartner = yield userManagement_service_1.userManagementService.createDeliveryPartner(req.body);
        res.status(201).json({ data: deliveryPartner });
    }
    catch (error) {
        console.error('Error in createDeliveryPartner:', error);
        res.status(500).json({ error: 'Failed to create delivery partner' });
    }
});
exports.createDeliveryPartner = createDeliveryPartner;
const getUsersByApartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userManagement_service_1.userManagementService.getUsersByApartment();
        res.json(result);
    }
    catch (error) {
        console.error('Error in getUsersByApartment controller:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.getUsersByApartment = getUsersByApartment;
const getNonSubscribedUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userManagement_service_1.userManagementService.getNonSubscribedUsers();
        res.json(result);
    }
    catch (error) {
        console.error('Error in getNonSubscribedUsers controller:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.getNonSubscribedUsers = getNonSubscribedUsers;
const getActiveSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield userManagement_service_1.userManagementService.getActiveSubscribers();
        res.json(result);
    }
    catch (error) {
        console.error('Error in getActiveSubscribers controller:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.getActiveSubscribers = getActiveSubscribers;
