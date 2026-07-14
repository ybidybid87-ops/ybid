"use client";

import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/user/useLogout";
import useUser from "@/hooks/user/useUser";
import { LogOut } from "lucide-react";

export default function HeaderUserMenu() {
  const { data: user } = useUser();
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-700">{user.name}님</span>

      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => logout()}
        className="gap-2"
      >
        <LogOut className="size-4" />
        {isPending ? "로그아웃 중..." : "로그아웃"}
      </Button>
    </div>
  );
}
