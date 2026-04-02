"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { buttonVariants } from "#web/components/ui/button";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

const LandingHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-outline-variant/25 bg-surface-container-low/40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-32 size-[420px] rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />
      <div className="relative px-4 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.35em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase sm:text-xs"
          >
            클로그 · 볼더링 · 커뮤니티
          </motion.p>
          <h1 className="mt-5 text-[1.65rem] leading-[1.15] font-bold tracking-tight text-on-surface sm:text-4xl lg:text-[2.75rem]">
            오늘 암장은
            <br />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              얼마나 붐빌까
            </span>
            , 내 볼더링은
            <br className="hidden sm:block" /> 어디까지 왔을까
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-pretty text-on-surface-variant sm:text-base">
            체크인 한 번이면 방문자 흐름이 숫자로 남고, 세션 기록이 쌓이면
            주간·월간 리포트가 완성돼요.
            <br />
            암장 정보와 리뷰, 커뮤니티까지 클라이밍 루틴을 한곳에서 이어 가요.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={ROUTES.LOGIN.path}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-10 py-6 text-base shadow-lg shadow-primary/10",
              )}
            >
              무료로 시작하기
            </Link>
            <Link
              href={ROUTES.GYMS.path}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full border-outline-variant/80 bg-background/40 px-10 py-6 text-base backdrop-blur-sm",
              )}
            >
              암장 둘러보기
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
