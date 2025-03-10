import { Suspense } from "react";
import { getMusicScoreHistory } from "@/app/getMusicScoreHistory";
import { getCurrentUser } from "@/app/register/actions";
import Loading from "@/app/loading";
import MusicDetailContent from "@/app/[id]/detail/MusicDetailContent";

// Define a type that matches the expected Next.js PageProps structure
type PageProps = {
  params?: Promise<{ id: string }>;
};

export default async function DetailPage({ params }: PageProps) {
  // Handle the case where params might be a Promise
  const resolvedParams = params instanceof Promise ? await params : params;
  const musicId = resolvedParams?.id as string;

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
