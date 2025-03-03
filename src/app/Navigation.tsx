"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/app/UserMenu";

interface NavigationProps {
  userName?: string;
  userId?: string;
}

export function Navigation({ userName, userId }: NavigationProps) {
  const pathname = usePathname();

  // 登録ページでは表示しない
  if (pathname === "/register") {
    return null;
  }

  const links = [
    { href: "/", label: "ホーム" },
    { href: "/load", label: "データ読み込み" },
  ];

  return (
    <nav className="mb-8 flex justify-between items-center">
      <ul className="flex space-x-4">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ユーザーがログインしている場合はユーザーメニューを表示 */}
      {userName && userId && <UserMenu userName={userName} userId={userId} />}
    </nav>
  );
}
