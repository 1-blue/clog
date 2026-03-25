"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "#web/components/ui/avatar";
import { Button } from "#web/components/ui/button";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";
import { uploadWithPresignedUrl } from "#web/libs/upload/presignedUpload";

interface IProps {
  nickname: string;
  profileImage: string | null;
}

const ProfileEditAvatarSection = ({ nickname, profileImage }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { updateMeMutation } = useUserMutations();

  const pick = () => inputRef.current?.click();

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
        {
          onError: () => toast.error("프로필 이미지 저장에 실패했습니다."),
        },
      );
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative -mt-12 ml-6 w-fit">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onChange(e)}
      />
      <Avatar
        size="lg"
        className="size-24 rounded-2xl border-4 border-surface shadow-xl"
      >
        {profileImage ? (
          <AvatarImage src={profileImage} alt="" />
        ) : null}
        <AvatarFallback className="rounded-2xl text-2xl font-bold">
          {nickname.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <Button
        type="button"
        size="icon-sm"
        variant="secondary"
        className="absolute -right-1 -bottom-1 size-9 rounded-full border-2 border-surface shadow-md"
        onClick={pick}
        disabled={busy || updateMeMutation.isPending}
        aria-label="프로필 이미지 변경"
      >
        {busy || updateMeMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" strokeWidth={2} />
        )}
      </Button>
    </div>
  );
};

export default ProfileEditAvatarSection;
