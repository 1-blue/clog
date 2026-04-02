"use client";

import { motion } from "motion/react";

const steps = [
  {
    step: "01",
    title: "암장 체크인",
    desc: "목록에서 암장을 찾거나 상세 페이지에서 체크인해요. 방문자 수에 반영되면 혼잡도 흐름을 같이 봐요.",
  },
  {
    step: "02",
    title: "세션을 기록",
    desc: "볼더링 루트별 난이도·완등·시도를 남기면 기록과 통계가 자동으로 쌓여요.",
  },
  {
    step: "03",
    title: "통계와 커뮤니티",
    desc: "기간별 리포트로 패턴을 보고, 커뮤니티에서 질문·팁을 나눠요.",
  },
];

const LandingHowItWorks: React.FC = () => {
  return (
    <section className="border-y border-outline-variant/20 py-16 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-60px" }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          이렇게 이어져요
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-on-surface-variant sm:text-base">
          복잡한 설정 없이, 방문·기록·분석이 한 줄로 연결되는 흐름이에요.
        </p>
      </motion.div>

      <ol className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {steps.map((s, i) => (
          <motion.li
            key={s.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, margin: "-40px" }}
            className="relative rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-6 text-left"
          >
            <span className="font-mono text-3xl font-bold text-primary/40 tabular-nums">
              {s.step}
            </span>
            <h3 className="mt-3 text-lg font-bold text-on-surface">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {s.desc}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};

export default LandingHowItWorks;
