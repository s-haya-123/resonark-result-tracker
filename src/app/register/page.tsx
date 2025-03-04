"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "./actions";
import { sanitizeHtml } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registerUser(name);

      if (result.success) {
        // 登録成功したらダイアログを表示
        setNewUserId(result.userId);
        setShowRegisterDialog(true);
      } else {
        throw new Error(result.error || "ユーザー登録に失敗しました");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        `ユーザー登録中にエラーが発生しました: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogConfirm = () => {
    setShowRegisterDialog(false);
    // ダイアログを閉じた後にホームページにリダイレクト
    router.push("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError("IDを入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await loginUser(userId);

      if (result.success) {
        // ログイン成功したらホームページにリダイレクト
        router.push("/");
      } else {
        throw new Error(result.error || "ログインに失敗しました");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        `ログイン中にエラーが発生しました: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => {
                if (value) setMode(value as "register" | "login");
              }}
              variant="outline"
            >
              <ToggleGroupItem value="register" className="px-4 py-2">
                ユーザー登録
              </ToggleGroupItem>
              <ToggleGroupItem value="login" className="px-4 py-2">
                ログイン
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <h2 className="text-xl font-semibold text-center">
            {mode === "register" ? "ユーザー登録" : "ログイン"}
          </h2>
          {error && (
            <div className="p-4 mt-2 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {mode === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  ユーザー名
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="ユーザー名を入力"
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "登録中..." : "登録"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium mb-1"
                >
                  ユーザーID
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="ユーザーIDを入力"
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>登録完了</DialogTitle>
            <DialogDescription>
              登録が完了しました。このIDは同じデータを再度閲覧する際に必要になります。
              <br />
              あなたのID: <strong>{sanitizeHtml(newUserId)}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDialogConfirm}>確認</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
