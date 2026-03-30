"use client";

import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import useUserMutations from "#web/hooks/mutations/users/useUserMutations";
import { uploadWithPresignedUrl } from "#web/libs/upload/presignedUpload";

interface IProps {
  coverImage: string | null;
}

const ProfileEditCoverSection = ({ coverImage }: IProps) => {
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
        { body: { coverImage: url } },
        {
          onError: () => toast.error("커버 이미지 저장에 실패했습니다."),
        },
      );
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const isLoading = busy || updateMeMutation.isPending;

  return (
    <label className="relative block h-44 w-full cursor-pointer overflow-hidden bg-surface-container-low group">
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center bg-linear-to-b from-primary/25 to-surface-container-low" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
        {isLoading ? (
          <Loader2 className="size-7 animate-spin text-white drop-shadow" />
        ) : (
          <Camera className="size-7 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" strokeWidth={2} />
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

export default ProfileEditCoverSection;
