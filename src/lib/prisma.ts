import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバルインスタンス
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 開発環境で複数のインスタンスが作成されるのを防ぐためのシングルトンパターン
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

// 開発環境でのホットリロード時にも単一のインスタンスを維持
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
