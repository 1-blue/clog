"use client";

import {
  BarChart3,
  Building2,
  MapPin,
  MessagesSquare,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "#web/libs/utils";

const items: {
  icon: typeof MapPin;
  title: string;
  body: string[];
}[] = [
  {
    icon: MapPin,
    title: "체크인·체크아웃으로 혼잡도",
    body: [
      "암장에 도착해 체크인하면 실시간 방문자 수에 반영돼요. 체크아웃까지 기록되면 ‘지금 이 공간에 얼마나 붐비는지’를 숫자로 가늠할 수 있어요.",
      "홈 화면의 혼잡도 랭킹과 암장 상세에서 같은 흐름을 확인할 수 있어, 방문 타이밍을 정할 때 참고하기 좋아요.",
    ],
  },
  {
    icon: BarChart3,
    title: "볼더링 기록·통계 대시보드",
    body: [
      "세션마다 루트·난이도·결과를 남기면 주·월·연·전체 기간으로 완등 수와 난이도 분포, 활동 추세를 볼 수 있어요.",
      "‘이번 주는 어디에 시간을 썼는지’ 한눈에 정리되는 리포트 느낌으로, 실력 향상이나 루틴 점검에 쓸 수 있어요.",
    ],
  },
  {
    icon: Building2,
    title: "암장별 정보·리뷰",
    body: [
      "암장마다 혼잡도·사진·위치 정보를 모아 두었고, 실제 방문자 리뷰로 분위기와 세팅을 미리 가늠할 수 있어요.",
      "자주 가는 암장을 홈짐으로 지정해 두면 프로필과 기록 맥락에도 자연스럽게 연결돼요.",
    ],
  },
  {
    icon: MessagesSquare,
    title: "커뮤니티",
    body: [
      "질문·후기·팁을 게시글로 남기고 댓글로 이어 갈 수 있어요. 혼자만의 기록을 넘어, 같은 암장·같은 난이도를 노리는 사람들과 연결되는 공간이에요.",
    ],
  },
];

const LandingFeatures: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-60px" }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
          클로그가 할 수 있는 일
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-on-surface-variant sm:text-base">
          데스크톱 브라우저와 모바일 모두 같은 계정으로 접속할 수 있어요. 집에서는 대시보드를,
          암장에서는 체크인과 기록을—화면 크기만 바뀌고 경험은 이어져요.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:gap-8">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={cn(
                "group flex flex-col rounded-2xl border border-outline-variant/35 bg-linear-to-b from-surface-container-low/90 to-surface-container-low/40 p-6 sm:p-7",
                "shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-105">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-bold text-on-surface sm:text-xl">
                {item.title}
              </h3>
              <div className="mt-3 space-y-3 text-left text-sm leading-relaxed text-on-surface-variant">
                {item.body.map((p, j) => (
                  <p key={`${item.title}-${j}`}>{p}</p>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default LandingFeatures;
