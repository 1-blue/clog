"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "#web/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#web/components/ui/dialog";

interface IProps {
  reviewId: string;
}

const ReviewDeleteButton: React.FC<IProps> = ({ reviewId }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/v1/admin/reviews/${reviewId}`, {
      method: "DELETE",
    });
    const body = await res.json().catch(() => null);
    setDeleting(false);
    if (!res.ok) {
      toast.error(body?.toast ?? "삭제 실패");
      return;
    }
    toast.success("삭제되었습니다.");
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            삭제
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>리뷰 삭제</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-on-surface-variant">
          정말로 이 리뷰를 삭제하시겠습니까? 암장 평균 평점이 재계산됩니다.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">취소</Button>} />
          <Button variant="destructive" onClick={onDelete} disabled={deleting}>
            {deleting ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDeleteButton;
