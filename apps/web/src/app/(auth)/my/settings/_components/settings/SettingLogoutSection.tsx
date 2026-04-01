import { UserX } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

const SettingLogoutSection = () => {
  const router = useRouter();
  const supabase = createClient();

  const [deletePending, setDeletePending] = useState(false);

  const handleDeleteAccount = async () => {
    setDeletePending(true);
    try {
      const { error } = await fetchClient.DELETE("/api/v1/users/me");
      if (error) {
        toast.error("회원 탈퇴에 실패했습니다.");
        return;
      }

      await supabase.auth.signOut();
      toast.success("회원 탈퇴가 완료되었습니다.");
      router.push(ROUTES.LOGIN.path);
      router.refresh();
    } catch {
      toast.error("회원 탈퇴에 실패했습니다.");
    } finally {
      setDeletePending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive transition-colors hover:border-destructive/80 hover:bg-destructive/15 active:bg-destructive/20"
          />
        }
      >
        <UserX className="size-5 shrink-0" strokeWidth={1.75} />
        <span>회원 탈퇴하기</span>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-88"
      >
        <div className="px-6 pt-6 pb-1">
          <DialogHeader className="gap-0">
            <div className="flex gap-3">
              <div
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20 dark:bg-destructive/15"
              >
                <UserX className="size-5 text-destructive" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <DialogTitle className="text-lg leading-snug font-semibold tracking-tight">
                  정말 탈퇴하시겠어요?
                </DialogTitle>
                <DialogDescription className="text-[15px] leading-relaxed">
                  탈퇴하면 모든 기록, 리뷰, 게시글이 삭제되며 복구할 수
                  없습니다.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <DialogFooter className="mx-0 mb-0 flex-col-reverse gap-2.5 border-0 bg-transparent p-6 pt-5 sm:flex-row sm:justify-end sm:gap-2">
          <DialogClose
            render={
              <Button
                variant="outline"
                className="h-10 w-full cursor-pointer rounded-xl sm:w-auto sm:min-w-24"
                disabled={deletePending}
              />
            }
          >
            취소
          </DialogClose>
          <Button
            variant="destructive"
            className="h-10 w-full cursor-pointer rounded-xl border border-destructive/45 sm:w-auto sm:min-w-24"
            disabled={deletePending}
            onClick={() => void handleDeleteAccount()}
          >
            {deletePending ? "탈퇴 중..." : "탈퇴하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingLogoutSection;
