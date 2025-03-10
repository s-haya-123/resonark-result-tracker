"use client";

import { ScoreResult, User } from "@prisma/client";
import SortableTable from "@/app/SortableTable";
import { use } from "react";
import UserInfoBadge from "@/components/custom-ui/UserInfoBadge";

interface HomeContentProps {
  user: User | null;
  scoreResultsPromise: Promise<ScoreResult[]>;
}

export default function HomeContent({
  user,
  scoreResultsPromise,
}: HomeContentProps) {
  const scoreResults = use(scoreResultsPromise);
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">スコア一覧</h1>
        <UserInfoBadge user={user} />
      </div>

      <SortableTable scoreResults={scoreResults} />
    </div>
  );
}
