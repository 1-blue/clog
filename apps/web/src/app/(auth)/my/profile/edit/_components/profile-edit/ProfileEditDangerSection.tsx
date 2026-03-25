"use client";

import { useState } from "react";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { fetchClient } from "#web/apis/openapi";
import { Button } from "#web/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#web/components/ui/dialog";
import { ROUTES } from "#web/constants";
import { createClient } from "#web/libs/supabase/client";

const ProfileEditDangerSection = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const { error } = await fetchClient.DELETE("/api/v1/users/me");
      if (error) {
        toast.error("회원 탈퇴에 실패했습니다.");
        return;
      }

      /* Supabase 세션 해제 후 로그인 페이지로 이동 */
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("회원 탈퇴가 완료되었습니다.");
      router.push(ROUTES.LOGIN.path);
      router.refresh();
    } catch {
      toast.error("회원 탈퇴에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="pt-2">
      <Dialog>
        <DialogTrigger
          render={
            <button
              type="button"
              className="flex w-full items-center gap-2 px-0 py-2 text-on-surface-variant transition-colors hover:text-on-surface"
            />
          }
        >
          <UserX className="size-5" strokeWidth={1.75} />
          <span className="text-sm underline-offset-2">회원 탈퇴하기</span>
        </DialogTrigger>

        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>정말 탈퇴하시겠어요?</DialogTitle>
            <DialogDescription>
              탈퇴하면 모든 기록, 리뷰, 게시글이 삭제되며 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={pending} />
              }
            >
              취소
            </DialogClose>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() => void handleDelete()}
            >
              {pending ? "탈퇴 중..." : "탈퇴하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProfileEditDangerSection;
