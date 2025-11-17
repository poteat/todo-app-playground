import cors from "cors";
import express from "express";
import morgan from "morgan";

import { env } from "./env";
import { errorHandler, notFoundHandler } from "./middleware/errors";
import { faultInjection } from "./middleware/faults";
import healthRouter from "./routes/health";
import todosRouter from "./routes/todos";

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === "development" ? true : env.CLIENT_ORIGIN,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Todo API" });
});

app.use("/health", healthRouter);
app.use(
  "/api/todos",
  faultInjection({
    delayMs: env.FAULT_INJECTION_DELAY_MS,
    failureRate: env.FAULT_INJECTION_FAILURE_RATE,
  }),
  todosRouter
);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
