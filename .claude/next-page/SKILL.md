---
name: next-page
description: Next.js App Router 페이지 스캐폴딩 생성기. page.tsx, loading.tsx, _components/ 폴더를 프로젝트 패턴(React.cache, HydrationBoundary, generateMetadata)에 맞게 자동 생성한다. "페이지 만들어줘", "라우트 추가", "Next.js 페이지 생성", "프론트엔드 화면 추가해줘", "새 페이지 스캐폴딩" 같은 요청에 사용.
---

# Next.js App Router 페이지 스캐폴딩

clog 프로젝트의 Next.js App Router에 새 페이지를 생성하는 스킬이다.

## 사용자 입력 확인

1. **라우트 경로** (예: `/posts`, `/posts/[postId]`)
2. **라우트 그룹** - `(Nav)` (하단 네비게이션 있음), `(NoNav)` (네비게이션 없음). 기본값: `(Nav)`
3. **API 엔드포인트** - openapi 경로 (예: `"/api/v1/posts"`)
4. **동적 라우트 여부** - `[param]` 세그먼트가 있는지
5. **페이지 제목** (한국어, 예: "게시글 목록")

## 생성 파일 구조

```
apps/web/src/app/{routeGroup}/{routePath}/
├── page.tsx
├── loading.tsx
└── _components/
    └── Main.tsx
```

## 템플릿

### page.tsx — 정적 라우트 (목록 페이지)

```typescript
import { cache } from "react";
import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";
import Main from "#web/app/{routeGroup}/{routePath}/_components/Main";

export const revalidate = 0;

const queryClient = getQueryClient();
const getAll{PascalResource} = cache(() => {
  return queryClient.fetchQuery(
    openapi.queryOptions("get", "{apiEndpoint}", {
      next: {
        tags: ["{apiEndpoint}"],
      },
    }),
  );
});

export const generateMetadata = async (): Promise<Metadata> => {
  await getAll{PascalResource}();

  return getSharedMetadata({
    title: "{페이지 제목}",
    keywords: [],
  });
};

const Page: React.FC = () => {
  getAll{PascalResource}();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Main />
    </HydrationBoundary>
  );
};

export default Page;
```

### page.tsx — 동적 라우트 (상세 페이지)

```typescript
import type { Metadata, NextPage } from "next";
import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { getQueryClient } from "#web/libs/getQueryClient";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import Main from "#web/app/{routeGroup}/{routePath}/[{param}]/_components/Main";

export const revalidate = 1800;
export const dynamicParams = true;
export const generateStaticParams = async () => [];

interface IProps {
  params: Promise<{ {param}: string }>;
}

const queryClient = getQueryClient();
const getOneBy{PascalParam} = cache(({param}: string) => {
  return queryClient.fetchQuery(
    openapi.queryOptions("get", "{apiEndpoint}/{{param}}", {
      params: { path: { {param} } },
    }),
  );
});

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const { {param} } = await params;
  const { payload } = await getOneBy{PascalParam}({param});

  return getSharedMetadata({
    title: payload.title,
    description: payload.summary || "",
    keywords: [payload.title],
  });
};

const Page: NextPage<IProps> = async ({ params }) => {
  const { {param} } = await params;
  await getOneBy{PascalParam}({param});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Main {param}={{param}} />
    </HydrationBoundary>
  );
};

export default Page;
```

**핵심 패턴:**

- `params`는 항상 `Promise<T>` 타입 → `await params`
- `queryClient`는 모듈 레벨에서 `getQueryClient()`로 생성
- `cache()`로 같은 요청 중복 방지 (generateMetadata + Page에서 공유)
- 정적 페이지: `revalidate = 0` (항상 동적)
- 상세 페이지: `revalidate = 1800` (30분 ISR), `dynamicParams = true`, `generateStaticParams = []`

### loading.tsx

```typescript
import { Skeleton } from "#web/components/ui/skeleton";

const Loading: React.FC = () => {
  return (
    <article>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-full w-full rounded-lg" />
        ))}
      </ul>
    </article>
  );
};

export default Loading;
```

Skeleton 레이아웃은 실제 페이지 구조에 맞게 조정한다. 목록은 그리드, 상세는 단일 카드 형태 등.

### \_components/Main.tsx

```typescript
"use client";

import { openapi } from "#web/apis/openapi";

// 목록 페이지
const Main: React.FC = () => {
  const { data } = openapi.useSuspenseQuery("get", "{apiEndpoint}");

  return (
    <article>
      {/* 컴포넌트 내용 */}
    </article>
  );
};

export default Main;
```

상세 페이지의 경우 props로 param을 받는다:

```typescript
"use client";

import { openapi } from "#web/apis/openapi";

interface IProps {
  {param}: string;
}

const Main: React.FC<IProps> = ({ {param} }) => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "{apiEndpoint}/{{param}}",
    { params: { path: { {param} } } },
  );

  return (
    <article>
      {/* 컴포넌트 내용 */}
    </article>
  );
};

export default Main;
```

**핵심:**

- `"use client"` 필수
- `openapi.useSuspenseQuery()`로 서버에서 prefetch된 데이터를 클라이언트에서 사용
- page.tsx의 HydrationBoundary가 서버 데이터를 클라이언트로 전달

### page.tsx — 단순 페이지 (데이터 없음)

로그인, 회원가입처럼 API 호출 없는 단순 페이지:

```typescript
import type { Metadata, NextPage } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";
import Main from "#web/app/{routeGroup}/{routePath}/_components/Main";

export const generateMetadata = (): Metadata => {
  return getSharedMetadata({
    title: "{페이지 제목}",
    description: "{설명}",
  });
};

const Page: NextPage = () => {
  return <Main />;
};

export default Page;
```

## import 경로 규칙

| 모듈              | 경로                                                   |
| ----------------- | ------------------------------------------------------ |
| openapi           | `#web/apis/openapi`                                    |
| getQueryClient    | `#web/libs/getQueryClient`                             |
| getSharedMetadata | `#web/libs/sharedMetadata`                             |
| routes            | `#web/constants`                                       |
| Shadcn 컴포넌트   | `#web/components/ui/{component}`                       |
| Zod 스키마        | `@clog/utils`                                          |
| \_components      | `#web/app/{routeGroup}/{routePath}/_components/{Name}` |

## 체크리스트

- [ ] page.tsx에 `revalidate` export 있음
- [ ] 동적 라우트면 `dynamicParams`, `generateStaticParams` export 있음
- [ ] `generateMetadata`가 `getSharedMetadata` 사용
- [ ] `params`가 `Promise<T>` 타입으로 선언
- [ ] \_components/Main.tsx에 `"use client"` 선언
- [ ] loading.tsx에 Skeleton 사용
- [ ] cache 함수로 데이터 페칭 래핑
- [ ] HydrationBoundary + dehydrate(queryClient) 패턴 적용
