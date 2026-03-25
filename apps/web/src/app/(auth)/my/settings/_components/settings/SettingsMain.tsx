"use client";

import { toast } from "sonner";

import { openapi } from "#web/apis/openapi";

import SettingsAccountSection from "./SettingsAccountSection";
import SettingsAppSection from "./SettingsAppSection";
import SettingsInfoSection from "./SettingsInfoSection";
import SettingsLogoutSection from "./SettingsLogoutSection";
import SettingsProfileSummaryCard from "./SettingsProfileSummaryCard";
import SettingsTopBar from "./SettingsTopBar";

const SettingsMain = () => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  return (
    <div className="pb-12">
      <SettingsTopBar />
      <div className="mx-auto max-w-lg space-y-1 px-4 pt-2">
        <SettingsProfileSummaryCard me={me} />
        <SettingsAccountSection
          onSecurityClick={() =>
            toast.message(
              "비밀번호 및 보안은 카카오·구글 등 로그인 수단에서 관리할 수 있어요.",
            )
          }
        />
        <SettingsAppSection me={me} />
        <SettingsInfoSection />
        <SettingsLogoutSection />
      </div>
    </div>
  );
};

export default SettingsMain;
