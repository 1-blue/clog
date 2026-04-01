"use client";

import { cn } from "#web/libs/utils";

interface IProps {
  className?: string;
}

/** 볼더 기록에서 플래시·온사이트 용어 안내 */
const RecordDetailResultGlossary: React.FC<IProps> = ({ className }) => (
  <section
    className={cn(
      "rounded-2xl border border-outline-variant/25 bg-surface-container-low/80 px-4 py-4",
      className,
    )}
  >
    <h3 className="text-sm font-bold text-on-surface">플래시 · 온사이트란?</h3>
    <dl className="mt-3 space-y-3 text-sm leading-relaxed text-on-surface-variant">
      <div>
        <dt className="font-semibold text-on-surface">플래시 (Flash)</dt>
        <dd className="mt-0.5">
          첫 시도에 베타·동선 정보 등을 미리 알고 나서 완등한 경우를 말해요.
        </dd>
      </div>
      <div>
        <dt className="font-semibold text-on-surface">온사이트 (Onsight)</dt>
        <dd className="mt-0.5">
          첫 시도에 문제에 대한 사전 정보 없이 완등한 경우를 말해요.
        </dd>
      </div>
    </dl>
  </section>
);

export default RecordDetailResultGlossary;
