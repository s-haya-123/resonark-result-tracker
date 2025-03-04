"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon, UserIcon } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";

interface UserMenuProps {
  userName: string;
  userId: string;
}

export function UserMenu({ userName, userId }: UserMenuProps) {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    // クッキーを削除するためにサーバーに要求を送信
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      // ページをリロードして登録ページにリダイレクトさせる
      router.refresh();
    }
  };

  return (
    <div className="px-2">
      {!isCollapsed && (
        <div className="flex items-center gap-2 p-2 mb-2 rounded-md bg-sidebar-accent">
          <UserIcon className="h-5 w-5" />
          <span className="font-medium text-sm truncate">
            {userName}:{userId}
          </span>
        </div>
      )}

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} tooltip="ログアウト">
            <LogOutIcon className="h-4 w-4" />
            <span>ログアウト</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
