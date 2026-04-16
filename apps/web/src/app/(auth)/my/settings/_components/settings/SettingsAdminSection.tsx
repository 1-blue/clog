"use client";

import { ShieldCheck } from "lucide-react";

import SettingsListGroup from "./SettingsListGroup";
import SettingsNavRow from "./SettingsNavRow";
import SettingsSectionLabel from "./SettingsSectionLabel";

const SettingsAdminSection = () => {
  return (
    <div className="flex flex-col gap-3">
      <SettingsSectionLabel>관리자</SettingsSectionLabel>
      <SettingsListGroup>
        <SettingsNavRow
          icon={ShieldCheck}
          label="관리자 대시보드"
          description="암장·유저·에러 로그 관리"
          href="/admin"
        />
      </SettingsListGroup>
    </div>
  );
};

export default SettingsAdminSection;
