

import { User } from "./model.users";
import { PaymentService } from "./service.paymet";
import catchAsync from "../../utils/catchAsync";

const startCheckout =catchAsync( async (req, res) => {
  
    const {  amount } = req.body;
   // Validate input
  
    const paymentIntent = await PaymentService.createPaymentIntent(amount)

     res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      message: "Payment intent created successfully",})

 
 
})


const verifyPayment = catchAsync(async (req, res) => {
  const { paymentIntentId, email, name, password, course, amount } = req.body;

  const exists = await User.isUserExistsByEmail(email);
  if (exists) {
    res.status(400).json({ message: "Email already registered" });
    return;
  }

  if (!paymentIntentId) {
    res.status(400).json({ error: "Payment intent ID is required" });
    return;
  }

  const paymentIntent = await PaymentService.verifyPayment(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    res.status(400).json({ message: "Payment not completed" });
    return;
  }

  const user = await User.create({ email, name, password, course, amount,});
  res.json({ message: "Registration complete", user });
})


export const PaymentController = {
  startCheckout,
  verifyPayment,
};