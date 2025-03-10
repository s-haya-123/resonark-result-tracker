"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreResult } from "@prisma/client";
import { sanitizeHtml } from "@/lib/utils";

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

// ソート方向の型定義
type SortDirection = "asc" | "desc" | null;

// ソート可能なフィールドの型定義
type SortableField =
  | "title"
  | "dName"
  | "score"
  | "tRate"
  | "state"
  | "platform";

interface SortableTableProps {
  scoreResults: ScoreResult[];
}

export default function SortableTable({ scoreResults }: SortableTableProps) {
  const router = useRouter();
  // ソートの状態を管理するstate
  const [sortField, setSortField] = useState<SortableField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // ソートされたデータを取得する関数
  const getSortedData = () => {
    if (!sortField || !sortDirection) {
      return scoreResults;
    }

    return [...scoreResults].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      // フィールドに応じて比較する値を取得
      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "dName":
          aValue = a.dName.toLowerCase();
          bValue = b.dName.toLowerCase();
          break;
        case "score":
          aValue = a.score;
          bValue = b.score;
          break;
        case "tRate":
          aValue = a.tRate;
          bValue = b.tRate;
          break;
        case "state":
          aValue = a.state;
          bValue = b.state;
          break;
        case "platform":
          aValue = a.platform;
          bValue = b.platform;
          break;
        default:
          return 0;
      }

      // ソート方向に応じて比較結果を返す
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  // ソートを切り替える関数
  const toggleSort = (field: SortableField) => {
    if (sortField === field) {
      // 同じフィールドがクリックされた場合、ソート方向を切り替える
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      // 異なるフィールドがクリックされた場合、そのフィールドで昇順ソート
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ソート方向を示すCSSクラスを返す関数
  const getSortIndicatorClass = (field: SortableField) => {
    if (sortField !== field) return "invisible";

    return "visible";
  };

  // ソート方向を示す矢印を返す関数
  const getSortIndicatorArrow = () => {
    if (sortDirection === "asc") {
      return "↑";
    } else if (sortDirection === "desc") {
      return "↓";
    }

    return "";
  };

  // ソート済みのデータを取得
  const sortedData = getSortedData();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            onClick={() => toggleSort("title")}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span>タイトル</span>
              <span className={`ml-1 w-4 ${getSortIndicatorClass("title")}`}>
                {getSortIndicatorArrow()}
              </span>
            </div>
          </TableHead>
          <TableHead
            onClick={() => toggleSort("dName")}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span>楽曲難易度名</span>
              <span className={`ml-1 w-4 ${getSortIndicatorClass("dName")}`}>
                {getSortIndicatorArrow()}
              </span>
            </div>
          </TableHead>
          <TableHead
            onClick={() => toggleSort("score")}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span>スコア</span>
              <span className={`ml-1 w-4 ${getSortIndicatorClass("score")}`}>
                {getSortIndicatorArrow()}
              </span>
            </div>
          </TableHead>
          <TableHead
            onClick={() => toggleSort("tRate")}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span>tRate</span>
              <span className={`ml-1 w-4 ${getSortIndicatorClass("tRate")}`}>
                {getSortIndicatorArrow()}
              </span>
            </div>
          </TableHead>
          <TableHead
            onClick={() => toggleSort("state")}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span>楽曲クリアステート</span>
              <span className={`ml-1 w-4 ${getSortIndicatorClass("state")}`}>
                {getSortIndicatorArrow()}
              </span>
            </div>
          </TableHead>
          <TableHead
            onClick={() => toggleSort("platform")}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              <span>プラットフォーム</span>
              <span className={`ml-1 w-4 ${getSortIndicatorClass("platform")}`}>
                {getSortIndicatorArrow()}
              </span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
              スコアデータがありません
            </TableCell>
          </TableRow>
        ) : (
          sortedData.map((result) => (
            <TableRow
              key={result.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/${result.musicId}/detail`)}
            >
              <TableCell>{sanitizeHtml(result.title)}</TableCell>
              <TableCell>{sanitizeHtml(result.dName)}</TableCell>
              <TableCell>{result.score.toLocaleString()}</TableCell>
              <TableCell>{result.tRate.toFixed(2)}%</TableCell>
              <TableCell>{getStateText(result.state)}</TableCell>
              <TableCell>{getPlatformText(result.platform)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
