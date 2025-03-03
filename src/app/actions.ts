"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

export async function getUserScoreResults() {
  const prisma = new PrismaClient();
  
  try {
    // クッキーからユーザーIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) {
      return [];
    }
    
    // ユーザーIDを使ってスコア結果を取得
    const scoreResults = await prisma.scoreResult.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return scoreResults;
  } catch (error) {
    console.error("Error getting user score results:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
