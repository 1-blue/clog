"use client";

import {
  ExternalLink,
  FileText,
  Gavel,
  Info,
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";

import { ROUTES } from "#web/constants";

import { SETTINGS_APP_NAME, SETTINGS_APP_VERSION } from "./settings-constants";
import SettingsListGroup from "./SettingsListGroup";
import SettingsSectionLabel from "./SettingsSectionLabel";

const externalLinkRowClass =
  "flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-high/80";

const SettingsInfoSection = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <SettingsSectionLabel>소통</SettingsSectionLabel>
        <SettingsListGroup>
          <Link
            href={ROUTES.EXTERNAL_LINKS.OPEN_KAKAO.path}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkRowClass}
          >
            <MessageCircle
              className="size-5 shrink-0 text-on-surface-variant"
              strokeWidth={1.75}
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-on-surface">
                오픈 카톡방
              </span>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                자유롭게 소통해요
              </p>
            </div>
            <ExternalLink
              className="size-4 shrink-0 text-on-surface-variant/70"
              strokeWidth={2}
            />
          </Link>
          <Link
            href={ROUTES.EXTERNAL_LINKS.FEEDBACK_FORM.path}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkRowClass}
          >
            <Send
              className="size-5 shrink-0 text-on-surface-variant"
              strokeWidth={1.75}
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-on-surface">
                피드백 보내기
              </span>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                버그 신고, 기능 요청, 개선 제안
              </p>
            </div>
            <ExternalLink
              className="size-4 shrink-0 text-on-surface-variant/70"
              strokeWidth={2}
            />
          </Link>
        </SettingsListGroup>
      </div>

      <div className="flex flex-col gap-3">
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
            <span className="shrink-0 text-xs text-on-surface-variant tabular-nums">
              v{SETTINGS_APP_VERSION}
            </span>
          </div>
          <Link
            href={ROUTES.EXTERNAL_LINKS.PRIVACY_POLICY.path}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkRowClass}
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
          </Link>
          <Link
            href={ROUTES.EXTERNAL_LINKS.TERMS_OF_SERVICE.path}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkRowClass}
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
          </Link>
        </SettingsListGroup>
      </div>
    </div>
  );
};

export default SettingsInfoSection;
