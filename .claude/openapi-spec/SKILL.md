---
name: openapi-spec
description: OpenAPI YAML 스펙 생성 및 업데이트 스킬. Next.js Route Handler API 코드를 분석하여 OpenAPI 3.1 YAML 스펙을 자동 생성한다. "openapi 스펙 만들어줘", "API 스펙 생성", "YAML 업데이트", "새 API 엔드포인트 추가", "openapi 타입 생성" 같은 요청에 사용. API를 새로 만들었거나 수정했을 때 스펙을 동기화하는 데에도 사용한다.
---

# OpenAPI YAML 스펙 생성기

clog 프로젝트의 Next.js Route Handler를 분석하여 OpenAPI 3.1 YAML 스펙을 생성·업데이트하는 스킬이다.

## 작업 흐름

1. `apps/web/src/app/api/v1/` 하위의 route.ts 파일들을 스캔
2. 각 라우트의 HTTP 메서드, 파라미터, 요청 body, 응답 shape 분석
3. `apps/web/openapi.yaml` 에 반영
4. `pnpm --filter web openapi:generate` 실행하여 타입 재생성

## YAML 파일 위치

```
apps/web/openapi.yaml        → OpenAPI 3.1 스펙 원본
apps/web/src/@types/openapi.ts → openapi-typescript로 자동 생성된 타입
```

## 분석 대상

| 소스                                     | 용도                           |
| ---------------------------------------- | ------------------------------ |
| `apps/web/src/app/api/v1/**/route.ts`    | 경로, 메서드, 로직             |
| `packages/utils/src/schemas/*.schema.ts` | Zod 스키마 → request body 정의 |
| `apps/web/src/libs/api.ts`               | 응답 헬퍼 → 응답 형태 결정     |

## 응답 형식 규칙

이 프로젝트의 API 응답은 아래 3가지 패턴 중 하나를 따른다:

### 단일 데이터 응답 — `json(payload)`

```yaml
type: object
required: [payload]
properties:
  payload:
    $ref: "#/components/schemas/SomeSchema"
```

### 토스트 포함 응답 — `jsonWithToast(payload, toast)`

```yaml
type: object
required: [toast, payload]
properties:
  toast: { type: string }
  payload:
    $ref: "#/components/schemas/SomeSchema"
```

### 페이지네이션 응답 — `paginatedJson(items, nextCursor)`

```yaml
type: object
required: [payload]
properties:
  payload:
    type: object
    required: [items, nextCursor]
    properties:
      items:
        type: array
        items: { $ref: "#/components/schemas/ItemSchema" }
      nextCursor: { type: string, nullable: true }
```

## 스키마 작성 규칙

### Prisma include 결과 매핑

Prisma의 `include` 결과는 중첩 객체로 반환된다. 이를 OpenAPI 스키마로 변환할 때:

- `include: { user: { select: { id, nickname, profileImage } } }` → `AuthorSummary` 참조
- `include: { images: { take: 1 } }` → 해당 Image 스키마의 array
- `include: { _count: { select: { ... } } }` → 별도 Counts 스키마
- `include: { replies: { include: { author } } }` → 중첩 스키마

### 열거형(Enum)

`packages/utils/src/schemas/enums.ts` 의 Zod enum을 그대로 OpenAPI enum으로 변환:

```yaml
Region:
  type: string
  enum: [SEOUL, GYEONGGI, INCHEON, ...]
```

### nullable 필드

Prisma 모델에서 `String?` 은 OpenAPI에서:

```yaml
type: string
nullable: true
```

## 새 엔드포인트 추가 시 절차

1. route.ts 파일을 읽어 메서드, 파라미터, body, 응답 분석
2. 필요한 경우 `components/schemas` 에 새 스키마 추가
3. `paths` 에 새 경로 추가
4. `pnpm --filter web openapi:generate` 실행
5. 생성된 타입 확인

## 체크리스트

- [ ] 모든 경로 파라미터에 `required: true` 설정
- [ ] query 파라미터의 기본값이 Zod 스키마와 일치
- [ ] 페이지네이션 응답에 `nextCursor` 포함
- [ ] 에러 응답은 스펙에 포함하지 않음 (클라이언트에서 일괄 처리)
- [ ] 날짜 필드는 `format: date-time` 사용
- [ ] UUID 필드는 `format: uuid` 사용
- [ ] `pnpm --filter web openapi:generate` 성공 확인
