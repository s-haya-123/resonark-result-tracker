import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // ユーザーIDがクッキーに存在するか確認
  const userId = request.cookies.get("userId")?.value;
  
  // 現在のパス
  const { pathname } = request.nextUrl;
  
  // 登録ページへのアクセスの場合は、常に許可
  if (pathname === "/register") {
    return NextResponse.next();
  }
  
  // ユーザーIDがない場合は登録ページにリダイレクト
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/register";
    return NextResponse.redirect(url);
  }
  
  // ユーザーIDがある場合は通常通り処理を続行
  return NextResponse.next();
}

// 以下のパスに対してミドルウェアを適用
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのリクエストに一致:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコン)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
