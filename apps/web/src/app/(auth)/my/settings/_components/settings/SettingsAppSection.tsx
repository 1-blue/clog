"use client";

import { Bell, Moon, Timer } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import type { components } from "#web/@types/openapi";
import { Label } from "#web/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#web/components/ui/select";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";
import { cn } from "#web/libs/utils";

import {
  formatCheckoutDurationTriggerLabel,
  SETTINGS_CHECKOUT_DURATION_OPTIONS,
  SETTINGS_PUSH_STORAGE_KEY,
} from "./settings-constants";
import SettingsListGroup from "./SettingsListGroup";
import SettingsSectionLabel from "./SettingsSectionLabel";
import SettingsSwitchRow from "./SettingsSwitchRow";

type UserMe = components["schemas"]["UserMe"];

const PUSH_PREF_EVENT = "clog:settings-push-pref";

/** SSR false / 클라 true — next-themes와 동일한 마운트 가드 */
const subscribeMounted = () => () => {};
const getMountedSnapshot = () => true;
const getMountedServerSnapshot = () => false;

interface IProps {
  me: UserMe;
}

const SettingsAppSection = ({ me }: IProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { updateMeMutation } = useUserMutations();
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );
  const darkOn = mounted && (resolvedTheme === "dark" || theme === "dark");

  const pushOn = me.pushNotificationsEnabled;

  const onPushChange = (v: boolean) => {
    updateMeMutation.mutate(
      { body: { pushNotificationsEnabled: v } },
      {
        onSuccess: () => {
          try {
            localStorage.setItem(SETTINGS_PUSH_STORAGE_KEY, String(v));
          } catch {
            /* ignore */
          }
          window.dispatchEvent(new Event(PUSH_PREF_EVENT));
        },
      },
    );
  };

  const onDarkChange = (v: boolean) => {
    setTheme(v ? "dark" : "light");
  };

  return (
    <div className="flex flex-col gap-3">
      <SettingsSectionLabel>앱 설정</SettingsSectionLabel>
      <SettingsListGroup>
        <SettingsSwitchRow
          id="settings-push"
          icon={Bell}
          label="푸시 알림"
          description="댓글, 팔로우, 체크아웃 등 알림 (앱)"
          checked={pushOn}
          onCheckedChange={onPushChange}
          disabled={updateMeMutation.isPending}
        />
        {mounted ? (
          <SettingsSwitchRow
            id="settings-theme"
            icon={Moon}
            label="다크 모드"
            checked={darkOn}
            onCheckedChange={onDarkChange}
          />
        ) : (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Moon
              className="size-5 shrink-0 text-on-surface-variant"
              strokeWidth={1.75}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-on-surface">다크 모드</p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                테마 불러오는 중…
              </p>
            </div>
            <div className="h-6 w-10 animate-pulse rounded-full bg-surface-container-high" />
          </div>
        )}
        <div className="flex gap-3 px-4 py-3.5">
          <Timer
            className="mt-0.5 size-5 shrink-0 text-tertiary"
            strokeWidth={1.75}
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <Label
                htmlFor="settings-checkout"
                className="text-sm font-medium text-on-surface"
              >
                자동 체크아웃 시간
              </Label>
              <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">
                체크인 후 아래 시간이 지나면 자동으로 체크아웃됩니다.
              </p>
            </div>
            <Select
              value={String(me.checkInAutoDurationMinutes ?? 240)}
              onValueChange={(v) => {
                updateMeMutation.mutate({
                  body: { checkInAutoDurationMinutes: Number(v) },
                });
              }}
              disabled={updateMeMutation.isPending}
            >
              <SelectTrigger
                id="settings-checkout"
                className={cn(
                  "h-12 w-full rounded-xl border border-outline-variant/45 bg-surface-container-high px-4 text-left text-sm font-semibold text-on-surface shadow-sm",
                  "transition-[border-color,box-shadow,background-color] duration-200",
                  "hover:border-primary/35 hover:bg-surface-container-highest",
                  "focus-visible:border-primary/45 focus-visible:ring-2 focus-visible:ring-primary/25",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "[&_svg]:size-5 [&_svg]:text-primary [&_svg]:opacity-90",
                )}
              >
                <SelectValue placeholder="시간 선택">
                  {(v) => {
                    if (v == null || v === "") {
                      return "시간 선택";
                    }
                    const n =
                      typeof v === "string" || typeof v === "number"
                        ? Number(v)
                        : NaN;
                    return formatCheckoutDurationTriggerLabel(n);
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                className="max-h-60 rounded-2xl border border-outline-variant/35 bg-popover p-1.5 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                sideOffset={6}
              >
                {SETTINGS_CHECKOUT_DURATION_OPTIONS.map((o) => (
                  <SelectItem
                    key={o.minutes}
                    value={String(o.minutes)}
                    className="cursor-pointer rounded-lg py-2.5 pr-9 pl-3 text-sm font-medium focus:bg-primary/12 focus:text-on-surface"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsListGroup>
    </div>
  );
};

export default SettingsAppSection;
