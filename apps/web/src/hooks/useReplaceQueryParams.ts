import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TReplaceQueryValue = string | null | undefined;

interface IOptions {
  /** true면 value.trim() 후 적용합니다 */
  trim?: boolean;
  /** 기본 false: replace 시 스크롤 유지 */
  scroll?: boolean;
}

/**
 * query-string을 "현재 값 + 부분 업데이트" 형태로 관리하기 위한 훅.
 * - value가 null/""/undefined 이면 해당 key를 삭제합니다.
 * - trim 옵션으로 공백 입력을 정리할 수 있습니다.
 */
const useReplaceQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replaceQueryParams = useCallback(
    (next: Record<string, TReplaceQueryValue>, options?: IOptions) => {
      const params = new URLSearchParams(searchParams.toString());
      const trim = options?.trim ?? false;

      for (const [key, raw] of Object.entries(next)) {
        const v = typeof raw === "string" && trim ? raw.trim() : raw;

        if (v == null || v === "") params.delete(key);
        else params.set(key, String(v));
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, {
        scroll: options?.scroll ?? false,
      });
    },
    [pathname, router, searchParams],
  );

  return { replaceQueryParams };
};

export default useReplaceQueryParams;
