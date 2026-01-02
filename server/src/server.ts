import cors from "cors";
import "dotenv/config";
import express from "express";

import connectDB from "./configs/db.js";
import { validateEnv } from "./configs/validateEnv.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

import chatRouter from "./routes/chatRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";

validateEnv();
await connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("AuroraAI Server is Live");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
