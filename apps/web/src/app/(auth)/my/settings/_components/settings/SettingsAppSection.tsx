"use client";

import { Bell, Moon } from "lucide-react";
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

import {
  SETTINGS_CHECKOUT_DURATION_OPTIONS,
  SETTINGS_PUSH_STORAGE_KEY,
} from "./settings-constants";
import SettingsListGroup from "./SettingsListGroup";
import SettingsSectionLabel from "./SettingsSectionLabel";
import SettingsSwitchRow from "./SettingsSwitchRow";

type UserMe = components["schemas"]["UserMe"];

const PUSH_PREF_EVENT = "clog:settings-push-pref";

const getPushPreferenceSnapshot = (): boolean => {
  try {
    const raw = localStorage.getItem(SETTINGS_PUSH_STORAGE_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
};

const subscribePushPreference = (onStoreChange: () => void) => {
  const onCustom = () => onStoreChange();
  window.addEventListener(PUSH_PREF_EVENT, onCustom);
  window.addEventListener("storage", onCustom);
  return () => {
    window.removeEventListener(PUSH_PREF_EVENT, onCustom);
    window.removeEventListener("storage", onCustom);
  };
};

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
  const pushOn = useSyncExternalStore(
    subscribePushPreference,
    getPushPreferenceSnapshot,
    () => true,
  );

  const darkOn = mounted && (resolvedTheme === "dark" || theme === "dark");

  const onPushChange = (v: boolean) => {
    try {
      localStorage.setItem(SETTINGS_PUSH_STORAGE_KEY, String(v));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(PUSH_PREF_EVENT));
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
          description="댓글, 좋아요, 팔로우 알림"
          checked={pushOn}
          onCheckedChange={onPushChange}
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
        <div className="px-4 py-4">
          <Label
            htmlFor="settings-checkout"
            className="text-sm font-medium text-on-surface"
          >
            자동 체크아웃 시간
          </Label>
          <p className="mt-1 text-xs text-on-surface-variant">
            체크인 후 아래 시간이 지나면 자동으로 체크아웃됩니다.
          </p>
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
              className="mt-3 h-11 w-full rounded-xl border-outline-variant/50 bg-surface-container text-on-surface"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl border-outline-variant bg-popover">
              {SETTINGS_CHECKOUT_DURATION_OPTIONS.map((o) => (
                <SelectItem key={o.minutes} value={String(o.minutes)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingsListGroup>
    </div>
  );
};

export default SettingsAppSection;
