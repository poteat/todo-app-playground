import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

shutdownSignals.forEach((signal) => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
