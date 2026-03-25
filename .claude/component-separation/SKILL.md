---
name: component-separation
description: Next.js 페이지 컴포넌트를 분리하고 구조화하는 스킬. page.tsx가 비대해졌을 때, 서버/클라이언트 컴포넌트를 분리할 때, _source/ 디렉토리 구조로 정리할 때 사용한다. "컴포넌트 분리해줘", "페이지 리팩토링", "서버/클라이언트 분리", "_source 구조로 정리", "Suspense 바운더리 추가" 같은 요청에 사용.
---

# 컴포넌트 분리 스킬

Next.js App Router 페이지를 체계적으로 분리·구조화하는 스킬이다.

## 핵심 원칙

1. **page.tsx는 가능한 서버 컴포넌트로 유지**
2. **데이터 페칭이 있는 영역은 클라이언트 컴포넌트로 분리**
3. **Suspense 바운더리로 각 영역을 독립적으로 로딩**
4. **모든 함수는 화살표 함수 사용**

## 디렉토리 구조

```
some-page/
├── page.tsx                          # 서버 컴포넌트 (조합만 담당)
└── _source/
    ├── components/
    │   ├── SomeSection.tsx           # 단독 섹션 컴포넌트
    │   ├── some-group/              # 2개 이상 관련 컴포넌트 → 케밥케이스 폴더
    │   │   ├── FooCard.tsx
    │   │   └── FooList.tsx
    │   └── skeleton/                # 스켈레톤 컴포넌트 그룹
    │       ├── SomeSectionSkeleton.tsx
    │       └── AnotherSkeleton.tsx
    ├── hooks/                       # 페이지 전용 훅
    │   └── useSomeLogic.ts
    └── utils/                       # 페이지 전용 유틸
        └── formatSomething.ts
```

## 네이밍 규칙

| 대상          | 규칙                            | 예시                               |
| ------------- | ------------------------------- | ---------------------------------- |
| 섹션 컴포넌트 | 파스칼케이스 + `Section` 접미사 | `CongestionRankingSection.tsx`     |
| 스켈레톤      | 원본명 + `Skeleton` 접미사      | `CongestionRankingSkeleton.tsx`    |
| 폴더          | 케밥케이스                      | `congestion-ranking/`, `skeleton/` |
| 컴포넌트 파일 | 파스칼케이스                    | `GymCard.tsx`                      |

## 분리 판단 기준

### 반드시 분리하는 경우

- `openapi.useQuery()` 또는 `openapi.useSuspenseQuery()` 호출이 있는 영역
- `useInfiniteQuery()` 호출이 있는 영역
- `useState`, `useEffect` 등 클라이언트 훅이 필요한 영역
- 하나의 page.tsx에 서로 독립적인 데이터를 3개 이상 패칭하는 경우

### 분리하지 않는 경우

- 폼 페이지처럼 전체가 하나의 클라이언트 인터랙션인 경우 → 전체 `"use client"`
- props 드릴링이 과도해지는 경우 → 분리하지 않는 게 나음

## 서버/클라이언트 분리 패턴

### Before (비대한 클라이언트 page.tsx)

```tsx
"use client";

const HomePage = () => {
  const { data: gyms } = openapi.useQuery("get", "/api/v1/gyms", ...);
  const { data: posts } = openapi.useQuery("get", "/api/v1/posts", ...);

  return (
    <div>
      {/* 200줄짜리 암장 섹션 JSX */}
      {/* 200줄짜리 게시글 섹션 JSX */}
    </div>
  );
};
export default HomePage;
```

### After (서버 page.tsx + 클라이언트 섹션들)

**page.tsx** (서버 컴포넌트)

```tsx
import { Suspense } from "react";

import CommunityPreviewSection from "./_source/components/CommunityPreviewSection";
import CongestionRankingSection from "./_source/components/CongestionRankingSection";
import CommunityPreviewSkeleton from "./_source/components/skeleton/CommunityPreviewSkeleton";
import CongestionRankingSkeleton from "./_source/components/skeleton/CongestionRankingSkeleton";

const HomePage = () => {
  return (
    <div>
      <Suspense fallback={<CongestionRankingSkeleton />}>
        <CongestionRankingSection />
      </Suspense>
      <Suspense fallback={<CommunityPreviewSkeleton />}>
        <CommunityPreviewSection />
      </Suspense>
    </div>
  );
};
export default HomePage;
```

**\_source/components/CongestionRankingSection.tsx** (클라이언트)

