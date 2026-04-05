import PostArticleSkeleton from "../../_source/components/skeleton/PostArticleSkeleton";

/** `PostDetailLoadedBody`와 동일: `max-w-3xl` + `gap-6` + 구분선 + 댓글 블록 (sticky TopBar 아래 바로 이어짐) */
const PostDetailLoadingBody = () => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-2">
      <PostArticleSkeleton />

      <hr className="border-outline-variant" />

      <section className="flex animate-pulse flex-col gap-4" aria-hidden>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-14 rounded bg-surface-container-low" />
              <div className="h-4 w-6 rounded bg-surface-container-low" />
            </div>
            <div className="h-3 w-10 rounded bg-surface-container-low" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex gap-4">
              <div className="size-10 shrink-0 rounded-full bg-surface-container-low" />
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-3.5 w-24 rounded bg-surface-container-low" />
                  <div className="h-3 w-16 rounded bg-surface-container-low" />
                </div>
                <div className="h-3.5 w-full rounded bg-surface-container-low" />
                <div className="h-3.5 max-w-[95%] rounded bg-surface-container-low" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetailLoadingBody;
