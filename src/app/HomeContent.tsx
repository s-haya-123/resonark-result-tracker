"use client";

import { ScoreResult, User } from "@prisma/client";
import { sanitizeHtml } from "@/lib/utils";
import SortableTable from "@/app/SortableTable";
import { use } from "react";

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
