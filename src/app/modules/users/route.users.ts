import express from "express";
import { PaymentController } from "./controller.payment";
import { userController } from "./controller.users";
import authMiddleware from "../../middlewares/auth";

const router = express.Router();

router.post("/checkout", PaymentController.startCheckout);

router.post("/verify-payment", PaymentController.verifyPayment);

router.get("/",userController.getAllUsers);

router.post('/create-admin',  userController.createUser)

export const UserRoutes = router;
