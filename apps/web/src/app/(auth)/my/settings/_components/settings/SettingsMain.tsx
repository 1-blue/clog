"use client";

import TopBar from "#web/components/layout/TopBar";
import useMe from "#web/hooks/useMe";

import SettingLogoutSection from "./SettingLogoutSection";
import SettingsAccountSection from "./SettingsAccountSection";
import SettingsAdminSection from "./SettingsAdminSection";
import SettingsAppSection from "./SettingsAppSection";
import SettingsInfoSection from "./SettingsInfoSection";
import SettingsMainSkeleton from "./SettingsMainSkeleton";
import SettingsProfileSummaryCard from "./SettingsProfileSummaryCard";

const SettingsMain = () => {
  const { me } = useMe();

  if (!me) {
    return <SettingsMainSkeleton />;
  }

  return (
    <div className="pb-8">
      <TopBar title="설정" />
      <div className="mx-auto flex max-w-lg flex-col gap-8 pt-4">
        <SettingsProfileSummaryCard me={me} />
        <SettingsAccountSection />
        <SettingsAppSection me={me} />
        {me.role === "ADMIN" ? <SettingsAdminSection /> : null}
        <SettingsInfoSection />
        <SettingLogoutSection />
      </div>
    </div>
  );
};

export default SettingsMain;
