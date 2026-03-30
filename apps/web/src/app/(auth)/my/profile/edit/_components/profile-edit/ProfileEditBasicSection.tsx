"use client";

import { Instagram, Youtube } from "lucide-react";

import { Card, CardContent, CardHeader } from "#web/components/ui/card";
import { Input } from "#web/components/ui/input";
import { Label } from "#web/components/ui/label";
import { Textarea } from "#web/components/ui/textarea";

import ProfileEditNicknameStatus from "./ProfileEditNicknameStatus";

interface IProps {
  nickname: string;
  onNicknameChange: (v: string) => void;
  bio: string;
  onBioChange: (v: string) => void;
  instagramId: string;
  onInstagramIdChange: (v: string) => void;
  youtubeUrl: string;
  onYoutubeUrlChange: (v: string) => void;
  baselineNickname: string;
  debouncedNickname: string;
  nicknameAvailable: boolean | undefined;
  nicknameFetching: boolean;
  nicknameError: boolean;
  onNicknameRecheck: () => void;
}

const ProfileEditBasicSection = ({
  nickname,
  onNicknameChange,
  bio,
  onBioChange,
  instagramId,
  onInstagramIdChange,
  youtubeUrl,
  onYoutubeUrlChange,
  baselineNickname,
  debouncedNickname,
  nicknameAvailable,
  nicknameFetching,
  nicknameError,
  onNicknameRecheck,
}: IProps) => {
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
          <Input
            id="profile-nickname"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            maxLength={20}
            className="mt-1.5 rounded-xl bg-surface-container-high"
            placeholder="닉네임"
            autoComplete="nickname"
          />
          <p className="mt-1 text-xs text-on-surface-variant">
            프로필과 기록에 표시되는 이름이에요.
          </p>
          <ProfileEditNicknameStatus
            baselineNickname={baselineNickname}
            debouncedNickname={debouncedNickname}
            available={nicknameAvailable}
            isFetching={nicknameFetching}
            isError={nicknameError}
            onRecheck={onNicknameRecheck}
          />
        </div>

        {/* 한 줄 소개 */}
        <div>
          <Label htmlFor="profile-bio" className="text-sm font-medium">
            한 줄 소개
          </Label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            maxLength={200}
            rows={3}
            className="mt-1.5 min-h-24 resize-none rounded-xl bg-surface-container-high"
            placeholder="예: V5 프로젝트 중 · 주말 볼더러"
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
              value={instagramId}
              onChange={(e) => onInstagramIdChange(e.target.value)}
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
              value={youtubeUrl}
              onChange={(e) => onYoutubeUrlChange(e.target.value)}
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
