import { Request, Response } from "express";
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhooks = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  if (event.type !== "payment_intent.succeeded") {
    return res.json({ received: true });
  }

  try {
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
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
