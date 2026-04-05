import { Info } from "lucide-react";

const CommunityGuestNotice: React.FC = () => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-high p-4">
      <Info
        className="size-5 shrink-0 text-secondary"
        strokeWidth={2}
        aria-hidden
      />
      <p className="text-xs leading-relaxed text-on-surface-variant">
        로그인 없이도 모든 게시글을 자유롭게 읽을 수 있어요.
        <br />
        댓글·좋아요·글쓰기는 로그인 후 이용해 주세요.
      </p>
    </div>
  );
};

export default CommunityGuestNotice;
