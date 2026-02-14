"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { GymFormValues } from "../../hooks/useAdminGymForm";
import FormHelper from "#/src/components/custom/FormHelper";
import AddressInput from "#/src/components/custom/AddressInput";
import { Input } from "#/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/src/components/ui/select";
import { FieldSet, FieldLegend } from "#/src/components/ui/field";
import { TimePicker } from "#/src/components/ui/time-picker";
import { gymCityOptions } from "./utils";

function SectionBasicInfo() {
  const form = useFormContext<GymFormValues>();

  return (
    <div className="clog-section">
      <FieldSet>
        <FieldLegend className="mb-4">기본 정보</FieldLegend>

        <FormHelper name="name" label="암장 이름" required>
          <Input
            {...form.register("name")}
            placeholder="암장 이름을 입력하세요"
          />
        </FormHelper>

        <AddressInput<GymFormValues>
          addressName="address"
          label="주소"
          required
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormHelper name="city" label="시/도" required>
            <Controller
              control={form.control}
              name="city"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {field.value
                        ? gymCityOptions.find(
                            (opt) => opt.value === field.value
                          )?.label
                        : "시/도를 선택하세요"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {gymCityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormHelper>

          <FormHelper name="district" label="시/군/구" required>
            <Input
              {...form.register("district")}
              placeholder="시/군/구를 입력하세요"
            />
          </FormHelper>
        </div>

        <FormHelper name="phone" label="전화번호" required>
          <Input
            {...form.register("phone")}
            placeholder="02-1234-5678 또는 01012345678"
            type="tel"
          />
        </FormHelper>

        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium">평일 운영시간</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormHelper name="weekday_start" label="시작 시간" required>
                <Controller
                  control={form.control}
                  name="weekday_start"
                  render={({ field }) => (
                    <TimePicker
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="09:00"
                    />
                  )}
                />
              </FormHelper>

              <FormHelper name="weekday_end" label="종료 시간" required>
                <Controller
                  control={form.control}
                  name="weekday_end"
                  render={({ field }) => (
                    <TimePicker
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="22:00"
                    />
                  )}
                />
              </FormHelper>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">주말 운영시간</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormHelper name="weekend_start" label="시작 시간" required>
                <Controller
                  control={form.control}
                  name="weekend_start"
                  render={({ field }) => (
                    <TimePicker
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="10:00"
                    />
                  )}
                />
              </FormHelper>

              <FormHelper name="weekend_end" label="종료 시간" required>
                <Controller
                  control={form.control}
                  name="weekend_end"
                  render={({ field }) => (
                    <TimePicker
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="21:00"
                    />
                  )}
                />
              </FormHelper>
            </div>
          </div>
        </div>
      </FieldSet>
    </div>
  );
}

export default SectionBasicInfo;
