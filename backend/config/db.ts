import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (Bun.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

async function checkPrismaConnection(): Promise<boolean> {
  try {
    // Attempt to query a simple model (e.g., `User`)
    await prisma.user.count();
    console.log("Prisma Client connected successfully.");
    return true;
  } catch (error) {
    console.error("Error connecting to Prisma Client:", error);
    process.exit(1);
    return false;
  }
}

export { prisma, checkPrismaConnection };
