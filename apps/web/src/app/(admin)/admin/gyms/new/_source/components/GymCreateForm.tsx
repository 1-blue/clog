"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { createGymSchema, type TCreateGym } from "@clog/contracts";

import { Button } from "#web/components/ui/button";
import { Card } from "#web/components/ui/card";
import { Input } from "#web/components/ui/input";
import { Label } from "#web/components/ui/label";
import { Textarea } from "#web/components/ui/textarea";

const REGION_OPTIONS = ["SEOUL", "GYEONGGI", "INCHEON", "BUSAN"] as const;
const BRAND_OPTIONS = [
  "STANDALONE",
  "THE_CLIMB",
  "SEOULFOREST",
  "CLIMBINGPARK",
  "SONCLIMB",
  "PEAKERS",
  "WAVEROCK",
  "CLIMB_US",
  "DAMJANG",
  "B_BLOC",
  "ALLEZ",
] as const;

const GymCreateForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TCreateGym>({
    resolver: zodResolver(createGymSchema),
    defaultValues: {
      region: "SEOUL",
      membershipBrand: "STANDALONE",
      latitude: 37.5,
      longitude: 127,
    },
  });

  const onSubmit = async (values: TCreateGym) => {
    const res = await fetch("/api/v1/admin/gyms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(body?.toast ?? "암장 생성에 실패했습니다.");
      return;
    }
    toast.success(body?.toast ?? "암장이 생성되었습니다.");
    router.push(`/admin/gyms/${body.payload.id}`);
  };

  const Row = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-error text-xs">{error}</p> : null}
    </div>
  );

  return (
    <Card className="p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <Row label="이름 *" error={errors.name?.message}>
          <Input {...register("name")} />
        </Row>
        <Row label="지역 *" error={errors.region?.message}>
          <select
            {...register("region")}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          >
            {REGION_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Row>
        <Row label="주소 *" error={errors.address?.message}>
          <Input {...register("address")} />
        </Row>
        <Row label="전화번호 *" error={errors.phone?.message}>
          <Input {...register("phone")} />
        </Row>
        <Row label="위도 *" error={errors.latitude?.message}>
          <Input
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
          />
        </Row>
        <Row label="경도 *" error={errors.longitude?.message}>
          <Input
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
          />
        </Row>
        <Row label="커버 이미지 URL *" error={errors.coverImageUrl?.message}>
          <Input {...register("coverImageUrl")} />
        </Row>
        <Row label="로고 이미지 URL *" error={errors.logoImageUrl?.message}>
          <Input {...register("logoImageUrl")} />
        </Row>
        <Row label="회원권 브랜드 *" error={errors.membershipBrand?.message}>
          <select
            {...register("membershipBrand")}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          >
            {BRAND_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Row>
        <Row label="웹사이트" error={errors.website?.message}>
          <Input {...register("website")} />
        </Row>
        <div className="md:col-span-2">
          <Row label="설명 *" error={errors.description?.message}>
            <Textarea rows={4} {...register("description")} />
          </Row>
        </div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "생성 중..." : "암장 생성"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GymCreateForm;
