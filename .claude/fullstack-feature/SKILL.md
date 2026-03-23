---
name: fullstack-feature
description: 풀스택 기능 통합 스캐폴딩. 백엔드(Next.js Route Handler) + 프론트엔드(Next.js 페이지 + mutation hook)를 한번에 생성한다. "새 기능 추가해줘", "풀스택으로 CRUD 만들어줘", "API부터 화면까지 만들어줘", "백엔드 프론트엔드 모두 생성", "기능 전체 스캐폴딩" 같은 요청에 사용.
---

# 풀스택 기능 통합 스캐폴딩

clog 프로젝트에 백엔드 + 프론트엔드를 한번에 생성하는 통합 스킬이다.
`/next-page`, `/mutation-hook` 스킬의 패턴을 순서대로 조합한다.

## 사용자 입력 확인

1. **리소스명** (영어 복수형, 예: `posts`, `tags`)
2. **한국어 리소스명** (예: "게시글", "태그")
3. **Prisma 모델명** (예: `Post`, `Tag`)
4. **중첩 여부** - 부모 리소스가 있는지
5. **라우트 그룹** - `(Nav)`, `(NoNav)` 중 선택
6. **프론트엔드 라우트 경로** (예: `/posts`, `/posts/[postId]`)
7. **CRUD 범위** - 필요한 엔드포인트 목록
8. **목록+상세 둘 다 필요한지** 또는 한쪽만 필요한지

## 실행 순서

### Phase 1: 백엔드 Route Handler 생성

Next.js Route Handlers로 API 엔드포인트를 생성한다.

**생성 파일:**
```
apps/web/src/app/api/v1/{resource}/
├── route.ts                    # GET(목록), POST(생성)
└── [{resourceId}]/
    └── route.ts                # GET(상세), PATCH(수정), DELETE(삭제)
```

**route.ts 템플릿 (목록 + 생성):**

실제 프로젝트의 Route Handler 패턴을 따른다:

```typescript
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@clog/db";

// 모든 {한국어명} 조회
export async function GET() {
  const items = await prisma.{prismaModel}.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ payload: items });
}

// {한국어명} 생성
export async function POST(request: NextRequest) {
  const body = await request.json();

  const item = await prisma.{prismaModel}.create({
    data: body,
  });

  return NextResponse.json(
    {
      toast: {
        title: "{한국어명} 생성 완료",
        description: "{한국어명}을(를) 생성했습니다.",
      },
      payload: item,
    },
    { status: 201 },
  );
}
```

**[{resourceId}]/route.ts 템플릿 (상세 + 수정 + 삭제):**

```typescript
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@clog/db";

interface IParams {
  params: Promise<{ {resourceId}: string }>;
}

// 특정 {한국어명} 조회
export async function GET(_request: NextRequest, { params }: IParams) {
  const { {resourceId} } = await params;

  const item = await prisma.{prismaModel}.findUnique({
    where: { id: {resourceId} },
  });

  if (!item) {
    return NextResponse.json(
      { message: "찾는 {한국어명}이(가) 존재하지 않습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ payload: item });
}

// {한국어명} 수정
export async function PATCH(request: NextRequest, { params }: IParams) {
  const { {resourceId} } = await params;
  const body = await request.json();

  const item = await prisma.{prismaModel}.update({
    where: { id: {resourceId} },
    data: body,
  });

  return NextResponse.json({
    toast: {
      title: "{한국어명} 수정 완료",
      description: "{한국어명}을(를) 수정했습니다.",
    },
    payload: item,
  });
}

// {한국어명} 삭제
export async function DELETE(_request: NextRequest, { params }: IParams) {
  const { {resourceId} } = await params;

  const item = await prisma.{prismaModel}.delete({
    where: { id: {resourceId} },
  });

  return NextResponse.json({
    toast: {
      title: "{한국어명} 삭제 완료",
      description: "{한국어명}을(를) 삭제했습니다.",
    },
    payload: item,
  });
}
```

**핵심 패턴:**
- `prisma`는 `@clog/db`에서 import
- `params`는 `Promise<T>` 타입 → `await params`
- 응답 구조: `{ payload }` 또는 `{ toast, payload }`
- 404 에러는 한국어 메시지

### Phase 2: OpenAPI 타입 생성 안내

백엔드 Route Handler 완성 후 사용자에게 안내:

