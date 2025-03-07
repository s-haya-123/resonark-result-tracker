import { Suspense } from "react";
import { getMusicScoreHistory } from "@/app/getMusicScoreHistory";
import { getCurrentUser } from "@/app/register/actions";
import Loading from "@/app/loading";
import MusicDetailContent from "@/app/[id]/detail/MusicDetailContent";

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const musicId = params.id;

  // 現在のユーザー情報を取得
  const user = await getCurrentUser();

  // 楽曲のスコア履歴を取得
  const scoreHistoryPromise = getMusicScoreHistory(musicId);

  return (
    <Suspense fallback={<Loading />}>
      <MusicDetailContent
        user={user}
        scoreHistoryPromise={scoreHistoryPromise}
      />
    </Suspense>
  );
}
