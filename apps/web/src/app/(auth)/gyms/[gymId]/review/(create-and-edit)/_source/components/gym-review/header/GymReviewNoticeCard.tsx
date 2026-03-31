"use client";

import { Info } from "lucide-react";

import { Card, CardContent } from "#web/components/ui/card";

const GymReviewNoticeCard = () => {
  return (
    <Card size="sm" className="border-primary/20 bg-primary/5 ring-primary/10">
      <CardContent className="flex gap-3">
        <Info
          className="size-5 shrink-0 text-primary"
          strokeWidth={2}
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-on-surface-variant">
          작성하신 리뷰는 공개되며 다른 사용자에게 표시됩니다.
          욕설·비방·개인정보 노출은 삭제될 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
};

export default GymReviewNoticeCard;
