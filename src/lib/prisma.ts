const globalForPrisma = globalThis as any;

export const prisma = globalForPrisma.prisma ?? new (require('@prisma/client').PrismaClient)();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
