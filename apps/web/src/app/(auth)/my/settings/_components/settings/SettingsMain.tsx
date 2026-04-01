"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import AppTopBar from "#web/components/layout/AppTopBar";
import useMe from "#web/hooks/useMe";

import SettingLogoutSection from "./SettingLogoutSection";
import SettingsAccountSection from "./SettingsAccountSection";
import SettingsAppSection from "./SettingsAppSection";
import SettingsInfoSection from "./SettingsInfoSection";
import SettingsMainSkeleton from "./SettingsMainSkeleton";
import SettingsProfileSummaryCard from "./SettingsProfileSummaryCard";

const SettingsMain = () => {
  const router = useRouter();
  const { me } = useMe();

  if (!me) {
    return <SettingsMainSkeleton />;
  }

  return (
    <div className="pb-12">
      <AppTopBar
        showNotification={false}
        left={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
              aria-label="뒤로"
            >
              <ArrowLeft className="size-5" strokeWidth={2} />
            </button>
            <h1 className="text-lg font-semibold text-on-surface">설정</h1>
          </div>
        }
      />
      <div className="mx-auto flex max-w-lg flex-col gap-8 pt-8">
        <SettingsProfileSummaryCard me={me} />
        <SettingsAccountSection />
        <SettingsAppSection me={me} />
        <SettingsInfoSection />
        <SettingLogoutSection />
      </div>
    </div>
  );
};

export default SettingsMain;
