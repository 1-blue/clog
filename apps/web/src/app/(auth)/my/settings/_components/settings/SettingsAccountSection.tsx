"use client";

import { Lock, UserRound } from "lucide-react";

import { ROUTES } from "#web/constants";

import SettingsListGroup from "./SettingsListGroup";
import SettingsNavRow from "./SettingsNavRow";
import SettingsSectionLabel from "./SettingsSectionLabel";

interface IProps {
  onSecurityClick: () => void;
}

const SettingsAccountSection = ({ onSecurityClick }: IProps) => {
  return (
    <div>
      <SettingsSectionLabel>계정 설정</SettingsSectionLabel>
      <SettingsListGroup>
        <SettingsNavRow
          icon={UserRound}
          label="개인 정보 수정"
          description="닉네임, 소개, 프로필·커버 이미지"
          href={ROUTES.MY.PROFILE_EDIT.path}
        />
        <SettingsNavRow
          icon={Lock}
          label="비밀번호 및 보안"
          description="로그인 수단·계정 보안"
          onClick={onSecurityClick}
        />
      </SettingsListGroup>
    </div>
  );
};

export default SettingsAccountSection;
