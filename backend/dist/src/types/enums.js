"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_STATUS = exports.OLD_TIFFIN_STATUS = exports.DELIVERY_STATUS = exports.OrderStatus = exports.OldTiffinStatusEnum = exports.DeliveryStatusEnum = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "DeliveryStatusEnum", { enumerable: true, get: function () { return client_1.DeliveryStatusEnum; } });
Object.defineProperty(exports, "OldTiffinStatusEnum", { enumerable: true, get: function () { return client_1.OldTiffinStatusEnum; } });
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return client_1.OrderStatus; } });
exports.DELIVERY_STATUS = {
    PENDING: client_1.DeliveryStatusEnum.PENDING,
    ASSIGNED: client_1.DeliveryStatusEnum.ASSIGNED,
    PICKED_UP: client_1.DeliveryStatusEnum.PICKED_UP,
    DELIVERED: client_1.DeliveryStatusEnum.DELIVERED,
    FAILED: client_1.DeliveryStatusEnum.FAILED
};
exports.OLD_TIFFIN_STATUS = {
    NEW: client_1.OldTiffinStatusEnum.NEW,
    USED: client_1.OldTiffinStatusEnum.USED,
    DAMAGED: client_1.OldTiffinStatusEnum.DAMAGED,
    LOST: client_1.OldTiffinStatusEnum.LOST
};
exports.ORDER_STATUS = {
    PENDING: client_1.OrderStatus.PENDING,
    CONFIRMED: client_1.OrderStatus.CONFIRMED,
    PREPARING: client_1.OrderStatus.PREPARING,
    READY_FOR_DELIVERY: client_1.OrderStatus.READY_FOR_DELIVERY,
    OUT_FOR_DELIVERY: client_1.OrderStatus.OUT_FOR_DELIVERY,
    DELIVERED: client_1.OrderStatus.DELIVERED,
    CANCELLED: client_1.OrderStatus.CANCELLED
};
