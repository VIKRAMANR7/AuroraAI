import type { Request, Response } from "express";
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function stripeWebhooks(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (typeof signature !== "string") {
    return res.status(400).send("Missing Stripe signature header");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  if (event.type !== "payment_intent.succeeded") {
    return res.json({ received: true });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
  });

  const session = sessions.data[0];

  if (!session?.metadata) {
    return res.json({ received: true });
  }

  const transactionId = session.metadata.transactionId;
  const appId = session.metadata.appId;

  if (appId !== "auroraai") {
    return res.json({ received: true });
  }

  const transaction = await Transaction.findOne({
    _id: transactionId,
    isPaid: false,
  });

  if (transaction) {
    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
    transaction.isPaid = true;
    await transaction.save();
  }

  return res.json({ received: true });
}
