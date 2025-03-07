"use server";

import { ScoreResult } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getMusicScoreHistory(musicId: string): Promise<ScoreResult[]> {
  try {
    // クッキーからユーザーIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId || !musicId) {
      return [];
    }
    
    // ユーザーIDと楽曲IDを使ってスコア履歴を取得
    const scoreHistory = await prisma.scoreResult.findMany({
      where: {
        userId: userId,
        musicId: musicId
      },
      orderBy: {
        createdAt: 'asc' // 作成日時の昇順で並び替え（古い順）
      },
    });
    
    return scoreHistory;
    
  } catch (error) {
    console.error("Error getting music score history:", error);
    return [];
  }
}
