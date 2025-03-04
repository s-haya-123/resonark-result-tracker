"use server";

import { ScoreResult } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getUserScoreResults(): Promise<ScoreResult[]> {
  
  try {
    // クッキーからユーザーIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) {
      return [];
    }
    
    // ユーザーIDを使ってスコア結果を取得
    // SQL Injectionを防ぐためにPrismaのクエリビルダーを使用
    const scoreResults = await prisma.scoreResult.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        updatedAt: 'desc'
      },
      distinct: ['musicId'],
    });
    
    // 結果を更新日時の降順で並び替え
    return scoreResults.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
  } catch (error) {
    console.error("Error getting user score results:", error);
    return [];
  }
}
