"use client";

import { Instagram, Youtube } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "#web/components/ui/button";
import { Card, CardContent, CardHeader } from "#web/components/ui/card";
import { Input } from "#web/components/ui/input";
import { Label } from "#web/components/ui/label";
import { Textarea } from "#web/components/ui/textarea";

import type { TProfileEditFormData } from "./useProfileEditForm";
import ProfileEditNicknameStatus from "./ProfileEditNicknameStatus";

interface IProps {
  baselineNickname: string;
  debouncedNickname: string;
  nicknameAvailable: boolean | undefined;
  nicknameFetching: boolean;
  nicknameError: boolean;
  onNicknameRecheck: () => void;
}

const ProfileEditBasicSection = ({
  baselineNickname,
  debouncedNickname,
  nicknameAvailable,
  nicknameFetching,
  nicknameError,
  onNicknameRecheck,
}: IProps) => {
  const { control, register, watch } = useFormContext<TProfileEditFormData>();
  const bio = watch("bio");

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
        {/* 닉네임 */}
        <div>
          <Label htmlFor="profile-nickname" className="text-sm font-medium">
            닉네임
          </Label>
          <div className="mt-1.5 flex gap-2">
            <Input
              id="profile-nickname"
              {...register("nickname")}
              maxLength={20}
              className="flex-1 rounded-xl bg-surface-container-high"
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
          <p className="mt-1 text-xs text-on-surface-variant">
            프로필과 기록에 표시되는 이름이에요.
          </p>
          <ProfileEditNicknameStatus
            baselineNickname={baselineNickname}
            debouncedNickname={debouncedNickname}
            available={nicknameAvailable}
            isFetching={nicknameFetching}
            isError={nicknameError}
          />
        </div>

        {/* 한 줄 소개 */}
        <div>
          <Label htmlFor="profile-bio" className="text-sm font-medium">
            한 줄 소개
          </Label>
          <Controller
            control={control}
            name="bio"
            render={({ field }) => (
              <Textarea
                id="profile-bio"
                {...field}
                maxLength={200}
                rows={3}
                className="mt-1.5 min-h-24 resize-none rounded-xl bg-surface-container-high"
                placeholder="예: V5 프로젝트 중 · 주말 볼더러"
              />
            )}
          />
          <p className="mt-1 text-right text-xs text-on-surface-variant tabular-nums">
            {bio.length} / 200
          </p>
        </div>

        {/* 인스타그램 */}
        <div>
          <Label htmlFor="profile-instagram" className="text-sm font-medium">
            인스타그램
          </Label>
          <div className="relative mt-1.5">
            <Instagram className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              id="profile-instagram"
              {...register("instagramId")}
              maxLength={50}
              className="rounded-xl bg-surface-container-high pl-9"
              placeholder="인스타그램 아이디"
              autoComplete="off"
            />
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            @ 없이 아이디만 입력해 주세요.
          </p>
        </div>

        {/* 유튜브 */}
        <div>
          <Label htmlFor="profile-youtube" className="text-sm font-medium">
            유튜브
          </Label>
          <div className="relative mt-1.5">
            <Youtube className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              id="profile-youtube"
              {...register("youtubeUrl")}
              maxLength={200}
              className="rounded-xl bg-surface-container-high pl-9"
              placeholder="https://youtube.com/@채널명"
              autoComplete="off"
            />
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            유튜브 채널 URL을 입력해 주세요.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditBasicSection;
