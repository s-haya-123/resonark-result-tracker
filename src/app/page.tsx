import { getCurrentUser } from "./register/actions";
import { getUserScoreResults } from "./actions";
import { sanitizeHtml } from "@/lib/utils";
import SortableTable from "@/components/SortableTable";

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
            ログインユーザー:{" "}
            <span className="font-medium">{sanitizeHtml(user.name)}</span>
          </div>
        )}
      </div>

      <SortableTable scoreResults={scoreResults} />
    </div>
  );
}
