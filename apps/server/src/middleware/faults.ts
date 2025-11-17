import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";

export type FaultOptions = {
  delayMs?: number;
  failureRate?: number;
};

export const faultInjection = (opts: FaultOptions) => {
  const delayMs = opts.delayMs ?? 0;
  const failureRate = opts.failureRate ?? 0;
  const enabled = delayMs > 0 || failureRate > 0;

  return async (_req: Request, _res: Response, next: NextFunction) => {
    if (!enabled) return next();
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
    if (failureRate > 0 && Math.random() < failureRate) {
      return next(createHttpError(503, "Injected failure"));
    }
    next();
  };
};
