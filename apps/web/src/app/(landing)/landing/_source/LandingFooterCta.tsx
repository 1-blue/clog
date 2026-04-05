"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { buttonVariants } from "#web/components/ui/button-variants";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

const LandingFooterCta: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      className="rounded-3xl border border-outline-variant/30 bg-linear-to-br from-primary/8 via-surface-container-low/80 to-secondary/5 px-4 py-14 text-center sm:px-10 sm:py-16 lg:px-14 lg:py-20"
    >
      <h2 className="text-xl font-bold text-on-surface sm:text-2xl lg:text-3xl">
        오늘 세션, 클로그에 남겨볼까요?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-pretty text-on-surface-variant sm:text-base">
        로그인하면 홈·통계·기록·커뮤니티를 바로 쓸 수 있어요. 이미 클라이밍을
        즐기고 있다면, 기록이 쌓일수록 리포트가 더 선명해져요.
      </p>
      <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={ROUTES.LOGIN.path}
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full px-12 py-6 shadow-lg shadow-primary/15",
          )}
        >
          로그인 / 회원가입
        </Link>
        <Link
          href={ROUTES.HOME.path}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-full border-outline-variant/80 bg-background/50 px-12 py-6 backdrop-blur-sm",
          )}
        >
          체험해보기
        </Link>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-on-surface-variant">
        <Link
          href={ROUTES.EXTERNAL_LINKS.OPEN_KAKAO.path}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 transition-colors hover:text-on-surface hover:underline"
        >
          오픈 카톡방
        </Link>
        <span className="text-outline-variant/50">|</span>
        <Link
          href={ROUTES.EXTERNAL_LINKS.FEEDBACK_FORM.path}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 transition-colors hover:text-on-surface hover:underline"
        >
          피드백 보내기
        </Link>
      </div>
    </motion.section>
  );
};

export default LandingFooterCta;
