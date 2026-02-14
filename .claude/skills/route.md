# Skill: route — 라우트 등록

## 목적
새로운 페이지의 라우트를 `packages/libs/src/constants/routes/routes.ts`에 등록한다.
관리자/공개/인증 모든 영역에 공통으로 사용한다.

## 파일 위치
`packages/libs/src/constants/routes/routes.ts`

## 구조

```tsx
{featureName}: {
  label: `{featureNameKr}`,
  url: `/{basePath}`,
  access: "{access}",       // "public" | "auth" | "guest" | "admin"

  detail: {                  // 상세 (동적)
    label: `{featureNameKr} 상세`,
    url: (id: string) => `/{basePath}/${id}`,
    access: "{access}",
  },
  create: {                  // 생성
    label: `{featureNameKr} 생성`,
    url: `/{basePath}/create`,
    access: "{access}",
  },
  edit: {                    // 수정 (동적)
    label: `{featureNameKr} 수정`,
    url: (id: string) => `/{basePath}/${id}/edit`,
    access: "{access}",
  },
},
```

## 영역별 예시

### 관리자 — `admin` 하위에 중첩
```tsx
admin: {
  session: {
    label: `관리자 세션 관리`,
    url: `/admin/session`,
    access: "admin",
  },
},
```

### 공개/인증 — 최상위에 배치
```tsx
gym: {
  label: `암장`,
  url: `/gym`,
  access: "public",
  detail: {
    label: `암장 상세`,
    url: (gymId: string) => `/gym/${gymId}`,
    access: "public",
  },
  create: {
    label: `암장 생성`,
    url: `/gym/create`,
    access: "auth",         // 생성은 로그인 필요
  },
},
```

## 규칙
- 동적 라우트 → 함수: `url: (id: string) => \`/path/${id}\``
- 정적 라우트 → 문자열: `url: "/path"`
- label은 한국어
- 하위 라우트에도 access 필드 필수
- 필요한 하위 라우트만 추가 (detail/create/edit 모두 필수 아님)
