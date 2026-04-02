"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { buttonVariants } from "#web/components/ui/button-variants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#web/components/ui/popover";
import useMe from "#web/hooks/useMe";
import usePostDetailMutations from "#web/hooks/mutations/posts/usePostDetailMutations";
import { cn } from "#web/libs/utils";

interface IProps {
  postId: string;
  commentId: string;
  authorId: string;
  onEdit: () => void;
}

/** 본인 댓글만 · 수정/삭제 메뉴 */
const CommentOwnerMenu: React.FC<IProps> = ({
  postId,
  commentId,
  authorId,
  onEdit,
}) => {
  const { me } = useMe();
  const { deleteCommentMutation } = usePostDetailMutations();
  const [open, setOpen] = useState(false);

  if (me?.id !== authorId) return null;

  const handleDelete = () => {
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    setOpen(false);
    deleteCommentMutation.mutate({
      params: { path: { postId, commentId } },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "-mr-1 shrink-0 text-on-surface-variant hover:text-on-surface",
        )}
        aria-label="댓글 메뉴"
      >
        <MoreVertical className="size-4" strokeWidth={2} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto min-w-36 p-1">
        <button
          type="button"
          onClick={() => {
            onEdit();
            setOpen(false);
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-on-surface hover:bg-surface-container-high"
        >
          <Pencil className="size-4" aria-hidden />
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteCommentMutation.isPending}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          <Trash2 className="size-4" aria-hidden />
          삭제
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default CommentOwnerMenu;
