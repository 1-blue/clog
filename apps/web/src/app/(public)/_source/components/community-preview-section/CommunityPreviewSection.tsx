import Link from "next/link";

import { ROUTES } from "#web/constants";

import CommunityCardList from "./CommunityCardList";

/** 커뮤니티 인기글 (썸네일 + 가로형 카드) */
const CommunityPreviewSection = () => {
  return (
    <section className="flex flex-col gap-4 pb-4">
      <h2 className="text-lg font-bold text-on-surface">커뮤니티 인기글</h2>

      <CommunityCardList />

      <Link
        href={ROUTES.COMMUNITY.path}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-surface-container py-4 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        커뮤니티 더보기
      </Link>
    </section>
  );
};

export default CommunityPreviewSection;
