---
name: mutation-hook
description: TanStack Query mutation hook 생성기. openapi.useMutation 기반의 CRUD mutation hook을 프로젝트 패턴에 맞게 자동 생성한다. "mutation hook 만들어줘", "useMutation 추가", "API 호출 훅 생성", "CRUD 훅 만들어줘", "프론트엔드 API 연동 훅" 같은 요청에 사용.
---

# TanStack Query Mutation Hook 생성

clog 프로젝트의 mutation hook을 생성하는 스킬이다.

## 사용자 입력 확인

1. **기능명** (예: `story`, `storyComment`, `storyReaction`)
2. **API 경로들** - create/update/delete에 사용할 openapi 경로
3. **CRUD 범위** - create, patch, delete 중 필요한 것
4. **invalidate 대상 쿼리** - 성공 후 무효화할 쿼리 경로
5. **리다이렉트 경로** - 성공 후 이동할 라우트 (선택사항)
6. **부모 파라미터** - useParams로 가져올 값이 있는지

## 생성 파일 위치

```
apps/web/src/hooks/mutations/{feature}/use{Feature}Mutations.tsx
```

중첩 기능: `hooks/mutations/stories/comments/reactions/useStoryCommentReactionMutations.tsx`

## 패턴 선택 가이드

| 시나리오                  | 패턴      | invalidate 대상 | revalidateTag | redirect |
| ------------------------- | --------- | --------------- | ------------- | -------- |
| 최상위 리소스 CRUD        | 기본 패턴 | 목록 쿼리       | O             | O        |
| 중첩 리소스 (reaction 등) | 중첩 패턴 | 부모 상세 쿼리  | X             | X        |

## 템플릿

### 기본 패턴 — 최상위 리소스 (리다이렉트 포함)

```typescript
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";
import { routes } from "#web/constants";
import { revalidateTagForServer } from "#web/actions/revalidateForServer";

const use{Feature}Mutations = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { queryKey } = openapi.queryOptions("get", "{listApiEndpoint}");
  const path = queryKey[1];

  const {camelFeature}CreateMutation = openapi.useMutation(
    "post",
    "{createApiEndpoint}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        router.replace(routes.{routeKey}.url);
      },
    },
  );
  const {camelFeature}PatchMutation = openapi.useMutation(
    "patch",
    "{updateApiEndpoint}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        router.replace(routes.{routeKey}.url);
      },
    },
  );
  const {camelFeature}DeleteMutation = openapi.useMutation(
    "delete",
    "{deleteApiEndpoint}",
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey });
        revalidateTagForServer([path]);
        router.replace(routes.{routeKey}.url);
      },
    },
  );

  return {
    {camelFeature}CreateMutation,
    {camelFeature}PatchMutation,
    {camelFeature}DeleteMutation,
  };
};

export default use{Feature}Mutations;
```

### 중첩 패턴 — 하위 리소스 (useParams 사용, 리다이렉트 없음)

```typescript
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { openapi } from "#web/apis/openapi";

const use{Feature}Mutations = () => {
  const queryClient = useQueryClient();
  const params = useParams<{ {parentParam}: string }>();
  const { queryKey } = openapi.queryOptions(
    "get",
    "{parentDetailApiEndpoint}",
    { params: { path: { {parentParam}: params.{parentParam} } } },
  );

  const create{Feature}Mutation = openapi.useMutation(
    "post",
    "{createApiEndpoint}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
  const patch{Feature}Mutation = openapi.useMutation(
    "patch",
    "{updateApiEndpoint}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );
  const delete{Feature}Mutation = openapi.useMutation(
    "delete",
    "{deleteApiEndpoint}",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
  );

  return {
    create{Feature}Mutation,
    patch{Feature}Mutation,
    delete{Feature}Mutation,
  };
};

export default use{Feature}Mutations;
```

## 핵심 규칙

- `openapi.useMutation(method, path, options)` 형태 사용
- method: `"post"`, `"patch"`, `"delete"` 중 하나
- path: `apps/web/src/@types/openapi.ts`에 정의된 경로와 정확히 일치
- `queryKey`는 반드시 `openapi.queryOptions()`에서 추출
- `revalidateTagForServer`는 최상위 리소스에서만 사용
- 중첩 리소스는 부모의 상세 쿼리만 invalidate하면 충분

## import 경로 규칙

| 모듈                   | 경로                               |
| ---------------------- | ---------------------------------- |
| openapi                | `#web/apis/openapi`                |
| routes                 | `#web/constants`                   |
| revalidateTagForServer | `#web/actions/revalidateForServer` |
| useRouter              | `next/navigation`                  |
| useQueryClient         | `@tanstack/react-query`            |
| useParams              | `next/navigation`                  |

## 체크리스트

- [ ] `openapi` import가 `#web/apis/openapi`에서 됨
- [ ] 최상위 패턴: `revalidateTagForServer` import 포함
- [ ] 최상위 패턴: `routes` import 및 리다이렉트 포함
- [ ] 중첩 패턴: `useParams` 사용 및 부모 쿼리 invalidate
- [ ] mutation 변수명이 `{feature}{Action}Mutation` 패턴
- [ ] return 객체에 모든 mutation 포함
- [ ] `export default` 사용
