"use client";

import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

import { Button } from "#web/components/ui/button";
import useUserMutations from "#web/hooks/mutations/users/useUserMutations";
import { uploadWithPresignedUrl } from "#web/libs/upload/presignedUpload";
import { cn } from "#web/libs/utils";

interface IProps {
  coverImage: string | null;
}

const ProfileEditCoverSection = ({ coverImage }: IProps) => {
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

  return (
    <div className="relative h-44 w-full overflow-hidden bg-surface-container-low">
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center bg-gradient-to-b from-primary/25 to-surface-container-low" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onChange(e)}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className={cn(
          "absolute right-4 bottom-4 gap-1.5 rounded-full shadow-md",
        )}
        onClick={pick}
        disabled={busy || updateMeMutation.isPending}
      >
        {busy || updateMeMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" strokeWidth={2} />
        )}
        커버 이미지 변경
      </Button>
    </div>
  );
};

export default ProfileEditCoverSection;
