"use client";

import { ScoreResult, User } from "@prisma/client";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sanitizeHtml } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// 状態を表示用のテキストに変換する関数
function getStateText(state: number): string {
  switch (state) {
    case 0:
      return "未プレイ";
    case 100:
      return "失敗";
    case 230:
      return "通常クリア";
    case 300:
      return "Full Comboでクリア";
    case 400:
      return "All Perfectでクリア";
    case 500:
      return "All A-Perfectでクリア";
    default:
      return "不明";
  }
}

// プラットフォームを表示用のテキストに変換する関数
function getPlatformText(platform: number): string {
  switch (platform) {
    case 0:
      return "VRChat PCVR";
    case 1:
      return "VRChat PCDesktop";
    case 2:
      return "VRChat QuestVR";
    case 3:
      return "VRChat Mobile";
    case 4:
      return "Debug User";
    default:
      return "不明";
  }
}

interface MusicDetailContentProps {
  user: User | null;
  scoreHistoryPromise: Promise<ScoreResult[]>;
}

export default function MusicDetailContent({
  user,
  scoreHistoryPromise,
}: MusicDetailContentProps) {
  const router = useRouter();
  const scoreHistory = use(scoreHistoryPromise);

  // スコア履歴がない場合
  if (scoreHistory.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">楽曲詳細</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm bg-blue-50 p-2 rounded-md">
                ログインユーザー:{" "}
                <span className="font-medium">{sanitizeHtml(user.name)}</span>
              </div>
            )}
            <Button variant="outline" onClick={() => router.push("/")}>
              戻る
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8 text-gray-500">
              この楽曲のスコア履歴はありません
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 最初のスコア結果から楽曲情報を取得
  const musicInfo = scoreHistory[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">楽曲詳細</h1>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm bg-blue-50 p-2 rounded-md">
              ログインユーザー:{" "}
              <span className="font-medium">{sanitizeHtml(user.name)}</span>
            </div>
          )}
          <Button variant="outline" onClick={() => router.push("/")}>
            戻る
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{sanitizeHtml(musicInfo.title)}</CardTitle>
          <div className="text-sm text-gray-500">
            難易度: {sanitizeHtml(musicInfo.dName)}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">スコア遷移履歴</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日時</TableHead>
                <TableHead>スコア</TableHead>
                <TableHead>tRate</TableHead>
                <TableHead>クリアステート</TableHead>
                <TableHead>プラットフォーム</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoreHistory.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    {new Date(result.createdAt).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{result.score.toLocaleString()}</TableCell>
                  <TableCell>{result.tRate.toFixed(2)}%</TableCell>
                  <TableCell>{getStateText(result.state)}</TableCell>
                  <TableCell>{getPlatformText(result.platform)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
