"use client";

import {
  CalendarDays,
  Clock,
  Globe,
  Instagram,
  MapPin,
  MapPinned,
  Megaphone,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import { regionToKoreanMap, type Region } from "@clog/contracts";

import type { components } from "#web/@types/openapi";
import {
  formatGymOpenHoursDisplay,
  isOpenHoursLineHighlightedForToday,
} from "#web/libs/gym/openHours";
import { cn } from "#web/libs/utils";

const normalizeWebsiteHref = (
  raw: string | null | undefined,
): string | null => {
  const t = raw?.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

const instagramProfileUrl = (raw: string | null | undefined): string | null => {
  const t = raw?.replace(/^@/, "").trim();
  if (!t) return null;
  return `https://www.instagram.com/${encodeURIComponent(t)}/`;
};

type TGymDetail = components["schemas"]["GymDetail"];

interface IProps {
  gym: TGymDetail;
}

const GymBasicInfoSection: React.FC<IProps> = ({ gym }) => {
  const { scheduleLines, notice } = formatGymOpenHoursDisplay(gym.openHours);
  const hasHours = scheduleLines.length > 0 || !!notice;
  const regionLabel = regionToKoreanMap[gym.region as Region];
  const websiteHref = normalizeWebsiteHref(gym.website);
  const instagramHref = instagramProfileUrl(gym.instagramId);

  const copyAddress = async () => {
    const text = gym.address?.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      toast.success("주소를 복사했어요");
    } catch {
      toast.warning("주소 복사에 실패했어요");
    }
  };

  const apiNotice = gym.notice?.trim();
  const settingScheduleMemo = gym.settingScheduleMemo?.trim();

  return (
    <section className="flex flex-col gap-4">
      {apiNotice ? (
        <div className="flex items-start gap-4 rounded-2xl border border-tertiary/25 bg-tertiary/8 p-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-tertiary">
            <Megaphone className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              운영 안내
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-on-surface">
              {apiNotice}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
          <MapPinned className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">
            지역
          </p>
          <p className="text-base font-semibold text-on-surface">
            {regionLabel}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
          <MapPin className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">
            위치
          </p>
          <button
            type="button"
            onClick={copyAddress}
            className="max-w-full cursor-pointer text-left text-base leading-relaxed font-semibold text-on-surface underline-offset-2 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="주소 복사"
          >
            {gym.address}
          </button>
        </div>
      </div>

      {websiteHref ? (
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <Globe className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              웹사이트
            </p>
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full text-base leading-relaxed font-semibold break-all text-on-surface transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {gym.website?.replace(/^https?:\/\//i, "") ?? websiteHref}
            </a>
          </div>
        </div>
      ) : null}

      {instagramHref ? (
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <Instagram className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              인스타그램
            </p>
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full text-base leading-relaxed font-semibold text-on-surface transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              @{gym.instagramId?.replace(/^@/, "")}
            </a>
          </div>
        </div>
      ) : null}

      {gym.phone && (
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <Phone className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              연락처
            </p>
            <a
              href={`tel:${gym.phone}`}
              className="inline-flex max-w-full text-base leading-relaxed font-semibold text-on-surface transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {gym.phone}
            </a>
          </div>
        </div>
      )}

      {settingScheduleMemo ? (
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <CalendarDays className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              세팅 주기
            </p>
            <p className="text-base leading-relaxed font-semibold whitespace-pre-wrap text-on-surface">
              {settingScheduleMemo}
            </p>
          </div>
        </div>
      ) : null}

      {hasHours && (
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
            <Clock className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="mb-1 text-sm font-medium text-on-surface-variant">
              운영 시간
            </p>
            {scheduleLines.length > 0 ? (
              <ul className="space-y-1 text-base font-semibold text-on-surface">
                {scheduleLines.map((line) => (
                  <li
                    key={line}
                    className={cn(
                      isOpenHoursLineHighlightedForToday(line) &&
                        "font-bold text-primary",
                    )}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
            {notice ? (
              <p
                className={
                  scheduleLines.length > 0
                    ? "mt-2 text-sm leading-relaxed text-on-surface-variant"
                    : "text-base font-semibold text-on-surface"
                }
              >
                안내: {notice}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default GymBasicInfoSection;
