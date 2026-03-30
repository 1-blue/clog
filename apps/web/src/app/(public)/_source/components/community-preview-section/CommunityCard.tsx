import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bookmark, FileText, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

import { categoryToKoreanMap, postCategoryMap } from "@clog/utils";

import { components } from "#web/@types/openapi";
import { Badge } from "#web/components/ui/badge";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

interface IProps {
  post: components["schemas"]["PostListItem"];
}

const CommunityCard: React.FC<IProps> = ({ post }) => {
  const isBookmarked = (post.bookmarks?.length ?? 0) > 0;
  const isLiked = (post.likes?.length ?? 0) > 0;

  return (
    <Link
      key={post.id}
      className="group flex gap-4"
      href={ROUTES.COMMUNITY.DETAIL.path(post.id)}
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
        {post.images[0]?.url ? (
          <img
            src={post.images[0].url}
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <FileText
              className="size-8 text-on-surface-variant"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge color={postCategoryMap[post.category]}>
            {categoryToKoreanMap[post.category]}
          </Badge>
          <span className="text-xs text-outline">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-1 text-sm font-medium text-on-surface/90">
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span
            className={cn(
              "flex items-center gap-1 text-xs",
              isLiked && "text-primary",
            )}
          >
            <Heart
              className="size-3.5 shrink-0"
              strokeWidth={2}
              fill={isLiked ? "currentColor" : "transparent"}
              aria-hidden
            />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <MessageCircle
              className="size-3.5 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            {post.commentCount}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Bookmark
              className={cn(
                "size-3.5 shrink-0",
                isBookmarked
                  ? "fill-primary text-primary"
                  : "text-on-surface-variant",
              )}
              strokeWidth={2}
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
