"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon, UserIcon } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UserMenuProps {
  userName: string;
  userId: string;
}

export function UserMenu({ userName, userId }: UserMenuProps) {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const copyUserId = useCallback(() => {
    navigator.clipboard.writeText(userId);
    toast.success("IDをコピーしました", {
      description: userId,
      duration: 2000,
    });
  }, [userId]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
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
        <div
          className="flex items-center gap-2 p-2 mb-2 rounded-md bg-sidebar-accent cursor-pointer hover:bg-sidebar-accent/80 transition-colors"
          onClick={copyUserId}
          title="クリックしてIDをコピー"
        >
          <UserIcon className="h-5 w-5" />
          <span className="font-medium text-sm truncate">
            {userName}:{userId}
          </span>
        </div>
      )}

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogoutClick} tooltip="ログアウト">
            <LogOutIcon className="h-4 w-4" />
            <span>ログアウト</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ログアウトの確認</DialogTitle>
            <DialogDescription>
              ログアウト後、同じデータを再度閲覧するには、IDが必要になります。
              <br />
              現在のID: <strong>{userId}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={handleLogoutConfirm}>ログアウト</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
