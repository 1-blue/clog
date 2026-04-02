"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  categoryToKoreanMap,
  postCategoryMap,
  type CommunityCategory,
} from "@clog/utils";

import { Badge } from "#web/components/ui/badge";
import { buttonVariants } from "#web/components/ui/button-variants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#web/components/ui/popover";
import { ROUTES } from "#web/constants";
import usePostMutations from "#web/hooks/mutations/posts/usePostMutations";
import { cn } from "#web/libs/utils";

interface IProps {
  postId: string;
  category: CommunityCategory;
  title: string;
  isOwner: boolean;
}

const PostArticleTitleBlock: React.FC<IProps> = ({
  postId,
  category,
  title,
  isOwner,
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { postDeleteMutation } = usePostMutations();

  const handleDelete = () => {
    if (!window.confirm("이 게시글을 삭제할까요?")) return;
    setOpen(false);
    postDeleteMutation.mutate({ params: { path: { postId } } });
    router.replace(ROUTES.COMMUNITY.path);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <Badge color={postCategoryMap[category]}>
          {categoryToKoreanMap[category]}
        </Badge>
        {isOwner ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "shrink-0 text-on-surface-variant hover:text-on-surface",
              )}
              aria-label="게시글 메뉴"
            >
              <MoreVertical className="size-5" strokeWidth={2} />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto min-w-36 p-1">
              <div className="flex flex-col gap-0.5">
                <Link
                  href={ROUTES.COMMUNITY.EDIT.path(postId)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high"
                >
                  <Pencil className="size-4" aria-hidden />
                  수정
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={postDeleteMutation.isPending}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  <Trash2 className="size-4" aria-hidden />
                  삭제
                </button>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
      <h2 className="text-3xl leading-tight font-semibold tracking-tight break-keep text-on-surface">
        {title}
      </h2>
    </div>
  );
};

export default PostArticleTitleBlock;
