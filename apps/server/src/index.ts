import app from "./app";
import { env } from "./env";

const server = app.listen(env.PORT, () => {
  console.log(`API ready on http://localhost:${env.PORT}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
