"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_payment_1 = require("./controller.payment");
const controller_users_1 = require("./controller.users");
const router = express_1.default.Router();
router.post("/checkout", controller_payment_1.PaymentController.startCheckout);
router.post("/verify-payment", controller_payment_1.PaymentController.verifyPayment);
router.get("/", controller_users_1.userController.getAllUsers);
router.post('/create-admin', controller_users_1.userController.createUser);
exports.UserRoutes = router;
