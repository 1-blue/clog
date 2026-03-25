---
name: form-enum
description: 폼 유효성 검사 스키마와 Enum 한글 맵핑 생성기. Zod 기반의 폼 스키마를 공용 validators로 조합하여 생성하고, Prisma enum에 대한 한글 맵핑 파일을 @clog/utils에 추가한다. "폼 스키마 만들어줘", "Zod 유효성 검사 추가", "enum 한글 맵핑 만들어줘", "새 enum 추가", "validation schema 생성", "폼 검증 로직 추가" 같은 요청에 사용. enum 관련 변경이나 폼 유효성 검사 패턴이 필요한 경우 반드시 이 스킬을 사용할 것.
---

# 폼 유효성 검사 스키마 & Enum 한글 맵핑 생성

clog 프로젝트의 Zod 폼 스키마와 Prisma enum 한글 맵핑을 생성하는 스킬이다.

## 아키텍처 개요

```
packages/utils/src/
  schemas/
    shared.ts         → 공용 Zod 필드 스키마 (schemas.email, schemas.password 등)
    enums.ts          → Zod enum 정의 + TypeScript 타입 export
    {domain}.schema.ts → 도메인별 유효성 검사 스키마 (create/update/query)
    index.ts          → 모든 스키마 re-export
  mappings/
    {enum-name}.ts    → 개별 enum → 한글 맵핑
    index.ts          → 모든 맵핑 re-export
  index.ts            → schemas + mappings + utilities 통합 export

packages/database/prisma/schema.prisma → Prisma enum 정의 (source of truth)
```

### 의존성 방향
```
@clog/db → @clog/utils (의존)
```
- `@clog/utils`는 `@clog/db`에 의존하지 않음 (순환 의존 방지)
- enum 값 목록은 `@clog/utils/schemas/enums.ts`에 Zod enum으로 정의
- Prisma schema와 Zod enum의 값은 반드시 동기화 유지

## 1. 새 Enum 추가 절차

### Step 1: Prisma schema에 enum 추가

```prisma
// packages/database/prisma/schema.prisma
enum MyNewEnum {
  VALUE_A
  VALUE_B
  VALUE_C
}
```

### Step 2: Zod enum 정의 추가

```ts
// packages/utils/src/schemas/enums.ts
export const myNewEnumEnum = z.enum(["VALUE_A", "VALUE_B", "VALUE_C"]);
export type MyNewEnum = z.infer<typeof myNewEnumEnum>;
```

**규칙:**
- Zod enum 변수명: `{camelCase}Enum` (예: `perceivedDifficultyEnum`)
- 타입명: PascalCase (예: `PerceivedDifficulty`)
- Prisma enum과 값 목록 완전히 일치시킬 것

### Step 3: 한글 맵핑 파일 생성

```ts
// packages/utils/src/mappings/{kebab-case}.ts
import type { MyNewEnum } from "../schemas/enums";

/** {설명}을 한글로 맵핑 */
export const myNewEnumToKoreanMap: Record<MyNewEnum, string> = {
  VALUE_A: "값 A",
  VALUE_B: "값 B",
  VALUE_C: "값 C",
};
```

**맵핑 파일 네이밍 규칙:**
- 파일명: 케밥케이스 (예: `perceived-difficulty.ts`)
- 변수명: `{camelCase}ToKoreanMap` (예: `perceivedDifficultyToKoreanMap`)
- 타입: `Record<EnumType, string>`

### Step 4: mappings/index.ts에 export 추가

```ts
// packages/utils/src/mappings/index.ts
export { myNewEnumToKoreanMap } from "./my-new-enum";
```

### Step 5: Prisma 클라이언트 재생성

```bash
pnpm db:generate
```

## 2. 폼 유효성 검사 스키마 생성

### 공용 validators 사용

`schemas/shared.ts`에 정의된 공용 validators를 조합하여 사용한다:

