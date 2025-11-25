import "express";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string | Types.ObjectId;
        name: string;
        email: string;
        credits: number;
      };
    }
  }
}

export {};
