import { z } from "zod";

// ============================================
// 공용 Zod 필드 스키마
// ============================================

/** 이메일 유효성 검사 스키마 */
const email = z
  .string()
  .min(1, { message: "이메일을 입력해주세요!" })
  .email({ message: "이메일 형식에 맞게 입력해주세요!" });

/** 비밀번호 유효성 검사 스키마 */
const password = z
  .string()
  .min(1, { message: "비밀번호를 입력해주세요!" })
  .regex(/^(?=.*[A-Z])/, "최소 하나의 대문자가 필요합니다.")
  .regex(/^(?=.*[a-z])/, "최소 하나의 소문자가 필요합니다.")
  .regex(/^(?=.*\d)/, "최소 하나의 숫자가 필요합니다.")
  .regex(/^(?=.*[\W_])/, "최소 하나의 특수문자가 필요합니다.")
  .min(8, { message: "8자 이상 입력해주세요!" });

/** 닉네임 유효성 검사 스키마 (1~20자) */
const nickname = z
  .string()
  .min(1, { message: "닉네임을 입력해주세요!" })
  .max(20, { message: "20자 이내로 입력해주세요!" });

/** 전화번호 유효성 검사 스키마 */
const phone = z
  .string()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, {
    message: "올바른 전화번호 형식이 아닙니다.",
  });

/** UUID 스키마 */
const uuid = z.string().uuid();

/** 커서 기반 페이지네이션 공통 스키마 */
const cursor = z.string().uuid().optional();

/** 페이지 사이즈 (기본 20, 최대 50) */
const limit = z.coerce.number().int().min(1).max(50).optional().default(20);

/** URL 스키마 */
const url = z.string().url({ message: "올바른 URL 형식이 아닙니다." });

/** 이미지 URL 배열 스키마 */
const imageUrls = z.array(z.string().url()).optional();

export const schemas = {
  email,
  password,
  nickname,
  phone,
  uuid,
  cursor,
  limit,
  url,
  imageUrls,
} as const;
