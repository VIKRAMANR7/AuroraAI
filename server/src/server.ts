import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from "./configs/db.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
import chatRouter from "./routes/chatRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { validateEnv } from "./configs/validateEnv.js";
import { errorHandler } from "./middleware/errorHandler.js";

validateEnv();

await connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Stripe requires raw body BEFORE json middleware
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// JSON middleware
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("AuroraAI Server is Live");
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// Global Error Handler
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log(`🚀 AuroraAI Server running on port ${PORT}`);
});

export default app;
