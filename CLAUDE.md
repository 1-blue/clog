# Clog

Turborepo + pnpm 모노레포 프로젝트.

## 구조

- `apps/web` — Next.js (App Router, 포트 9001)
- `apps/mobile` — React Native Expo (WebView로 웹앱 래핑)
- `packages/database` (@clog/db) — Prisma + Supabase PostgreSQL
- `packages/utils` (@clog/utils) — Zod 스키마, 공유 유틸
- `packages/typescript-config` (@clog/typescript-config)
- `packages/eslint-config` (@clog/eslint-config)

## 주요 명령어

```bash
pnpm dev              # 전체 개발 서버 (웹: localhost:9001)
pnpm build            # 전체 빌드
pnpm lint             # 전체 린트
pnpm type-check       # 타입 체크
pnpm db:generate      # Prisma 클라이언트 생성
pnpm db:push          # DB 스키마 푸시
pnpm db:migrate       # DB 마이그레이션
pnpm db:studio        # Prisma Studio
pnpm openapi:generate # OpenAPI 타입 생성
pnpm format           # Prettier 포맷
```

## 컨벤션

### 경로 별칭

- Web: `#web/` → `./src/`

### 네임스페이스

- `@clog/` (예: @clog/db, @clog/utils)

### API

- Next.js Route Handlers: `apps/web/src/app/api/v1/`
- 응답 형식: `{ payload }` 또는 `{ toast, payload }`
- prisma는 `@clog/db`에서 import

### UI

- Shadcn/ui: `apps/web/src/components/ui/`
- cn() 유틸: `apps/web/src/libs/utils.ts`
- Shadcn/ui는 web 앱 내부에 설치 (공유 패키지 아님)

### 라우트 그룹

- `(public)` — 인증 불필요 (하단 네비게이션 있음)
- `(auth)` — 인증 필요 (하단 네비게이션 있음)

### 코드 스타일

- 한국어 주석 및 사용자 대면 콘텐츠
- Zod 스키마는 @clog/utils에서 관리
- Prisma 모델과 Zod 스키마 동기화 유지
- 모든 함수(컴포넌트 포함)는 화살표 함수 사용 (`const Foo = () => {}`)
- `export default function` 대신 `const Page = () => {}; export default Page;`

### 타입 네이밍 컨벤션

- 모든 커스텀 interface 접두사: `I` (예: `IProps`, `IGymData`)
- 모든 커스텀 type 접두사: `T` (예: `TRouteEntry`, `TApiResponse`)
- 컴포넌트 Props: `interface IProps {}` 사용
- 페이지 컴포넌트: `NextPage<IProps>` (next/types에서 import)
- 일반 컴포넌트: `React.FC<IProps>`
- children이 있는 컴포넌트: `React.FC<React.PropsWithChildren<IProps>>`
- Props가 없는 컴포넌트는 타입 어노테이션 생략 가능

### 페이지 컴포넌트 구조

- 페이지별 로컬 리소스: `_source/` 디렉토리 (page.tsx와 같은 레벨)
  - `_source/components/` — 해당 페이지 전용 컴포넌트
  - `_source/hooks/` — 해당 페이지 전용 훅
  - `_source/utils/` — 해당 페이지 전용 유틸
- 2개 이상 페이지에서 공유하는 컴포넌트 → `components/` 디렉토리
- 같은 그룹의 컴포넌트가 2개 이상이면 → 케밥케이스 폴더로 그룹핑
- 폴더명: 케밥케이스 (`gym-info/`, `review-list/`)
- 컴포넌트명: 파스칼케이스 (`GymInfoSection.tsx`)
- 섹션 컴포넌트 접미사: `~Section.tsx` (예: `CongestionRankingSection.tsx`)

### 서버/클라이언트 컴포넌트 분리

- page.tsx는 가능한 서버 컴포넌트로 유지
- openapi.useSuspenseQuery() 사용하는 부분 → 별도 클라이언트 컴포넌트로 분리 + `"use client"`
- 상위에서 `<Suspense fallback={<~Skeleton />}>`으로 감싸기
- 폼/인터랙션이 많은 페이지는 전체가 클라이언트 컴포넌트여도 OK

### OpenAPI 패턴

- openapi-fetch + openapi-react-query 사용
- 클라이언트: `apps/web/src/apis/openapi/index.ts`
- 타입: `apps/web/src/@types/openapi.ts` (자동 생성)
- mutation hook 위치: `apps/web/src/hooks/mutations/`

### 페이지 패턴

- Server: 서버 컴포넌트 (page.tsx) + Suspense 바운더리
- Client: `"use client"` + openapi.useSuspenseQuery (섹션 컴포넌트)
- Loading: Skeleton 컴포넌트 (`#web/components/ui/skeleton`)
- params는 Promise<T> 타입 (Next.js 15+)

### 반응형

- 모바일 퍼스트 (기본)
- 768px 이상: 가운데 정렬 (max-w-3xl mx-auto)

### 모바일

- 대부분 WebView로 웹앱 래핑
- 네이티브 UI는 최소한만 구현
- 웹앱 URL: EXPO_PUBLIC_WEB_URL 환경변수
