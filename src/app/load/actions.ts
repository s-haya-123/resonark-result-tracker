"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/utils";

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
  // キーの形式を検証（セキュリティ対策）
  if (!key || typeof key !== 'string' || key.length < 7) {
    return {
      worldId: '',
      dataType: '',
      dataId: ''
    };
  }
  
  // 安全に部分文字列を抽出
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
  try {
    const items = data.items || {};
    
    // 現在のログインユーザーのIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) {
      throw new Error("ユーザーがログインしていません");
    }
    
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    
    // スコアデータを一括で保存するための配列
    const scoreDataToCreate = [];
    
    // 各スコアデータを配列に追加
    for (const key in items) {
      const {
        worldId,
      } = parseItemKeyData(key);
      const item = items[key];
      // 有効なスコアデータのみを処理
      if (item && typeof item === 'object' && item.title && item.dName) {
        // XSS対策のためにテキストデータをサニタイズ
        const sanitizedTitle = sanitizeHtml(String(item.title));
        const sanitizedDName = sanitizeHtml(String(item.dName));
        const sanitizedMusicId = sanitizeHtml(String(item.id || ''));
        
        // 数値データの検証
        const score = typeof item.score === 'number' ? item.score : 0;
        const tRate = typeof item.tRate === 'number' ? item.tRate : 0;
        const state = typeof item.state === 'number' ? item.state : 0;
        const platform = typeof item.platform === 'number' ? item.platform : 0;
        
        scoreDataToCreate.push({
          worldId,
          userId: user.id,
          title: sanitizedTitle,
          dName: sanitizedDName,
          musicId: sanitizedMusicId,
          score: score,
          tRate: tRate,
          state: state,
          platform: platform
        });
      }
    }
    
    // 一括でデータを作成
    if (scoreDataToCreate.length > 0) {
      await prisma.scoreResult.createMany({
        data: scoreDataToCreate
      });
    }
    
    return { status: 'success' };
  } catch (error: unknown) {
    console.error("Error saving data:", error);
    return { 
      status: 'error',
      error
    };
  }
}
