"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const logger_config_1 = __importDefault(require("./config/logger.config"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
// Start server
app_1.app.listen(port, () => {
    logger_config_1.default.info(`Server is running on port ${port}`);
});
