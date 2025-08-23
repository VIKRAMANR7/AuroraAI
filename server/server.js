import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./configs/db.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
import chatRouter from "./routes/chatRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

await connectDB();

//Stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.get("/", (req, res) => {
  res.send("AuroraAI Server is Live");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`AuroraAI Server listening at http://localhost:${port}`);
});
