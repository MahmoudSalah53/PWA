
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const getPrismaClient = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error"] : ["query"],
    });
  }
  return globalForPrisma.prisma;
};