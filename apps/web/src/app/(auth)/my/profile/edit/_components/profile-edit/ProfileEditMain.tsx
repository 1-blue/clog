"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";

import { openapi } from "#web/apis/openapi";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";

import ProfileEditAccountSection from "./ProfileEditAccountSection";
import ProfileEditAvatarSection from "./ProfileEditAvatarSection";
import ProfileEditBasicSection from "./ProfileEditBasicSection";
import ProfileEditCoverSection from "./ProfileEditCoverSection";
import ProfileEditDangerSection from "./ProfileEditDangerSection";
import ProfileEditTopBar from "./ProfileEditTopBar";

const ProfileEditMain = () => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  const [nickname, setNickname] = useState(me.nickname);
  const [bio, setBio] = useState(me.bio ?? "");
  const [instagramId, setInstagramId] = useState(me.instagramId ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(me.youtubeUrl ?? "");
  const [debouncedNick, setDebouncedNick] = useState(me.nickname);

  useEffect(() => {
    setNickname(me.nickname);
    setBio(me.bio ?? "");
    setInstagramId(me.instagramId ?? "");
    setYoutubeUrl(me.youtubeUrl ?? "");
    setDebouncedNick(me.nickname);
  }, [me.nickname, me.bio, me.instagramId, me.youtubeUrl]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedNick(nickname.trim()), 450);
    return () => window.clearTimeout(id);
  }, [nickname]);

  const shouldCheckNick =
    debouncedNick.length >= 1 &&
    debouncedNick.length <= 20 &&
    debouncedNick !== me.nickname;

  const {
    data: nicknameAvailable,
    isFetching: nicknameFetching,
    isError: nicknameError,
    refetch: refetchNickname,
  } = openapi.useQuery(
    "get",
    "/api/v1/users/me/nickname-availability",
    {
      params: { query: { nickname: debouncedNick } },
    },
    {
      enabled: shouldCheckNick,
      select: (d) => d.payload.available,
      staleTime: 30_000,
    },
  );

  const { updateMeMutation } = useUserMutations();

  const trimmedNick = nickname.trim();
  const nickDirty = trimmedNick !== me.nickname;
  const bioDirty = bio !== (me.bio ?? "");
  const instagramDirty = instagramId !== (me.instagramId ?? "");
  const youtubeDirty = youtubeUrl !== (me.youtubeUrl ?? "");

  const nickOk =
    !nickDirty ||
    (debouncedNick === trimmedNick &&
      nicknameAvailable === true &&
      !nicknameError);

  const hasDirty = nickDirty || bioDirty || instagramDirty || youtubeDirty;

  const saveDisabled =
    !hasDirty || !nickOk || trimmedNick.length < 1 || trimmedNick.length > 20;

  const save = () => {
    if (saveDisabled) {
      if (hasDirty && !nickOk) {
        toast.error("닉네임 중복 여부를 확인해 주세요.");
      }
      return;
    }
    updateMeMutation.mutate(
      {
        body: {
          ...(nickDirty ? { nickname: trimmedNick } : {}),
          ...(bioDirty ? { bio: bio.trim() } : {}),
          ...(instagramDirty ? { instagramId: instagramId.trim() } : {}),
          ...(youtubeDirty
            ? { youtubeUrl: youtubeUrl.trim() || undefined }
            : {}),
        },
      },
      {
        onSuccess: () => toast.success("저장했습니다."),
        onError: () => toast.error("저장에 실패했습니다."),
      },
    );
  };

  return (
    <div className="pb-28">
      <ProfileEditTopBar
        onSave={save}
        saveDisabled={saveDisabled}
        savePending={updateMeMutation.isPending}
      />
      <div className="relative">
        <ProfileEditCoverSection coverImage={me.coverImage} />
        <ProfileEditAvatarSection
          nickname={nickname}
          profileImage={me.profileImage}
        />
      </div>
      <div className="mx-auto mt-10 max-w-lg space-y-5 px-4 pb-8">
        <ProfileEditBasicSection
          nickname={nickname}
          onNicknameChange={setNickname}
          bio={bio}
          onBioChange={setBio}
          instagramId={instagramId}
          onInstagramIdChange={setInstagramId}
          youtubeUrl={youtubeUrl}
          onYoutubeUrlChange={setYoutubeUrl}
          baselineNickname={me.nickname}
          debouncedNickname={debouncedNick}
          nicknameAvailable={nicknameAvailable}
          nicknameFetching={nicknameFetching}
          nicknameError={nicknameError}
          onNicknameRecheck={() => void refetchNickname()}
        />
        <ProfileEditAccountSection
          email={me.email}
          linkedProviders={me.linkedProviders}
        />
        <ProfileEditDangerSection />
      </div>
    </div>
  );
};

export default ProfileEditMain;
