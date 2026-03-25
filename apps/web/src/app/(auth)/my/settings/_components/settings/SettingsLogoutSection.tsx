"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "#web/libs/supabase/client";
import { ROUTES } from "#web/constants";

import SettingsListGroup from "./SettingsListGroup";

const SettingsLogoutSection = () => {
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN.path);
    router.refresh();
  };

  return (
    <div className="pt-8">
      <SettingsListGroup>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full min-h-14 items-center gap-3 px-4 py-3.5 text-left text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-5 shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-semibold">로그아웃</span>
        </button>
      </SettingsListGroup>
      <p className="mt-4 text-center">
        <button
          type="button"
          onClick={() => toast.message("회원 탈퇴는 준비 중입니다.")}
          className="text-xs text-on-surface-variant underline-offset-2 hover:underline"
        >
          회원 탈퇴하기
        </button>
      </p>
    </div>
  );
};

export default SettingsLogoutSection;
