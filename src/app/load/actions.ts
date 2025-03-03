"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

type SaveResult = {
    status: 'success'
} | {
    status: 'error';
    error: unknown;
};

// JSONデータの型定義
interface ScoreItem {
  id: string;
  musicId: string;
  worldId: string;
  title: string;
  dName: string;
  score: number;
  tRate: number;
  state: number;
  platform: number;
}

interface JsonData {
  version?: string;
  userId?: string;
  items?: Record<string, ScoreItem | string | number>;
  [key: string]: unknown;
}

const parseItemKeyData = (key: string): {
  worldId: string;
  dataType: string;
  dataId: string;
} => {
  const worldId = key.substring(0, 3);
  const dataType = key.substring(3, 6);
  const dataId = key.substring(6);

  return {
    worldId,
    dataType,
    dataId
  };
}

export async function saveJsonData(data: JsonData): Promise<SaveResult> {
  const prisma = new PrismaClient();

  try {
    const items = data.items || {};
    
    // 現在のログインユーザーのIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) {
      throw new Error("ユーザーがログインしていません");
    }
    
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    
    // 各スコアデータを保存
    for (const key in items) {
      const {
        worldId,
      } = parseItemKeyData(key);
      const item = items[key];
      // 有効なスコアデータのみを処理
      if (item && typeof item === 'object' && item.title && item.dName) {
        await prisma.scoreResult.create({
          data: {
            worldId,
            userId: user.id,
            title: item.title,
            dName: item.dName,
            musicId: `${item.id}`,
            score: item.score || 0,
            tRate: item.tRate || 0,
            state: item.state || 0,
            platform: item.platform || 0
          }
        });
      }
    }
    
    return { status: 'success' };
  } catch (error: unknown) {
    console.error("Error saving data:", error);
    return { 
      status: 'error',
      error
    };
  } finally {
    await prisma.$disconnect();
  }
}
