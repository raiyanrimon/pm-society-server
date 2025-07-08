import Stripe from "stripe";import config from "../../config";

const stripe = new Stripe(config.STRIPE_SECRET_KEY as string)

const createPaymentIntent = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
        currency: 'usd', // Change to your desired currency
      payment_method_types: ['card'],
    });
    return paymentIntent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    } else {
      throw new Error(`Failed to create payment intent: ${String(error)}`);
    }
  }
}

const verifyPayment = async (paymentIntentId: string) => {
  
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return paymentIntent;
   
}


export const PaymentService = {
  createPaymentIntent,
  verifyPayment,}