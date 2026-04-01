"use client";

import { UserRound } from "lucide-react";

import { ROUTES } from "#web/constants";

import SettingsListGroup from "./SettingsListGroup";
import SettingsNavRow from "./SettingsNavRow";
import SettingsSectionLabel from "./SettingsSectionLabel";

const SettingsAccountSection = () => {
  return (
    <div className="flex flex-col gap-3">
      <SettingsSectionLabel>계정 설정</SettingsSectionLabel>
      <SettingsListGroup>
        <SettingsNavRow
          icon={UserRound}
          label="개인 정보 수정"
          description="닉네임, 소개, 프로필·커버 이미지"
          href={ROUTES.MY.PROFILE_EDIT.path}
        />
      </SettingsListGroup>
    </div>
  );
};

export default SettingsAccountSection;
