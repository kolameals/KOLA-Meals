"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const routes_1 = __importDefault(require("./routes"));
const passport_1 = __importDefault(require("passport"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const delivery_routes_1 = __importDefault(require("./routes/delivery.routes"));
const meal_routes_1 = __importDefault(require("./routes/meal.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// API Routes
app.use('/api', routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/subscriptions', subscription_routes_1.default);
app.use('/api/deliveries', delivery_routes_1.default);
app.use('/api/meals', meal_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to KOLA Meals API' });
});
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
