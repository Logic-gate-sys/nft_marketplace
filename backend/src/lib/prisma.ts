import { PrismaClient } from '@prisma/client';

declare global{
    var prisma: PrismaClient | undefined
}


export const getPrismaClient =() => {
    if (!globalThis.prisma) {
      globalThis.prisma = new PrismaClient({ log: ['query'] });
    }
    return globalThis.prisma;
}