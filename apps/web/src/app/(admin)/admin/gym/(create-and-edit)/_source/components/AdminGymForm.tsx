"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { Tables } from "@clog/db";
import { routes } from "@clog/libs";
import useAdminGymForm, { type GymFormValues } from "../hooks/useAdminGymForm";
import { useCreateGym, useUpdateGym } from "#/src/hooks/queries/use-gyms";
import { FieldGroup } from "#/src/components/ui/field";
import { Button } from "#/src/components/ui/button";
import SectionBasicInfo from "./sections/SectionBasicInfo";
import SectionFacilityInfo from "./sections/SectionFacilityInfo";
import SectionPriceInfo from "./sections/SectionPriceInfo";
import SectionStatusInfo from "./sections/SectionStatusInfo";
import SectionFacilities from "./sections/SectionFacilities";
import SectionProblemTypes from "./sections/SectionProblemTypes";

type AdminGymFormProps = {
  /** 편집 모드일 때 초기 데이터 */
  initialData?: Tables<"gyms">;
  /** 모드 (create 또는 edit) */
  mode?: "create" | "edit";
};

const AdminGymForm: React.FC<AdminGymFormProps> = ({
  initialData,
  mode = "create",
}: AdminGymFormProps) => {
  const router = useRouter();
  const params = useParams();
  const gymId = mode === "edit" ? (params?.id as string) : undefined;
  const form = useAdminGymForm();

  // TanStack Query Mutations
  const createGym = useCreateGym();
  const updateGym = useUpdateGym();

  // 편집 모드일 때 초기값 설정
  useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({
        name: initialData.name,
        address: initialData.address,
        city: initialData.city,
        district: initialData.district,
        phone: initialData.phone || "",
        weekday_start:
          initialData.weekday_start?.toString().slice(0, 5) || "09:00",
        weekday_end: initialData.weekday_end?.toString().slice(0, 5) || "22:00",
        weekend_start:
          initialData.weekend_start?.toString().slice(0, 5) || "10:00",
        weekend_end: initialData.weekend_end?.toString().slice(0, 5) || "21:00",
        floors: initialData.floors ?? 1,
        size_sqm: initialData.size_sqm ?? 40,
        single_price: initialData.single_price ?? 20000,
        ten_times_price: initialData.ten_times_price ?? 170000,
        monthly_price: initialData.monthly_price ?? 130000,
        has_parking: initialData.has_parking ?? false,
        has_locker: initialData.has_locker ?? false,
        has_shower: initialData.has_shower ?? false,
        has_cafe: initialData.has_cafe ?? false,
        has_shop: initialData.has_shop ?? false,
        has_footbath: initialData.has_footbath ?? false,
        has_endurance: initialData.has_endurance ?? false,
        has_lead: initialData.has_lead ?? false,
        problem_types: initialData.problem_types ?? [],
        status: initialData.status,
      });
    }
  }, [initialData, mode, form]);

  const handleSubmit = form.handleSubmit(async (data: GymFormValues) => {
    try {
      if (mode === "create") {
        // 생성 모드
        await createGym.mutateAsync({
          ...data,
          phone: data.phone || null,
          weekday_start: data.weekday_start || null,
          weekday_end: data.weekday_end || null,
          weekend_start: data.weekend_start || null,
          weekend_end: data.weekend_end || null,
        });

        router.push(routes.admin.gym.url);
      } else {
        // 수정 모드
        if (!gymId) {
          throw new Error("암장 ID가 없습니다");
        }

        await updateGym.mutateAsync({
          id: gymId,
          updates: {
            ...data,
            phone: data.phone || null,
            weekday_start: data.weekday_start || null,
            weekday_end: data.weekday_end || null,
            weekend_start: data.weekend_start || null,
            weekend_end: data.weekend_end || null,
          },
        });

        router.push(routes.admin.gym.url);
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} gym:`,
        error
      );
      alert(
        error instanceof Error
          ? error.message
          : `암장 ${mode === "create" ? "생성" : "수정"}에 실패했습니다`
      );
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          {/* 기본 정보 */}
          <SectionBasicInfo />

          {/* 시설 정보 */}
          <SectionFacilityInfo />

          {/* 가격 정보 */}
          <SectionPriceInfo />

          {/* 편의시설 */}
          <SectionFacilities />

          {/* 문제 타입 */}
          <SectionProblemTypes />

          {/* 상태 (편집 모드일 때만 표시) */}
          {mode === "edit" && <SectionStatusInfo />}
        </FieldGroup>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={createGym.isPending || updateGym.isPending}
          >
            {createGym.isPending || updateGym.isPending
              ? "처리 중..."
              : mode === "create"
                ? "암장 추가"
                : "암장 수정"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AdminGymForm;
