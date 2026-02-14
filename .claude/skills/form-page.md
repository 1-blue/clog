# Skill: form-page — 폼 페이지 생성 (생성/수정)

## 목적
데이터를 생성하거나 수정하는 폼 페이지를 생성한다.
관리자/공개/인증 **모든 영역**에서 동일한 패턴을 사용한다.

## 생성 파일

```
{routePath}/
├── (create-and-edit)/
│   ├── _source/
│   │   ├── components/
│   │   │   ├── {Feature}Form.tsx          // 공통 폼
│   │   │   └── sections/
│   │   │       └── Section{Name}.tsx      // 폼 섹션들
│   │   └── hooks/
│   │       └── use{Feature}Form.ts        // Zod 스키마 + useForm
│   ├── create/
│   │   ├── page.tsx
│   │   └── _source/components/
│   │       └── {Feature}CreatePage.tsx
│   └── [id]/edit/
│       ├── page.tsx
│       └── _source/components/
│           ├── {Feature}EditPage.tsx
│           └── {Feature}EditPageSkeleton.tsx
```

## 1. Zod 스키마 + useForm 훅

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Constants } from "@clog/db";

const {feature}FormSchema = z.object({
  // 문자열:  z.string().min(1, "필수 입력입니다").max(100, "100자 이내")
  // 숫자:    z.number().int().nonnegative()
  // 불리언:  z.boolean()
  // 열거형:  z.enum(Constants.public.Enums.{enum_name})
  // 배열:    z.array(z.enum(...)).min(1, "최소 1개 선택")
});

export type {Feature}FormValues = z.infer<typeof {feature}FormSchema>;

const use{Feature}Form = () => {
  const form = useForm<{Feature}FormValues>({
    resolver: zodResolver({feature}FormSchema),
    defaultValues: { /* 기본값 */ },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  return form;
};

export default use{Feature}Form;
```

## 2. 공통 폼 컴포넌트

```tsx
"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { Tables } from "@clog/db";
import { routes } from "@clog/libs";
import use{Feature}Form, { type {Feature}FormValues } from "../hooks/use{Feature}Form";
import { useCreate{Feature}, useUpdate{Feature} } from "#/src/hooks/queries/use-{feature-kebab}";
import { FieldGroup } from "#/src/components/ui/field";
import { Button } from "#/src/components/ui/button";

type {Feature}FormProps = {
  initialData?: Tables<"{table}">;
  mode?: "create" | "edit";
};

const {Feature}Form: React.FC<{Feature}FormProps> = ({ initialData, mode = "create" }) => {
  const router = useRouter();
  const params = useParams();
  const itemId = mode === "edit" ? (params?.id as string) : undefined;
  const form = use{Feature}Form();

  const create{Feature} = useCreate{Feature}();
  const update{Feature} = useUpdate{Feature}();

  // 편집 모드 초기값
  useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({ /* initialData → formValues 변환 */ });
    }
  }, [initialData, mode, form]);

  const handleSubmit = form.handleSubmit(async (data: {Feature}FormValues) => {
    try {
      if (mode === "create") {
        await create{Feature}.mutateAsync({ ...data });
      } else {
        if (!itemId) throw new Error("ID가 없습니다");
        await update{Feature}.mutateAsync({ id: itemId, updates: { ...data } });
      }
      router.push(routes.{redirectRoute}.url);
    } catch (error) {
      console.error(`Error ${mode}:`, error);
      alert(error instanceof Error ? error.message : "처리에 실패했습니다");
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          {/* 섹션 컴포넌트들 */}
        </FieldGroup>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={create{Feature}.isPending || update{Feature}.isPending}>
            {create{Feature}.isPending || update{Feature}.isPending
              ? "처리 중..."
              : mode === "create" ? "추가" : "수정"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default {Feature}Form;
```

## 3. 섹션 컴포넌트

```tsx
"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { {Feature}FormValues } from "../../hooks/use{Feature}Form";
import FormHelper from "#/src/components/custom/FormHelper";
import { Input } from "#/src/components/ui/input";
import { FieldSet, FieldLegend } from "#/src/components/ui/field";

const Section{Name}: React.FC = () => {
  const { register } = useFormContext<{Feature}FormValues>();

  return (
    <FieldSet>
      <FieldLegend>{섹션 제목}</FieldLegend>

      <FormHelper name="fieldName" label="라벨" required>
        <Input {...register("fieldName")} placeholder="입력" />
      </FormHelper>

      {/* 숫자 */}
      <FormHelper name="numField" label="숫자" required>
        <Input type="number" {...register("numField", { valueAsNumber: true })} />
      </FormHelper>
    </FieldSet>
  );
};

export default Section{Name};
```

## 4. Create / Edit 페이지

### Create

```tsx
// create/page.tsx
import type { Metadata } from "next";
import {Feature}CreatePage from "./_source/components/{Feature}CreatePage";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "추가" });

const Page = () => (
  <AdminErrorBoundary>
    <{Feature}CreatePage />
  </AdminErrorBoundary>
);
export default Page;
```

```tsx
// {Feature}CreatePage.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "#/src/components/ui/button";
import {Feature}Form from "../../../_source/components/{Feature}Form";

const {Feature}CreatePage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">추가</h1>
      </div>
      <{Feature}Form mode="create" />
    </div>
  );
};

export default {Feature}CreatePage;
```

### Edit

```tsx
// [id]/edit/_source/components/{Feature}EditPage.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSuspense{Feature} } from "#/src/hooks/queries/use-{feature-kebab}";
import { Button } from "#/src/components/ui/button";
import {Feature}Form from "../../../../_source/components/{Feature}Form";

const {Feature}EditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { data: item } = useSuspense{Feature}(params.id as string);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">수정</h1>
      </div>
      <{Feature}Form mode="edit" initialData={item} />
    </div>
  );
};

export default {Feature}EditPage;
```
