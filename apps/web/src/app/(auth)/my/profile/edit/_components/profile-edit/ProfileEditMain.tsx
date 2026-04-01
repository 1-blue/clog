"use client";

import { ArrowLeft } from "lucide-react";
import { FormProvider, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchClient, openapi } from "#web/apis/openapi";
import AppTopBar from "#web/components/layout/AppTopBar";
import { Button } from "#web/components/ui/button";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";
import useMe from "#web/hooks/useMe";

import ProfileEditAvatarSection from "./hero/ProfileEditAvatarSection";
import ProfileEditCoverSection from "./hero/ProfileEditCoverSection";
import ProfileEditMainSkeleton from "./ProfileEditMainSkeleton";
import ProfileEditAccountSection from "./sections/ProfileEditAccountSection";
import ProfileEditBasicSection from "./sections/ProfileEditBasicSection";
import useProfileEditForm, {
  type TProfileEditFormData,
} from "./useProfileEditForm";

const ProfileEditMain = () => {
  const router = useRouter();
  const { me } = useMe();

  const form = useProfileEditForm({
    defaultValues: {
      nickname: "",
      bio: "",
      instagramId: "",
      youtubeUrl: "",
    },
  });

  useEffect(() => {
    if (!me) return;
    form.reset({
      nickname: me.nickname,
      bio: me.bio ?? "",
      instagramId: me.instagramId ?? "",
      youtubeUrl: me.youtubeUrl ?? "",
    });
  }, [me, form]);

  const nickname = useWatch({ control: form.control, name: "nickname" }) ?? "";
  const { isSubmitting } = useFormState({ control: form.control });

  const [debouncedNick, setDebouncedNick] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedNick(nickname.trim()), 450);
    return () => window.clearTimeout(id);
  }, [nickname]);

  const shouldCheckNick =
    !!me &&
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

  const onSubmit = async (data: TProfileEditFormData) => {
    if (!me) return;
    form.clearErrors("nickname");

    const trimmedNick = data.nickname.trim();
    if (trimmedNick !== me.nickname) {
      const { data: availRes, error } = await fetchClient.GET(
        "/api/v1/users/me/nickname-availability",
        { params: { query: { nickname: trimmedNick } } },
      );
      if (error) {
        form.setError("nickname", {
          message: "닉네임 확인에 실패했습니다.",
        });
        return;
      }
      if (!availRes?.payload?.available) {
        form.setError("nickname", {
          message: "이미 사용 중인 닉네임입니다.",
        });
        return;
      }
    }

    const bio = me.bio ?? "";
    const instagramId = me.instagramId ?? "";
    const youtubeUrl = me.youtubeUrl ?? "";

    updateMeMutation.mutate(
      {
        body: {
          ...(trimmedNick !== me.nickname ? { nickname: trimmedNick } : {}),
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
        onSuccess: () => {
          toast.success("프로필이 변경되었습니다.");
          router.back();
        },
        onError: () => toast.error("프로필 변경에 실패했습니다."),
      },
    );
  };

  if (!me) {
    return <ProfileEditMainSkeleton />;
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit(onSubmit)(e);
        }}
        className="pb-28"
      >
        <AppTopBar
          showNotification={false}
          left={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex size-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
                aria-label="뒤로"
              >
                <ArrowLeft className="size-5" strokeWidth={2} />
              </button>
              <h1 className="text-lg font-semibold text-on-surface">
                프로필 수정
              </h1>
            </div>
          }
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
          <Button
            type="submit"
            className="h-11 w-full rounded-xl font-semibold"
            disabled={updateMeMutation.isPending || isSubmitting}
          >
            {updateMeMutation.isPending || isSubmitting ? "저장 중…" : "저장"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfileEditMain;
