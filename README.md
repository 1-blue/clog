## 🔥 프로젝트에 대해

### 📌 프로젝트 목적

> [!NOTE]
> 암장에 가기전에 현재 활성 인원수를 알 수 있도록 제공해주는 서비스를 만들고 싶었습니다.

클라이밍 기록, 실시간 혼잡도, 암장 리뷰, 커뮤니티를 하나로 묶은 **올인원 클라이밍 서비스**
체크인 한 번이면 암장 혼잡도에 반영되고, 세션 기록이 쌓이면 통계 리포트가 완성됩니다.

### 📆 프로젝트 기간

- ✏️ 개인 프로젝트 (AI 코딩 도구 활용 — `Claude Code`, `Cursor`)
- ⏱️ 프로젝트 기간: `2026.03.23` ~ `2026.04.06`
- ⛓️ 웹 배포: [clog.story-dict.com](https://clog.story-dict.com) (Vercel)
- 📱 모바일 앱: 스토어 심사 중 (Android)

### 🤖 주요 기술

1. `Turborepo` + `pnpm` 모노레포로 웹·모바일·DB·공유 유틸 통합 관리
2. `OpenAPI` 스펙 기반 타입 자동 생성으로 API ↔ 클라이언트 End-to-End 타입 안전성 확보
3. 체크인/체크아웃 데이터 기반 **실시간 혼잡도** 시스템 (별도 인프라 없이 유저 행위로 집계)
4. `Next.js` 웹앱을 `Expo WebView`로 래핑하여 코드베이스 하나로 웹·모바일 동시 제공
5. `Supabase` OAuth + `Expo Push Notifications`로 인증 및 푸시 알림

## 🛠️ 기술 스택

### 🖇️ Common

|                                         `TypeScript`                                          |                                         `Turborepo`                                          |                                         `pnpm`                                          |                                         `Zod`                                          |
| :-------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/turborepo/FF1E56" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/pnpm/F69220" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/zod/3E67B1" alt="icon" width="75" height="75" /> |

### 📤 FrontEnd (Web)

|                                          `Next.js`                                           |                                         `Tailwind CSS`                                         |                                       `Tanstack Query`                                        |                                         `Shadcn/ui`                                         |                                        `React-Hook-Form`                                         |
| :------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/reactquery/FF4154" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/shadcnui/000000" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/reacthookform/EC5990" alt="icon" width="75" height="75" /> |

### 📱 Mobile

|                                         `Expo`                                          |                                      `React Native`                                      |
| :-------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/expo/000020" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/react/61DAFB" alt="icon" width="75" height="75" /> |

### 📥 BackEnd & DB

|                                         `Prisma`                                          |                                         `Supabase`                                          |                                         `PostgreSQL`                                          |
| :---------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/prisma/2D3748" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/supabase/3FCF8E" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="icon" width="75" height="75" /> |

### ☁️ Infra

|                                         `Vercel`                                          |                                          `AWS S3`                                           |                                         `GitHub`                                          |
| :---------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
| <img src="https://cdn.simpleicons.org/vercel/000000" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/amazons3/569A31" alt="icon" width="75" height="75" /> | <img src="https://cdn.simpleicons.org/github/181717" alt="icon" width="75" height="75" /> |

## 🏗️ 주요 기능

### 1️⃣ 체크인 & 실시간 혼잡도

- 암장 체크인/체크아웃으로 실시간 방문자 수 집계
- 혼잡도 랭킹 (현재 체크인 유저 수 기준 TOP 5)
- 인기 클라이밍장 (이달 체크인 수 기준 TOP 3)
- 자동 체크아웃 (기본 4시간, 30분~12시간 설정 가능)
- 30분 이상 체크인 시 클라이밍 기록 자동 생성

### 2️⃣ 클라이밍 기록 & 통계

- 세션별 루트 기록 (V0~V10 난이도, 완등/시도/플래시/온사이트)
- 일간/주간/월간/연간 통계 대시보드 (완등 수, 난이도 분포, 운동 시간)
- 활동 히트맵, 자주 방문한 암장 TOP 5
- 회원권 관리 (기간권/횟수권, 일시정지, 잔여 횟수)

### 3️⃣ 암장 정보 & 리뷰

- 암장 목록 (6가지 정렬: 이름/평점/혼잡도/리뷰/방문자/이달 방문)
- 지역 필터, 검색, 북마크
- 암장 리뷰 (1인 1리뷰, 별점 1~5, 체감 난이도, 시설 특징)

### 4️⃣ 커뮤니티

- 게시글 (자유/팁/후기/모임/장비), 댓글·답글, 좋아요·북마크
- 팔로우 시스템
- 앱 내 알림 + Android 푸시 알림

## 📁 프로젝트 구조

```
clog/
├── apps/
│   ├── web/               # Next.js 웹앱 (App Router, 포트 9001)
│   └── mobile/            # React Native Expo (WebView 래핑)
├── packages/
│   ├── database/          # @clog/db — Prisma + Supabase PostgreSQL
│   ├── utils/             # @clog/utils — Zod 스키마, 공유 유틸
│   ├── typescript-config/
│   └── eslint-config/
├── turbo.json
└── pnpm-workspace.yaml
```

## 🚀 실행 방법

```bash
# 의존성 설치
pnpm install

# Prisma 클라이언트 생성
pnpm db:generate

# 개발 서버 실행 (웹: localhost:9001)
pnpm dev

# 웹만 실행
pnpm dev:web

# 모바일만 실행
pnpm dev:mobile

# 전체 빌드
pnpm build

# OpenAPI 타입 생성
pnpm openapi:generate
```

## 📚 문서

### 1️⃣ 서비스

> [클로그 웹앱](https://clog.story-dict.com)

- [개인정보 처리방침](https://thrilling-mapusaurus-f24.notion.site/335b6aeed4018009a210ebf7732dc9fd?source=copy_link)
- [서비스 이용약관](https://thrilling-mapusaurus-f24.notion.site/335b6aeed401802da749f0dd74d544b9?source=copy_link)

### 2️⃣ 소통

- [오픈 카톡방](https://open.kakao.com/o/gKwF0Voi)
- [피드백 보내기 (구글폼)](https://forms.gle/9wywrAWigFq2oTaJA)
