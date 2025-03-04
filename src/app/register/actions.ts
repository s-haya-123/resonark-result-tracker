"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

type RegisterResult = {
  success: true;
  userId: string;
} | {
  success: false;
  error: string;
};

type LoginResult = {
  success: true;
  userId: string;
  userName: string;
} | {
  success: false;
  error: string;
};

export async function loginUser(userId: string): Promise<LoginResult> {
  try {
    // IDが空でないことを確認
    if (!userId.trim()) {
      return {
        success: false,
        error: "ユーザーIDを入力してください"
      };
    }

    // ユーザーIDを使ってユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return {
        success: false,
        error: "ユーザーが見つかりませんでした"
      };
    }

    // ユーザーIDをクッキーに保存（7日間有効）
    const cookieStore = await cookies();
    cookieStore.set({
      name: "userId",
      value: user.id,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7日間
      sameSite: "strict"
    });

    return {
      success: true,
      userId: user.id,
      userName: user.name
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      success: false,
      error: "ログインに失敗しました"
    };
  }
}

export async function registerUser(name: string): Promise<RegisterResult> {
  try {
    // 名前が空でないことを確認
    if (!name.trim()) {
      return {
        success: false,
        error: "ユーザー名を入力してください"
      };
    }

    // 新しいユーザーを作成
    const user = await prisma.user.create({
      data: {
        name: name.trim()
      }
    });

    // ユーザーIDをクッキーに保存（7日間有効）
    const cookieStore = await cookies();
    cookieStore.set({
      name: "userId",
      value: user.id,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7日間
      sameSite: "strict"
    });

    return {
      success: true,
      userId: user.id
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: "ユーザー登録に失敗しました"
    };
  }
}

export async function getCurrentUser() {
  try {
    // クッキーからユーザーIDを取得
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    
    if (!userId) {
      return null;
    }
    
    // ユーザーIDを使ってユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isUserLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
