"use server";

import { PrismaClient, ScoreResult } from "@prisma/client";
import { cookies } from "next/headers";

export async function getUserScoreResults(): Promise<ScoreResult[]> {
  const prisma = new PrismaClient();
  
  try {
    // クッキーからユーザーIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) {
      return [];
    }
    
    // ユーザーIDを使ってスコア結果を取得
    // DISTINCT ON を使用して各musicIdごとに最新の更新日時のレコードのみを取得
    const scoreResults = await prisma.$queryRaw<ScoreResult[]>`
      SELECT DISTINCT ON ("musicId") *
      FROM "ScoreResult"
      WHERE "userId" = ${userId}
      ORDER BY "musicId", "updatedAt" DESC
    `;
    
    // 結果を更新日時の降順で並び替え
    return scoreResults.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
  } catch (error) {
    console.error("Error getting user score results:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
