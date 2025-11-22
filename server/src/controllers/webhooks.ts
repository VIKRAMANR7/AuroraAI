import Stripe from "stripe";
import { Request, Response } from "express";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (req: Request, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const session = sessions.data[0];

      if (!session?.metadata) {
        return res.json({ received: true });
      }

      const metadata = session.metadata as Record<string, string>;

      const transactionId = metadata.transactionId;
      const appId = metadata.appId;

      if (appId !== "auroraai") {
        return res.json({ received: true });
      }

      const transaction = await Transaction.findOne({
        _id: transactionId,
        isPaid: false,
      });

      if (transaction) {
        await User.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } }
        );

        transaction.isPaid = true;
        await transaction.save();
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