```ts
import { schemas } from "./shared";

// 사용 가능한 공용 validators:
schemas.email      // z.string().min(1).email()
schemas.password   // z.string().min(8) + 대/소문자/숫자/특수문자
schemas.nickname   // z.string().min(1).max(20)
schemas.phone      // z.string().regex(한국 전화번호)
schemas.uuid       // z.string().uuid()
schemas.cursor     // z.string().uuid().optional()
schemas.limit      // z.coerce.number().int().min(1).max(50).default(20)
schemas.url        // z.string().url()
schemas.imageUrls  // z.array(z.string().url()).optional()
```

### 도메인 스키마 작성 패턴

```ts
// packages/utils/src/schemas/{domain}.schema.ts
import { z } from "zod";

import { myEnumEnum } from "./enums";
import { schemas } from "./shared";

/** 생성 스키마 */
export const createMyDomainSchema = z.object({
  email: schemas.email,
  nickname: schemas.nickname,
  category: myEnumEnum,
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  imageUrls: schemas.imageUrls,
});

/** 수정 스키마 */
export const updateMyDomainSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  content: z.string().min(10).max(5000).optional(),
});

/** 목록 조회 쿼리 스키마 */
export const myDomainQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  category: myEnumEnum.optional(),
  search: z.string().optional(),
});
```

**스키마 파일 규칙:**
- 파일명: `{domain}.schema.ts` (예: `review.schema.ts`)
- "읽기" 스키마 불필요 — Prisma 타입 사용
- 생성/수정/쿼리 스키마만 정의
- schemas/index.ts에 `export * from "./{domain}.schema"` 추가

### 컴포넌트에서 사용

```tsx
// apps/web/src/app/api/v1/{domain}/route.ts (API 라우트에서 검증)
import { createMyDomainSchema } from "@clog/utils";

export const POST = async (request: Request) => {
  const body = createMyDomainSchema.parse(await request.json());
  // ...
};
```

## 3. 컴포넌트에서 enum 맵핑 사용

```tsx
// 한글 라벨 표시
import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

const label = categoryToKoreanMap[category]; // "자유", "팁", ...

// enum 순회 (셀렉트, 칩 등)
Object.entries(categoryToKoreanMap).map(([key, label]) => (
  <Chip key={key} selected={selected === key}>
    {label}
  </Chip>
));
```

## 4. 공용 validator 추가 절차

새 공용 필드가 필요한 경우:

```ts
// packages/utils/src/schemas/shared.ts
const myField = z
  .string()
  .min(1, { message: "에러 메시지" })
  .max(100, { message: "에러 메시지" });

export const schemas = {
  // ... 기존 필드들
  myField,
} as const;
```

**규칙:**
- 2개 이상 도메인 스키마에서 반복되는 필드만 공용으로 추출
- 에러 메시지는 한국어
- `schemas` 객체에 추가 후 `as const` 유지

## 현재 등록된 enum 목록

| Prisma Enum | Zod Enum | 한글 맵핑 |
|---|---|---|
| Provider | providerEnum | - |
| Role | roleEnum | - |
| Region | regionEnum | regionToKoreanMap |
| Difficulty | difficultyEnum | difficultyToKoreanMap |
| CommunityCategory | communityCategoryEnum | categoryToKoreanMap |
| NotificationType | notificationTypeEnum | - |
| FacilityType | facilityTypeEnum | facilityTypeToKoreanMap |
| AttemptResult | attemptResultEnum | attemptResultToKoreanMap |
| PerceivedDifficulty | perceivedDifficultyEnum | perceivedDifficultyToKoreanMap |
| GymReviewFeature | gymReviewFeatureEnum | gymReviewFeatureToKoreanMap |

## 체크리스트

새 enum 추가 시:
- [ ] Prisma schema에 enum 추가
- [ ] `schemas/enums.ts`에 Zod enum + type 추가
- [ ] `mappings/{name}.ts`에 한글 맵핑 추가
- [ ] `mappings/index.ts`에 export 추가
- [ ] `pnpm db:generate` 실행
- [ ] Prisma enum과 Zod enum 값 동기화 확인

새 폼 스키마 추가 시:
- [ ] `schemas/{domain}.schema.ts` 생성
- [ ] `schemas/shared.ts`의 공용 validators 활용
- [ ] `schemas/index.ts`에 export 추가
- [ ] API 라우트에서 `.parse()` 사용
