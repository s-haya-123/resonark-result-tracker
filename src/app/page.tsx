import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "./register/actions";
import { getUserScoreResults } from "./actions";

export default async function Home() {
  // 現在のユーザー情報を取得
  const user = await getCurrentUser();
  // ユーザーのスコア結果を取得
  const scoreResults = await getUserScoreResults();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">スコア一覧</h1>
        {user && (
          <div className="text-sm bg-blue-50 p-2 rounded-md">
            ログインユーザー: <span className="font-medium">{user.name}</span>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>譜面名</TableHead>
            <TableHead>スコア</TableHead>
            <TableHead>tRate</TableHead>
            <TableHead>状態</TableHead>
            <TableHead>プラットフォーム</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoreResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                スコアデータがありません
              </TableCell>
            </TableRow>
          ) : (
            scoreResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.title}</TableCell>
                <TableCell>{result.dName}</TableCell>
                <TableCell>{result.score.toLocaleString()}</TableCell>
                <TableCell>{result.tRate.toFixed(2)}%</TableCell>
                <TableCell>{getStateText(result.state)}</TableCell>
                <TableCell>{getPlatformText(result.platform)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

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
