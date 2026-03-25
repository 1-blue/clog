"use client";

import { ChevronRight, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import type { components } from "#web/@types/openapi";
import { Badge } from "#web/components/ui/badge";
import { Button } from "#web/components/ui/button";
import { Card, CardContent, CardHeader } from "#web/components/ui/card";

type UserMe = components["schemas"]["UserMe"];
type LinkedProvider = UserMe["linkedProviders"][number];

interface IProps {
  email: string;
  linkedProviders: LinkedProvider[];
}

const providerLabel: Record<LinkedProvider, string> = {
  KAKAO: "카카오톡",
  GOOGLE: "구글",
};

const ProfileEditAccountSection = ({ email, linkedProviders }: IProps) => {
  const linkedSet = new Set(linkedProviders);

  const onLink = (name: string) => {
    toast.message(
      `${name} 계정은 로그인 화면에서 연동하거나, 고객센터로 문의해 주세요.`,
    );
  };

  return (
    <Card className="rounded-2xl border-outline-variant/50 bg-surface-container-low py-0 shadow-none ring-1 ring-outline-variant/30">
      <CardHeader className="pb-2">
        <h2 className="text-base font-bold text-on-surface">계정 정보</h2>
      </CardHeader>
      <CardContent className="divide-y divide-outline-variant/50 px-0 pt-0">
        <a
          href={`mailto:${email}`}
          className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-container-high/60"
        >
          <Mail
            className="size-5 shrink-0 text-on-surface-variant"
            strokeWidth={1.75}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-on-surface">이메일</p>
            <p className="truncate text-xs text-on-surface-variant">{email}</p>
          </div>
          <ChevronRight
            className="size-5 shrink-0 text-on-surface-variant/60"
            strokeWidth={2}
          />
        </a>

        <div className="px-4 py-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck
              className="size-5 text-on-surface-variant"
              strokeWidth={1.75}
            />
            <p className="text-sm font-semibold text-on-surface">
              소셜 계정 연동
            </p>
          </div>
          <p className="mb-3 text-xs text-on-surface-variant">
            카카오톡·구글로 로그인한 계정을 연결할 수 있어요.
          </p>
          <div className="flex flex-col gap-2">
            {(["KAKAO", "GOOGLE"] as const).map((p) => {
              const on = linkedSet.has(p);
              return (
                <div
                  key={p}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-high/60 px-3 py-2.5"
                >
                  <span className="text-sm font-medium text-on-surface">
                    {providerLabel[p]}
                  </span>
                  {on ? (
                    <Badge variant="secondary" className="rounded-full">
                      연결됨
                    </Badge>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full"
                      onClick={() => onLink(providerLabel[p])}
                    >
                      연결하기
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditAccountSection;
