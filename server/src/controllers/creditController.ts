import type { Request, Response } from "express";
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getPlans = asyncHandler(async (_req: Request, res: Response) => {
  return res.json({ success: true, plans });
});

export const purchasePlan = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const { planId } = req.body;

  const plan = plans.find((p) => p._id === planId);

  if (!plan) {
    return res.status(400).json({ success: false, message: "Invalid Plan" });
  }

  const transaction = await Transaction.create({
    userId: user._id,
    planId: plan._id,
    amount: plan.price,
    credits: plan.credits,
    isPaid: false,
  });

  const origin = req.headers.origin ?? "";

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: plan.price * 100,
          product_data: { name: plan.name },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/loading`,
    cancel_url: `${origin}`,
    metadata: {
      transactionId: transaction._id.toString(),
      appId: "auroraai",
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  return res.json({ success: true, url: session.url });
});
