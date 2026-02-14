"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { GymFormValues } from "../../hooks/useAdminGymForm";
import FormHelper from "#/src/components/custom/FormHelper";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "#/src/components/ui/input-group";
import { FieldSet, FieldLegend } from "#/src/components/ui/field";

function SectionPriceInfo() {
  const form = useFormContext<GymFormValues>();

  // 숫자 포맷팅 함수 (세자리 구분기호)
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "";
    return value.toLocaleString("ko-KR");
  };

  // 포맷된 문자열을 숫자로 변환 (가격은 정수)
  const parsePrice = (value: string): number | null => {
    const cleaned = value.replace(/,/g, "").trim();
    if (cleaned === "") return null;
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  };

  return (
    <div className="clog-section">
      <FieldSet>
        <FieldLegend className="mb-4">가격 정보</FieldLegend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormHelper name="single_price" label="1회 이용료" required>
            <InputGroup>
              <Controller
                control={form.control}
                name="single_price"
                render={({ field }) => (
                  <InputGroupInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(field.value)}
                    onChange={(e) => {
                      const num = parsePrice(e.target.value);
                      field.onChange(num);
                    }}
                    onBlur={field.onBlur}
                    placeholder="0"
                    className="text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <InputGroupAddon align="inline-end" className="border-l pl-2">
                <InputGroupText>원</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormHelper>

          <FormHelper name="ten_times_price" label="10회 이용료" required>
            <InputGroup>
              <Controller
                control={form.control}
                name="ten_times_price"
                render={({ field }) => (
                  <InputGroupInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(field.value)}
                    onChange={(e) => {
                      const num = parsePrice(e.target.value);
                      field.onChange(num);
                    }}
                    onBlur={field.onBlur}
                    placeholder="0"
                    className="text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <InputGroupAddon align="inline-end" className="border-l pl-2">
                <InputGroupText>원</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormHelper>

          <FormHelper name="monthly_price" label="월 이용료" required>
            <InputGroup>
              <Controller
                control={form.control}
                name="monthly_price"
                render={({ field }) => (
                  <InputGroupInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(field.value)}
                    onChange={(e) => {
                      const num = parsePrice(e.target.value);
                      field.onChange(num);
                    }}
                    onBlur={field.onBlur}
                    placeholder="0"
                    className="text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <InputGroupAddon align="inline-end" className="border-l pl-2">
                <InputGroupText>원</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormHelper>
        </div>
      </FieldSet>
    </div>
  );
}

export default SectionPriceInfo;