```
프론트엔드 타입을 생성하기 위해 다음 단계를 진행합니다:
1. 개발 서버 실행: pnpm dev
2. OpenAPI 타입 생성: pnpm openapi:generate
3. 생성된 타입 확인: apps/web/src/@types/openapi.ts
```

### Phase 3: 프론트엔드 페이지 생성

`/next-page` 스킬의 패턴을 따라 생성한다.

**목록 + 상세 모두 필요한 경우:**
```
apps/web/src/app/{routeGroup}/{resource}/
├── (list)/
│   ├── page.tsx              # revalidate=0, cache, HydrationBoundary
│   ├── loading.tsx           # Skeleton 그리드
│   └── _components/
│       └── Main.tsx          # "use client", useSuspenseQuery
└── [{param}]/
    ├── page.tsx              # revalidate=1800, dynamicParams, generateStaticParams
    ├── loading.tsx           # Skeleton 단일
    └── _components/
        └── Main.tsx          # "use client", useSuspenseQuery with params
```

**참조:** `/next-page` 스킬의 템플릿을 따른다.

### Phase 4: Mutation Hook 생성

`/mutation-hook` 스킬의 패턴을 따라 생성한다.

**생성 파일:**
```
apps/web/src/hooks/mutations/{feature}/use{Feature}Mutations.tsx
```

**참조:** `/mutation-hook` 스킬의 기본/중첩 패턴을 따른다.

### Phase 5: 라우트 상수 등록 (필요시)

`apps/web/src/constants/index.ts` 내 라우트 설정에 새 라우트를 추가한다.

## 전체 생성 파일 목록 (예시: posts)

```
# 백엔드 Route Handlers
apps/web/src/app/api/v1/posts/route.ts
apps/web/src/app/api/v1/posts/[postId]/route.ts

# 프론트엔드
apps/web/src/app/(Nav)/posts/(list)/page.tsx
apps/web/src/app/(Nav)/posts/(list)/loading.tsx
apps/web/src/app/(Nav)/posts/(list)/_components/Main.tsx
apps/web/src/app/(Nav)/posts/[postId]/page.tsx
apps/web/src/app/(Nav)/posts/[postId]/loading.tsx
apps/web/src/app/(Nav)/posts/[postId]/_components/Main.tsx
apps/web/src/hooks/mutations/posts/usePostMutations.tsx

# 수정 파일 (필요시)
apps/web/src/constants/index.ts                          (라우트 추가)
```

## 핵심 패턴 요약

| 레이어 | 패턴 | 위치 |
|--------|------|------|
| BE Route (목록) | `GET` → `{ payload }`, `POST` → `{ toast, payload }` | `api/v1/{resource}/route.ts` |
| BE Route (상세) | `GET/PATCH/DELETE`, `params: Promise<T>` | `api/v1/{resource}/[id]/route.ts` |
| FE Page (목록) | `revalidate=0`, `cache()`, `HydrationBoundary` | `(Nav)/{resource}/(list)/page.tsx` |
| FE Page (상세) | `revalidate=1800`, `dynamicParams`, `generateStaticParams` | `(Nav)/{resource}/[param]/page.tsx` |
| FE Main | `"use client"`, `openapi.useSuspenseQuery()` | `_components/Main.tsx` |
| FE Mutation | `openapi.useMutation()`, `invalidateQueries`, `revalidateTagForServer` | `hooks/mutations/` |

## 완료 후 체크리스트

### 백엔드
- [ ] Route Handler 파일 생성 (route.ts, [id]/route.ts)
- [ ] prisma import가 `@clog/db`에서 됨
- [ ] 한국어 에러 메시지 및 토스트 메시지 사용
- [ ] 응답 구조가 `{ toast, payload }` 또는 `{ payload }` 형태

### OpenAPI 연동
- [ ] `pnpm openapi:generate` 실행 안내
- [ ] 생성된 타입에 새 엔드포인트 포함 확인 안내

### 프론트엔드
- [ ] page.tsx에 cache + HydrationBoundary 패턴 적용
- [ ] loading.tsx에 Skeleton 사용
- [ ] _components/Main.tsx에 `"use client"` 선언
- [ ] `params: Promise<T>` 타입 사용
- [ ] mutation hook 생성 (기본/중첩 패턴 선택)
- [ ] routes 상수 등록 (필요시)

### 통합
- [ ] API 경로가 BE Route Handler와 FE openapi 호출에서 일치
