import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentUser } from "./register/actions";

export default async function Home() {
  // 現在のユーザー情報を取得
  const user = await getCurrentUser();

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
            <TableHead>スコア</TableHead>
            <TableHead>tRate</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
}