```tsx
"use client";

import { openapi } from "#web/apis/openapi";

const CongestionRankingSection = () => {
  const { data } = openapi.useSuspenseQuery("get", "/api/v1/gyms", ...);
  // ...
};
export default CongestionRankingSection;
```

**\_source/components/skeleton/CongestionRankingSkeleton.tsx**

```tsx
const CongestionRankingSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl bg-surface-container-low"
        />
      ))}
    </div>
  );
};
export default CongestionRankingSkeleton;
```

## useQuery → useSuspenseQuery 변환

`openapi.useQuery()`를 분리할 때는 `openapi.useSuspenseQuery()`로 교체한다:

```tsx
// Before (useQuery → 로딩 상태 직접 처리)
const { data, isLoading } = openapi.useQuery("get", "/api/v1/gyms", ...);
if (isLoading) return <Skeleton />;

// After (useSuspenseQuery → Suspense 바운더리가 로딩 처리)
const { data } = openapi.useSuspenseQuery("get", "/api/v1/gyms", ...);
// data는 항상 존재 (undefined 아님)
```

## useInfiniteQuery는 그대로 유지

`useInfiniteQuery`는 자체적으로 `isLoading` 상태를 관리하므로 컴포넌트 내에서 직접 처리한다.
Suspense 바운더리 대신 컴포넌트 내 스켈레톤으로 처리:

```tsx
"use client";

const GymListSection = () => {
  const { data, isLoading, ... } = useInfiniteQuery({ ... });

  if (isLoading) return <GymListSkeleton />;

  return ( ... );
};
```

## 폼 페이지 예외

기록 추가, 리뷰 작성, 게시글 작성 등 폼 페이지는 전체가 하나의 인터랙션이므로
page.tsx 자체가 `"use client"`여도 된다. 단, 폼 로직이 복잡하면 `_source/`로 분리:

```
records/new/
├── page.tsx                    # "use client" — 폼 래퍼
└── _source/
    ├── components/
    │   ├── RouteSelector.tsx   # 루트 선택 UI
    │   └── GymPicker.tsx       # 암장 선택 UI
    └── hooks/
        └── useRecordForm.ts    # 폼 상태 관리
```

## 타입 컨벤션

### Props 타입

```tsx
// 일반 컴포넌트 (props 있음)
interface IProps {
  gymId: string;
  showRating?: boolean;
}
const GymInfoSection: React.FC<IProps> = ({ gymId, showRating = false }) => {
  // ...
};
export default GymInfoSection;

// children이 있는 컴포넌트
interface IProps {
  onLoadMore: () => void;
  hasMore: boolean;
}
const InfiniteScroll: React.FC<React.PropsWithChildren<IProps>> = ({ onLoadMore, hasMore, children }) => {
  // ...
};
export default InfiniteScroll;

// 페이지 컴포넌트 (params가 있는 경우)
import type { NextPage } from "next";

interface IProps {
  params: Promise<{ gymId: string }>;
}
const GymDetailPage: NextPage<IProps> = async (props) => {
  const { gymId } = await props.params;
  // ...
};
export default GymDetailPage;

// props 없는 컴포넌트 → 타입 어노테이션 생략
const HomePage = () => {
  return <div>...</div>;
};
export default HomePage;
```

### 네이밍 규칙

- 모든 커스텀 interface: `I` 접두사 (`IProps`, `IRouteEntry`, `IAuthor`)
- 모든 커스텀 type: `T` 접두사 (`TRouteEntry`, `TApiResponse`)
- 컴포넌트 Props는 항상 `interface IProps {}`로 통일

## 체크리스트

- [ ] page.tsx에서 `"use client"` 제거 가능한지 확인
- [ ] 각 데이터 페칭 영역을 독립 컴포넌트로 분리
- [ ] `useQuery` → `useSuspenseQuery` 변환
- [ ] `<Suspense fallback={<Skeleton />}>` 래핑
- [ ] 스켈레톤 컴포넌트 생성 (skeleton/ 폴더)
- [ ] 관련 컴포넌트 2개 이상이면 케밥케이스 폴더로 그룹핑
- [ ] 모든 함수를 화살표 함수로 작성
- [ ] `export default` 패턴: `const Foo = () => {}; export default Foo;`
- [ ] Props는 `interface IProps {}`로 선언
- [ ] 컴포넌트 타입: `React.FC<IProps>` / `NextPage<IProps>` / `React.FC<React.PropsWithChildren<IProps>>`
- [ ] 커스텀 interface는 `I` 접두사, type은 `T` 접두사
