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
exports.PaymentController = void 0;
const model_users_1 = require("./model.users");
const service_paymet_1 = require("./service.paymet");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const startCheckout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    // Validate input
    const paymentIntent = yield service_paymet_1.PaymentService.createPaymentIntent(amount);
    res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        message: "Payment intent created successfully",
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentIntentId, email, name, password, course, amount } = req.body;
    const exists = yield model_users_1.User.isUserExistsByEmail(email);
    if (exists) {
        res.status(400).json({ message: "Email already registered" });
        return;
    }
    if (!paymentIntentId) {
        res.status(400).json({ error: "Payment intent ID is required" });
        return;
    }
    const paymentIntent = yield service_paymet_1.PaymentService.verifyPayment(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
        res.status(400).json({ message: "Payment not completed" });
        return;
    }
    const user = yield model_users_1.User.create({ email, name, password, course, amount, });
    res.json({ message: "Registration complete", user });
}));
exports.PaymentController = {
    startCheckout,
    verifyPayment,
};
