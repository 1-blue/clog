import { FileText } from "lucide-react";

const CommunityPostListEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <FileText
        className="size-12 text-on-surface-variant"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="text-lg font-semibold text-on-surface">
        아직 게시글이 없습니다
      </h3>
      <p className="text-sm text-on-surface-variant">
        첫 번째 글을 작성해 보세요!
      </p>
    </div>
  );
};

export default CommunityPostListEmpty;
