"use client";

import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#web/components/ui/avatar";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";
import { uploadWithPresignedUrl } from "#web/libs/upload/presignedUpload";

interface IProps {
  nickname: string;
  profileImage: string | null;
}

const ProfileEditAvatarSection = ({ nickname, profileImage }: IProps) => {
  const [busy, setBusy] = useState(false);
  const { updateMeMutation } = useUserMutations();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 올릴 수 있어요.");
      return;
    }
    setBusy(true);
    try {
      const url = await uploadWithPresignedUrl(file, "images");
      updateMeMutation.mutate(
        { body: { profileImage: url } },
        { onError: () => toast.error("프로필 이미지 저장에 실패했습니다.") },
      );
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const isLoading = busy || updateMeMutation.isPending;

  return (
    <label
      className="group relative -mt-12 ml-6 block w-fit cursor-pointer"
      aria-label="프로필 이미지 변경"
    >
      <Avatar
        size="lg"
        className="size-24 rounded-2xl border-4 border-surface shadow-xl"
      >
        {profileImage ? <AvatarImage src={profileImage} alt="" /> : null}
        <AvatarFallback className="rounded-2xl text-2xl font-bold">
          {nickname.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition-colors group-hover:bg-black/30">
        {isLoading ? (
          <Loader2 className="size-6 animate-spin text-white drop-shadow" />
        ) : (
          <Camera
            className="size-6 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100"
            strokeWidth={2}
          />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={isLoading}
        onChange={(e) => void onChange(e)}
      />
    </label>
  );
};

export default ProfileEditAvatarSection;
