import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(createHttpError(404, "Route not found"));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (createHttpError.isHttpError(err)) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal Server Error" });
};
