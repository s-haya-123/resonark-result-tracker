import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // ユーザーIDのクッキーを削除
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  
  return NextResponse.json({ success: true });
}
