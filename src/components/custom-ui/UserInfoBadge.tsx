"use client";

import { User } from "@prisma/client";
import { sanitizeHtml } from "@/lib/utils";

interface UserInfoBadgeProps {
  user: User | null;
}

export default function UserInfoBadge({ user }: UserInfoBadgeProps) {
  if (!user) return null;

  return (
    <div className="text-sm bg-blue-50 p-2 rounded-md">
      ログインユーザー:{" "}
      <span className="font-medium">{sanitizeHtml(user.name)}</span>
    </div>
  );
}
