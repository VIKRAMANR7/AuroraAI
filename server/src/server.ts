import cors from "cors";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { connectDB } from "./configs/db.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
import chatRouter from "./routes/chatRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";

if (
  !process.env.MONGODB_URI ||
  !process.env.JWT_SECRET ||
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_WEBHOOK_SECRET
) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

await connectDB().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("❌ Database connection error:", message);
  process.exit(1);
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Stripe requires raw body BEFORE json middleware
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Normal middleware
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("AuroraAI Server is Live");
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Server Error";
  res.status(500).json({ success: false, message });
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log(`🚀 AuroraAI Server running on port ${PORT}`);
});

export default app;
