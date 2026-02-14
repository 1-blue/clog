# CLOG 프로젝트 컨벤션

## 핵심 워크플로우: 이미지 → 페이지 자동 생성

사용자가 디자인 이미지(스크린샷, 피그마 등)를 제공하면 아래 프로세스를 **자동으로** 실행한다.
특정 스킬을 언급하지 않아도, 이미지를 분석하여 필요한 스킬을 **스스로 판단**하여 조합한다.

### 자동 판단 프로세스

**Step 1: 이미지 분석** — 디자인에서 다음을 파악한다:
- 페이지 유형: 리스트 / 상세 / 폼(생성·수정) / 대시보드
- 영역: 관리자(`/admin/*`) / 공개(`/`) / 인증 필요(`/record`, `/profile` 등)
- UI 요소: 테이블, 카드, 폼 필드, 필터, 검색, 페이지네이션, 통계 카드 등
- 데이터: 어떤 Supabase 테이블이 필요한지, 관계 테이블은 있는지

**Step 2: 필요한 작업 자동 결정** — 아래 매핑표에 따라 스킬을 선택한다:

| 이미지에서 발견된 요소 | 자동 실행 스킬 |
|---|---|
| 테이블 / 카드 그리드 / 목록 | `list-page` |
| 폼 필드 + 제출 버튼 | `form-page` |
| 단일 항목 상세 정보 | `detail-page` |
| 데이터를 가져오는 모든 페이지 | `query-hook` (해당 훅이 없을 때) |
| 새로운 URL 경로 | `route` (routes.ts에 없을 때) |

**Step 3: 실행 순서** — 의존성 순서대로 생성한다:
1. `route` → routes.ts에 라우트 등록
2. `query-hook` → 데이터 훅 생성
3. 페이지 스킬 (`list-page` / `form-page` / `detail-page`)

**Step 4: 검증** — 생성 후 확인한다:
- import 경로 정확한지
- 타입 오류 없는지
- 기존 코드와 일관성 있는지

### 예시

사용자: (테이블이 있는 관리자 페이지 스크린샷 첨부) "이 페이지 만들어줘"

→ Claude가 자동으로:
1. 이미지에서 테이블 + 검색 + 필터 + 삭제 버튼 감지
2. routes.ts 확인 → 없으면 `route` 실행
3. query hook 확인 → 없으면 `query-hook` 실행
4. `list-page` 실행하여 페이지 생성
5. 이미지의 컬럼, 필터, 버튼에 맞게 커스터마이징

### 참조 위치
- 스킬 템플릿: `.claude/skills/`
- 에이전트 워크플로우: `.claude/agents/`
- **DB 스키마: `.claude/db-schema.md`** — 테이블 구조, 관계, Enum 전부 기록
- **코드 생성 시 반드시 해당 파일을 읽고 따른다.**

---

## DB 스키마 자동 최신화 규칙

**`.claude/db-schema.md`는 다음 상황에서 반드시 갱신한다:**

1. **테이블 생성/삭제** — Supabase MCP로 테이블을 추가/삭제했을 때
2. **컬럼 변경** — 컬럼 추가, 삭제, 타입 변경, nullable 변경
3. **Enum 변경** — 새 Enum 추가, 기존 Enum 값 추가/삭제
4. **FK 변경** — 외래키 추가/삭제
5. **타입 재생성** — `pnpm --filter @clog/db gen:types` 실행 후

**갱신 절차:**
1. DB 변경 작업 완료
2. `db-schema.md`에서 해당 테이블/Enum 섹션을 업데이트
3. "마지막 동기화" 날짜를 오늘로 변경
4. 관계도(`테이블 관계도` 섹션)도 필요 시 업데이트

**Supabase MCP 연동 정보:**
- Project Ref: `rckdkhohxaagllqghdvy`
- MCP 설정: `.claude/mcp.json`

---

## 프로젝트 개요
클라이밍 커뮤니티/정보공유/기록 플랫폼. 모노레포 구조.

## 기술 스택
- **Web**: Next.js 16 (App Router), React 19
- **Mobile**: React Native + Expo (웹뷰 기반)
- **DB**: Supabase (PostgreSQL)
- **UI**: shadcn (base-ui), Tailwind CSS v4, CVA
- **상태/패칭**: TanStack Query v5, TanStack Table v8
- **폼**: react-hook-form + zod v4 + @hookform/resolvers
- **패키지매니저**: pnpm 9, Turborepo

## 모노레포 구조
```
apps/web/          - Next.js 웹앱
apps/mobile/       - React Native 모바일앱
packages/db/       - @clog/db (Supabase 타입, 클라이언트)
packages/libs/     - @clog/libs (routes, cn 유틸)
```

