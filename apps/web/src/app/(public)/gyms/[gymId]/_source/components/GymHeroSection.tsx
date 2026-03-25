import { Heart, Mountain, Share2 } from "lucide-react";
import { toast } from "sonner";

import type { components } from "#web/@types/openapi";
import TopBar from "#web/components/layout/TopBar";

type TGymDetail = components["schemas"]["GymDetail"];

interface IProps {
  gym: TGymDetail;
}

const GymHeroSection: React.FC<IProps> = ({ gym }) => {
  const shareGym = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: gym.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.message("링크를 복사했어요");
      }
    } catch {
      /* 사용자 취소 등 */
    }
  };

  return (
    <>
      <TopBar
        showBack
        transparent
        title="암장 상세"
        action={
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => void shareGym()}
              className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-white/5"
              aria-label="공유"
            >
              <Share2 className="size-5" strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-primary hover:bg-white/5"
              aria-label="찜 (준비 중)"
            >
              <Heart className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        }
      />

      <section className="relative -mt-14 h-[min(440px,55vh)] w-full overflow-hidden bg-surface-container-high">
        {gym.images[0] ? (
          <img
            src={gym.images[0].url}
            alt={gym.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Mountain
              className="size-20 text-on-surface-variant"
              strokeWidth={1.25}
              aria-hidden
            />
          </div>
        )}
        <div className="kinetic-gradient pointer-events-none absolute inset-0" />
        <div className="absolute right-6 bottom-8 left-6 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="mb-3 inline-flex items-center rounded-md border border-secondary/30 bg-secondary/20 px-2.5 py-1 text-xs font-bold tracking-wide text-secondary">
              영업 중
            </span>
            <h1 className="text-3xl font-extrabold tracking-tighter break-keep text-white uppercase sm:text-4xl">
              {gym.name}
            </h1>
          </div>
          {gym.images[0] ? (
            <div className="size-16 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-surface-container-highest/50 shadow-2xl backdrop-blur-md">
              <img
                src={gym.images[0].url}
                alt=""
                className="size-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default GymHeroSection;
