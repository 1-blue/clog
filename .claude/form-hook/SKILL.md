# react-hook-form + zod 폼 훅 생성 스킬

## 개요

react-hook-form + zodResolver 기반 폼 훅을 생성하고, FormProvider/useFormContext 패턴으로 자식 컴포넌트에서 폼 상태에 직접 접근하는 패턴.

## 훅 파일 생성

### 위치 및 네이밍

- 파일명: `use{Feature}Form.ts`
- 위치: 해당 폼을 사용하는 컴포넌트 폴더 내

### 훅 구조

```ts
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { z } from "zod";

import { someApiSchema } from "@clog/utils";

/** 프론트 전용 폼 스키마 — API 스키마에서 UX 맞춤 확장 */
const featureFormSchema = someApiSchema.extend({
  // UX에 맞게 프론트 전용 검증 추가/변경
  // 예: rating: z.number().int().min(1, "별점을 선택해 주세요.").max(5),
});

export type TFeatureFormData = z.infer<typeof featureFormSchema>;

const useFeatureForm = (props?: Partial<UseFormProps<TFeatureFormData>>) => {
  return useForm<TFeatureFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      // 각 필드의 기본값 설정
      ...props?.defaultValues,
    },
    mode: "onChange",
    ...props,
  });
};

export default useFeatureForm;
```

### 핵심 규칙

1. **API 스키마 재사용**: `@clog/utils`의 Zod 스키마를 `.extend()`로 프론트 UX에 맞게 확장
2. **타입 export**: `export type TFeatureFormData = z.infer<typeof schema>` — 자식 컴포넌트에서 `useFormContext<T>()` 사용 시 필요
3. **UseFormProps partial**: 호출 시 defaultValues 등 오버라이드 가능
4. **mode: "onChange"**: 실시간 유효성 검사

## 부모 컴포넌트 (FormProvider)

```tsx
"use client";

import { FormProvider } from "react-hook-form";

import useFeatureForm, { type TFeatureFormData } from "./useFeatureForm";

const FeatureMain = () => {
  const methods = useFeatureForm();
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: TFeatureFormData) => {
    mutation.mutate({ body: data });
  };

  return (
    <FormProvider {...methods}>
      {/* 자식 컴포넌트에 value/onChange props 전달 불필요 */}
      <ChildA />
      <ChildB />
      <button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
        제출
      </button>
    </FormProvider>
  );
};
```

## 자식 컴포넌트 패턴

### useWatch + setValue (커스텀 UI)

대부분의 커스텀 UI 컴포넌트에 사용. 칩 토글, 별점, 커스텀 셀렉터 등.

```tsx
"use client";

import { useFormContext, useWatch } from "react-hook-form";

import type { TFeatureFormData } from "../useFeatureForm";

const ChildComponent = () => {
  const { control, setValue } = useFormContext<TFeatureFormData>();
  const value = useWatch({ control, name: "fieldName" });

  return (
    <button
      onClick={() => setValue("fieldName", newValue, { shouldValidate: true })}
    >
      {value}
    </button>
  );
};
```

### Controller (네이티브 input 래퍼)

Textarea, Input 등 HTML 요소를 직접 사용하는 경우.

```tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";

import type { TFeatureFormData } from "../useFeatureForm";

const TextFieldComponent = () => {
  const { control } = useFormContext<TFeatureFormData>();

  return (
    <Controller
      control={control}
      name="content"
      render={({ field }) => (
        <textarea
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
};
```

### 배열 필드 토글

```tsx
const features = useWatch({ control, name: "features" }) ?? [];

const toggle = (feature: string) => {
  const next = features.includes(feature)
    ? features.filter((f) => f !== feature)
    : [...features, feature];
  setValue("features", next);
};
```

## 참고 사항

- `isValid`는 `mode: "onChange"` 설정 시 실시간으로 업데이트
- `shouldValidate: true`를 setValue에 전달하면 해당 필드 즉시 검증
- 자식 컴포넌트에서 `IProps` 인터페이스와 value/onChange props 완전 제거
- `useWatch`는 구독 기반이라 해당 필드 변경 시에만 리렌더
