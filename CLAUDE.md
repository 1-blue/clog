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
- `(Nav)` — 하단 네비게이션 있음
- `(NoNav)` — 하단 네비게이션 없음

### 코드 스타일
- 한국어 주석 및 사용자 대면 콘텐츠
- Zod 스키마는 @clog/utils에서 관리
- Prisma 모델과 Zod 스키마 동기화 유지

### OpenAPI 패턴
- openapi-fetch + openapi-react-query 사용
- 클라이언트: `apps/web/src/apis/openapi/index.ts`
- 타입: `apps/web/src/@types/openapi.ts` (자동 생성)
- mutation hook 위치: `apps/web/src/hooks/mutations/`

### 페이지 패턴
- Server: React.cache + HydrationBoundary + dehydrate
- Client: `"use client"` + openapi.useSuspenseQuery
- Loading: Skeleton 컴포넌트 (`#web/components/ui/skeleton`)
- params는 Promise<T> 타입 (Next.js 15+)

### 모바일
- 대부분 WebView로 웹앱 래핑
- 네이티브 UI는 최소한만 구현
- 웹앱 URL: EXPO_PUBLIC_WEB_URL 환경변수
