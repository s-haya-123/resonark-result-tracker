import { Suspense } from "react";
import { getCurrentUser } from "./register/actions";
import HomeContent from "./HomeContent";
import Loading from "./loading";
import { getUserScoreResults } from "./getUserScoreResults";

export default async function Home() {
  // 現在のユーザー情報を取得（サーバーサイド）
  const user = await getCurrentUser();
  // useフックを使用してスコア結果を取得
  const scoreResultsPromise = getUserScoreResults();

  return (
    <Suspense fallback={<Loading />}>
      <HomeContent user={user} scoreResultsPromise={scoreResultsPromise} />
    </Suspense>
  );
}
