"use client";

import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import useMe from "#web/hooks/useMe";
import { cn } from "#web/libs/utils";

interface IProps {
  gymId: string;
}

const GymReviewWriteCta = ({ gymId }: IProps) => {
  const router = useRouter();
  const { me } = useMe();

  const { data: myReviewRes, isFetching } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}/reviews/me",
    { params: { path: { gymId } } },
    {
      enabled: Boolean(me),
      select: (d) => d.payload,
    },
  );

  const myReview = myReviewRes ?? null;
  const label = myReview ? "리뷰 수정" : "리뷰 작성";

  const href = me
    ? myReview
      ? ROUTES.GYMS.DETAIL.REVIEW.EDIT.path(gymId, myReview.id)
      : ROUTES.GYMS.DETAIL.REVIEW.CREATE.path(gymId)
    : undefined;

  const onClick = () => {
    if (!me) {
      toast.message("로그인이 필요합니다.");
      const callbackUrl = encodeURIComponent(ROUTES.GYMS.DETAIL.path(gymId));
      router.push(`${ROUTES.LOGIN.path}?callbackUrl=${callbackUrl}`);
      return;
    }
    if (href) router.push(href);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={Boolean(me) && isFetching}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-surface-container-high/60 px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high active:scale-[0.99]",
        Boolean(me) && isFetching && "pointer-events-none opacity-60",
      )}
    >
      <SquarePen className="size-4" strokeWidth={2} aria-hidden />
      {Boolean(me) && isFetching ? "불러오는 중…" : label}
    </button>
  );
};

export default GymReviewWriteCta;
