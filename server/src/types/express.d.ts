import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        credits: number;
      };
    }
  }
}

export {};
