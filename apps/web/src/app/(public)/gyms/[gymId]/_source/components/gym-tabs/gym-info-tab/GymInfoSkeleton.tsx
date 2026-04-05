/**
 * 암장 상세 페이지 로딩용 — `GymDetailMain` + 기본 탭(정보) 레이아웃과 맞춤.
 * (`loading.tsx`에서 페이지 전체에 사용)
 */
const GymInfoSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse relative pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
      {/* TopBar — 뒤로 + 제목 + 공유 슬롯 */}
      <header className="sticky top-0 z-40 -mx-2.5 flex h-14 items-center justify-between border-b border-outline-variant/30 px-2.5 backdrop-blur-xl">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="size-10 shrink-0 rounded-full bg-surface-container-high" />
          <div className="h-5 max-w-40 flex-1 rounded bg-surface-container-high" />
        </div>
        <div className="size-10 shrink-0 rounded-full bg-surface-container-high" />
      </header>

      {/* GymHeroSection — -mt-14로 상단바와 겹침, 하단 배지·제목·로고 자리 */}
      <section className="relative -mx-2.5 -mt-14 h-[min(440px,55vh)] w-[calc(100%+1.25rem)] overflow-hidden bg-surface-container-high">
        <div className="absolute right-6 bottom-8 left-6 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-6 w-24 rounded-full bg-black/20" />
            <div className="h-9 max-w-[min(18rem,85%)] rounded-lg bg-white/20" />
            <div className="h-9 max-w-[min(12rem,60%)] rounded-lg bg-white/15" />
          </div>
          <div className="size-16 shrink-0 rounded-2xl border border-white/10 bg-white/10" />
        </div>
      </section>

      {/* GymCheckInStatusBanner 생략(조건부) → LiveStats + 홈짐 + BasicInfo */}
      <div className="flex flex-col gap-6 pt-6 pb-4">
        <section className="relative z-10 w-full pb-2">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-surface-container-low/95 p-4 shadow-lg backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-2">
              <div className="size-4 shrink-0 rounded bg-surface-container-high" />
              <div className="h-3 w-14 rounded bg-surface-container-high" />
              <div className="h-5 w-11 rounded-full bg-surface-container-high" />
              <div className="ml-auto h-4 w-9 rounded bg-surface-container-high" />
            </div>
            <div className="h-2 rounded-full bg-surface-container-high" />
            <div className="grid grid-cols-1 gap-3 border-t border-white/5 pt-3 sm:grid-cols-2 sm:gap-4">
              <div className="h-4 rounded bg-surface-container-high" />
              <div className="h-4 rounded bg-surface-container-high" />
            </div>
          </div>
        </section>

        <div className="px-2">
          <div className="h-11 w-full rounded-xl bg-surface-container-low" />
        </div>

        <section className="flex flex-col gap-4">
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex items-start gap-4">
              <div className="size-11 shrink-0 rounded-full bg-surface-container-low" />
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <div className="h-3 w-14 rounded bg-surface-container-low" />
                <div className="h-4 w-full rounded bg-surface-container-low" />
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Tabs — sticky tab bar */}
      <div className="sticky top-14 z-20 border-b border-outline-variant/10 bg-background/90 backdrop-blur-lg">
        <div className="scrollbar-hide flex min-h-13 items-center gap-2 overflow-x-auto px-0 py-0 sm:gap-4">
          <div className="h-5 w-9 shrink-0 rounded bg-surface-container-high" />
          <div className="h-5 w-24 shrink-0 rounded bg-surface-container-high" />
          <div className="h-5 w-14 shrink-0 rounded bg-surface-container-high" />
        </div>
      </div>

      {/* TabsContent info — `px-2` + GymInfoTab `gap-6 py-4` */}
      <section className="flex flex-col gap-6 px-2 py-4">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-28 rounded bg-surface-container-low" />
          <div className="flex flex-wrap gap-x-1.5 gap-y-2.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-17 shrink-0 rounded-full bg-surface-container-high/80"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 h-3 w-12 rounded bg-surface-container-low" />
          <div className="flex flex-wrap gap-2.5 rounded-2xl border border-white/5 bg-surface-container-low p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-18 rounded-full bg-surface-container-high/80"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 h-3 w-10 rounded bg-surface-container-low" />
          <div className="rounded-2xl border border-white/5 bg-surface-container-low p-4">
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-surface-container-high" />
              <div className="h-3 w-full rounded bg-surface-container-high" />
              <div className="h-3 max-w-[90%] rounded bg-surface-container-high" />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 h-3 w-10 rounded bg-surface-container-low" />
          <ul className="space-y-2 rounded-2xl border border-white/5 bg-surface-container-low p-4">
            {[0, 1].map((key) => (
              <li key={key} className="flex items-center justify-between gap-4">
                <div className="h-4 w-28 rounded bg-surface-container-high" />
                <div className="h-4 w-20 rounded bg-surface-container-high" />
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low">
          <div className="h-80 min-h-80 bg-surface-container-high" />
        </div>

        <div className="mx-auto h-3 w-44 rounded bg-surface-container-low" />
      </section>
    </div>
  );
};

export default GymInfoSkeleton;
