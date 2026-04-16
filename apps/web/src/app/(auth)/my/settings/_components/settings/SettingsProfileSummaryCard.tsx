"use client";

import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { difficultyToKoreanMap, type Difficulty } from "@clog/contracts";

import type { components } from "#web/@types/openapi";
import { Avatar, AvatarFallback, AvatarImage } from "#web/components/ui/avatar";
import { Card } from "#web/components/ui/card";
import { ROUTES } from "#web/constants";
import { createClient } from "#web/libs/supabase/client";

type UserMe = components["schemas"]["UserMe"];

interface IProps {
  me: UserMe;
}

const SettingsProfileSummaryCard = ({ me }: IProps) => {
  const router = useRouter();
  const supabase = createClient();

  const subtitle =
    me.maxDifficulty != null
      ? `${difficultyToKoreanMap[me.maxDifficulty as Difficulty]} · ${me.sendCount} 완등`
      : `${me.sendCount} 완등`;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN.path);
    router.refresh();
  };

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-outline-variant/50 bg-surface-container-low py-0 shadow-none ring-1 ring-outline-variant/30">
      <Link
        href={ROUTES.MY.path}
        className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-container-high/40"
      >
        <Avatar
          size="lg"
          className="size-14 rounded-xl border-2 border-surface"
        >
          {me.profileImage ? (
            <AvatarImage src={me.profileImage} alt="" />
          ) : null}
          <AvatarFallback className="rounded-xl text-lg font-semibold">
            {me.nickname.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-on-surface">
            {me.nickname}
          </p>
          <p className="truncate text-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <ChevronRight
          className="size-5 shrink-0 text-on-surface-variant/70"
          strokeWidth={2}
        />
      </Link>

      <div className="border-t border-outline-variant/30">
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex min-h-12 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-destructive transition-colors hover:bg-destructive/10 active:bg-destructive/15"
        >
          <LogOut className="size-5 shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-semibold">로그아웃</span>
        </button>
      </div>
    </Card>
  );
};

export default SettingsProfileSummaryCard;
