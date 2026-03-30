"use client";

import { FormProvider } from "react-hook-form";
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
import useProfileEditForm from "./useProfileEditForm";

const ProfileEditMain = () => {
  const { data: me } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me",
    undefined,
    { select: (d) => d.payload },
  );

  const form = useProfileEditForm({
    defaultValues: {
      nickname: me.nickname,
      bio: me.bio ?? "",
      instagramId: me.instagramId ?? "",
      youtubeUrl: me.youtubeUrl ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      nickname: me.nickname,
      bio: me.bio ?? "",
      instagramId: me.instagramId ?? "",
      youtubeUrl: me.youtubeUrl ?? "",
    });
  }, [me.nickname, me.bio, me.instagramId, me.youtubeUrl]);

  const nickname = form.watch("nickname");
  const [debouncedNick, setDebouncedNick] = useState(me.nickname);

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
    { params: { query: { nickname: debouncedNick } } },
    {
      enabled: shouldCheckNick,
      select: (d) => d.payload.available,
      staleTime: 30_000,
    },
  );

  const { updateMeMutation } = useUserMutations();

  const { isDirty, isValid } = form.formState;

  const trimmedNick = nickname.trim();
  const nickDirty = trimmedNick !== me.nickname;
  const nickOk =
    !nickDirty ||
    (debouncedNick === trimmedNick &&
      nicknameAvailable === true &&
      !nicknameError);

  const saveDisabled =
    !isDirty || !isValid || !nickOk || trimmedNick.length < 1;

  const save = form.handleSubmit((data) => {
    if (!nickOk) {
      toast.error("닉네임 중복 여부를 확인해 주세요.");
      return;
    }
    const bio = me.bio ?? "";
    const instagramId = me.instagramId ?? "";
    const youtubeUrl = me.youtubeUrl ?? "";

    updateMeMutation.mutate(
      {
        body: {
          ...(data.nickname.trim() !== me.nickname
            ? { nickname: data.nickname.trim() }
            : {}),
          ...(data.bio !== bio ? { bio: data.bio.trim() } : {}),
          ...(data.instagramId !== instagramId
            ? { instagramId: data.instagramId.trim() }
            : {}),
          ...(data.youtubeUrl !== youtubeUrl
            ? { youtubeUrl: data.youtubeUrl.trim() || undefined }
            : {}),
        },
      },
      {
        onSuccess: () => toast.success("저장했습니다."),
        onError: () => toast.error("저장에 실패했습니다."),
      },
    );
  });

  return (
    <FormProvider {...form}>
      <div className="pb-28">
        <ProfileEditTopBar
          onSave={() => void save()}
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
    </FormProvider>
  );
};

export default ProfileEditMain;
