"use client";

import { ExternalLink, FileText, Gavel, Info } from "lucide-react";
import { toast } from "sonner";

import {
  SETTINGS_APP_NAME,
  SETTINGS_APP_VERSION,
} from "./settings-constants";
import SettingsListGroup from "./SettingsListGroup";
import SettingsSectionLabel from "./SettingsSectionLabel";

const SettingsInfoSection = () => {
  const onLegal = (title: string) => {
    toast.message(`${title} 페이지를 준비 중입니다.`);
  };

  return (
    <div>
      <SettingsSectionLabel>정보</SettingsSectionLabel>
      <SettingsListGroup>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Info
            className="size-5 shrink-0 text-on-surface-variant"
            strokeWidth={1.75}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-on-surface">
              {SETTINGS_APP_NAME} 정보
            </p>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-on-surface-variant">
            v{SETTINGS_APP_VERSION}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onLegal("개인정보 처리방침")}
          className="flex w-full min-h-14 items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-high/80"
        >
          <FileText
            className="size-5 shrink-0 text-on-surface-variant"
            strokeWidth={1.75}
          />
          <span className="min-w-0 flex-1 text-sm font-medium text-on-surface">
            개인정보 처리방침
          </span>
          <ExternalLink
            className="size-4 shrink-0 text-on-surface-variant/70"
            strokeWidth={2}
          />
        </button>
        <button
          type="button"
          onClick={() => onLegal("서비스 이용약관")}
          className="flex w-full min-h-14 items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-high/80"
        >
          <Gavel
            className="size-5 shrink-0 text-on-surface-variant"
            strokeWidth={1.75}
          />
          <span className="min-w-0 flex-1 text-sm font-medium text-on-surface">
            서비스 이용약관
          </span>
          <ExternalLink
            className="size-4 shrink-0 text-on-surface-variant/70"
            strokeWidth={2}
          />
        </button>
      </SettingsListGroup>
    </div>
  );
};

export default SettingsInfoSection;
