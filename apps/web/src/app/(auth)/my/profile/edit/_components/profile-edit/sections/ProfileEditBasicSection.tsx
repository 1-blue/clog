"use client";

import { Instagram, Youtube } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { Button } from "#web/components/ui/button";
import { Card, CardContent, CardHeader } from "#web/components/ui/card";
import { Input } from "#web/components/ui/input";
import { Textarea } from "#web/components/ui/textarea";

import type { TProfileEditFormData } from "../useProfileEditForm";
import ProfileEditNicknameStatus from "./ProfileEditNicknameStatus";

interface IProps {
  baselineNickname: string;
  debouncedNickname: string;
  nicknameAvailable: boolean | undefined;
  nicknameFetching: boolean;
  nicknameError: boolean;
  onNicknameRecheck: () => void;
}

const inputClass =
  "min-h-10 w-full rounded-xl bg-surface-container-high px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant";

const ProfileEditBasicSection = ({
  baselineNickname,
  debouncedNickname,
  nicknameAvailable,
  nicknameFetching,
  nicknameError,
  onNicknameRecheck,
}: IProps) => {
  const { control } = useFormContext<TProfileEditFormData>();
  const bio = useWatch({ control, name: "bio" }) ?? "";

  const trimmedDebounced = debouncedNickname.trim();
  const shouldCheck =
    trimmedDebounced.length >= 1 &&
    trimmedDebounced.length <= 20 &&
    trimmedDebounced !== baselineNickname;

  return (
    <Card className="rounded-2xl border-outline-variant/50 bg-surface-container-low py-4 shadow-none ring-1 ring-outline-variant/30">
      <CardHeader className="pb-2">
        <h2 className="text-base font-bold text-on-surface">기본 정보</h2>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        <Controller
          control={control}
          name="nickname"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <FormHelper
                label="닉네임"
                description="프로필과 기록에 표시되는 이름이에요."
                message={{ error: fieldState.error?.message }}
                cloneChild={false}
                controlAriaLabel="닉네임"
              >
                <div className="flex gap-2">
                  <Input
                    {...field}
                    id="profile-nickname"
                    maxLength={20}
                    className={`${inputClass} min-w-0 flex-1`}
                    placeholder="닉네임"
                    autoComplete="nickname"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-10 shrink-0 rounded-xl px-3"
                    disabled={!shouldCheck || nicknameFetching}
                    onClick={onNicknameRecheck}
                  >
                    중복 확인
                  </Button>
                </div>
              </FormHelper>
              <ProfileEditNicknameStatus
                baselineNickname={baselineNickname}
                debouncedNickname={debouncedNickname}
                available={nicknameAvailable}
                isFetching={nicknameFetching}
                isError={nicknameError}
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="bio"
          render={({ field, fieldState }) => (
            <FormHelper
              label="한 줄 소개"
              labelSuffix={
                <span className="text-xs tabular-nums text-on-surface-variant">
                  {bio.length} / 200
                </span>
              }
              message={{ error: fieldState.error?.message }}
            >
              <Textarea
                {...field}
                maxLength={200}
                rows={3}
                className={`${inputClass} min-h-24 resize-none`}
                placeholder="예: V5 프로젝트 중 · 주말 볼더러"
              />
            </FormHelper>
          )}
        />

        <Controller
          control={control}
          name="instagramId"
          render={({ field, fieldState }) => (
            <FormHelper
              label="인스타그램"
              description="@ 없이 아이디만 입력해 주세요."
              message={{ error: fieldState.error?.message }}
              cloneChild={false}
              controlAriaLabel="인스타그램 아이디"
            >
              <div className="relative">
                <Instagram className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  {...field}
                  id="profile-instagram"
                  maxLength={50}
                  className={`${inputClass} pl-9`}
                  placeholder="인스타그램 아이디"
                  autoComplete="off"
                />
              </div>
            </FormHelper>
          )}
        />

        <Controller
          control={control}
          name="youtubeUrl"
          render={({ field, fieldState }) => (
            <FormHelper
              label="유튜브"
              description="유튜브 채널 URL을 입력해 주세요."
              message={{ error: fieldState.error?.message }}
              cloneChild={false}
              controlAriaLabel="유튜브 URL"
            >
              <div className="relative">
                <Youtube className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  {...field}
                  id="profile-youtube"
                  maxLength={200}
                  className={`${inputClass} pl-9`}
                  placeholder="https://youtube.com/@채널명"
                  autoComplete="off"
                />
              </div>
            </FormHelper>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileEditBasicSection;
