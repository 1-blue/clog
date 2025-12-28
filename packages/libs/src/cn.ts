import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 병합 유틸리티 함수
 *
 * clsx와 tailwind-merge를 결합하여 조건부 클래스와 충돌하는 Tailwind 클래스를 자동으로 병합합니다.
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (px-2가 px-4로 덮어씌워짐)
 * cn('bg-red-500', isActive && 'bg-blue-500') // 조건부 클래스
 * cn('text-sm', className) // 외부에서 전달받은 className과 병합
 * ```
 */
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export default cn;