## Import 규칙
```tsx
// 워크스페이스 패키지
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";
import type { Database } from "@clog/db";
import { Constants, Tables } from "@clog/db";
import { supabase } from "@clog/db/web";

// 앱 내부 (path alias)
import { Button } from "#/src/components/ui/button";
import FormHelper from "#/src/components/custom/FormHelper";
```

## 디렉토리 패턴

### 페이지 구조 (_source 패턴)
```
{feature}/
├── page.tsx                     // metadata + ErrorBoundary + Suspense
└── _source/
    ├── components/
    │   ├── {Feature}Page.tsx     // "use client" 메인 컴포넌트
    │   ├── {Feature}Skeleton.tsx // 로딩 스켈레톤
    │   └── sections/            // 폼 섹션들
    └── hooks/
        └── use{Feature}Form.ts  // Zod 스키마 + useForm
```

### page.tsx 패턴
```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import AdminFeaturePage from "./_source/components/AdminFeaturePage";
import AdminFeaturePageSkeleton from "./_source/components/AdminFeaturePageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "제목" });

const Page = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminFeaturePageSkeleton />}>
        <AdminFeaturePage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
```

## TanStack Query 패턴

### Query Keys Factory
```tsx
export const {resource}Keys = {
  all: ["{resource}s"] as const,
  list: (filters?: Record<string, string>) =>
    filters
      ? ([...{resource}Keys.all, "list", filters] as const)
      : ([...{resource}Keys.all, "list"] as const),
  details: () => [...{resource}Keys.all, "detail"] as const,
  detail: (id: string) => [...{resource}Keys.details(), id] as const,
  stats: () => [...{resource}Keys.all, "stats"] as const,
};
```

### Query Hook 패턴
- `use{Resource}s()` - useQuery 목록 조회
- `useSuspense{Resource}s()` - useSuspenseQuery 목록 조회
- `use{Resource}(id)` - useQuery 단일 조회
- `useSuspense{Resource}(id)` - useSuspenseQuery 단일 조회
- `useCreate{Resource}()` - useMutation 생성
- `useUpdate{Resource}()` - useMutation 수정
- `useDelete{Resource}()` - useMutation 삭제
- Mutation의 onSuccess에서 queryClient.invalidateQueries 호출

### Supabase 쿼리 패턴
```tsx
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .order("created_at", { ascending: false });

if (error) throw error;
return data;
```

## 컴포넌트 패턴

### 관리자 리스트 페이지 구성
1. 헤더 (뒤로가기 + 제목 + 액션 버튼)
2. 통계 카드 (선택사항, grid 4열)
3. 검색 + 필터 (clog-section)
4. 테이블 (TanStack Table + clog-section)
5. 페이지네이션

### 테이블 패턴
- `useReactTable` + `manualPagination: true`
- 클라이언트 측 필터링/정렬/페이지네이션
- URL searchParams로 필터 상태 동기화
- `updateUrl()` 헬퍼로 URL 업데이트

### 폼 패턴
- `useForm` + `zodResolver` + Zod 스키마
- `FormProvider`로 감싸기
- `FormHelper` 커스텀 컴포넌트로 필드 렌더링
- `FieldGroup > FieldSet > Field` 구조

## 스타일링 규칙
- `cn()` 함수로 조건부 클래스 조합
- `clog-section` 클래스로 섹션 스타일링
- `data-slot` 속성 사용 (shadcn 패턴)
- Tailwind v4 (OKLch 컬러)
- Badge로 상태/카테고리 표시 (variant="outline" + bg/text 색상)

## 네이밍 규칙
- 컴포넌트: PascalCase (`AdminUsersPage.tsx`)
- 훅: camelCase (`useAdminGymForm.ts`)
- Query 훅 파일: `use-{resource}.ts` (kebab-case)
- 한국어 UI 텍스트 사용
- 날짜 포맷: `format(parseISO(date), "yyyy.MM.dd", { locale: ko })`

## 라우트 정의 위치
`packages/libs/src/constants/routes/routes.ts`

## Supabase 타입
- `packages/db/src/types.ts`에서 자동 생성
- `Database["public"]["Tables"]["{table}"]["Row"]` - 조회 타입
- `Database["public"]["Tables"]["{table}"]["Insert"]` - 생성 타입
- `Database["public"]["Tables"]["{table}"]["Update"]` - 수정 타입
- `Constants.public.Enums.{enum_name}` - Enum 값 배열
- `Tables<"{table}">` - Row 타입 숏컷

## 에러 처리
- `AdminErrorBoundary` 컴포넌트로 페이지 감싸기
- Mutation 에러: try/catch + alert
- 삭제: confirm 다이얼로그로 확인

## 주의사항
- `"use client"` 는 인터랙티브 컴포넌트에만 사용
- Suspense + useSuspenseQuery 조합으로 로딩 처리
- Skeleton 컴포넌트는 실제 페이지 레이아웃과 동일한 구조
