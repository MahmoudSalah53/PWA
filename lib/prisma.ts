// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// بنستخدم globalThis عشان نضمن إن الكلاينت بيتم إنشاؤه مرة واحدة بس
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// بنعمل function بدل من variable
export const getPrismaClient = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "production" ? ["error"] : ["query"],
    });
  }
  return globalForPrisma.prisma;
};