"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <div className="flex justify-center mb-6 space-x-4">
        <Button
          onClick={() => setMode("register")}
          variant={mode === "register" ? "default" : "outline"}
        >
          ユーザー登録
        </Button>
        <Button
          onClick={() => setMode("login")}
          variant={mode === "login" ? "default" : "outline"}
        >
          ログイン
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {mode === "register" ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
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
            <label htmlFor="userId" className="block text-sm font-medium mb-1">
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

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>登録完了</DialogTitle>
            <DialogDescription>
              登録が完了しました。このIDは同じデータを再度閲覧する際に必要になります。
              <br />
              あなたのID: <strong>{newUserId}</strong>
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
