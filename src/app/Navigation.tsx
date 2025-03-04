"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "lucide-react";
import { FileJsonIcon } from "@/components/icon/FileJsonIcon";
import { UserMenu } from "@/app/UserMenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
    { href: "/", label: "ホーム", icon: <HomeIcon /> },
    { href: "/load", label: "データ読み込み", icon: <FileJsonIcon /> },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="py-5">
        <SidebarMenu>
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={link.label}
                  className="mb-3"
                >
                  <Link href={link.href}>
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {userName && userId && <UserMenu userName={userName} userId={userId} />}
      </SidebarFooter>
    </Sidebar>
  );
}
