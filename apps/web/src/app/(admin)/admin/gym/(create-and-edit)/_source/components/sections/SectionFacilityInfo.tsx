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

function SectionFacilityInfo() {
  const form = useFormContext<GymFormValues>();

  // 숫자 포맷팅 함수 (세자리 구분기호)
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "";
    return value.toLocaleString("ko-KR");
  };

  // 포맷된 문자열을 숫자로 변환 (층수는 정수)
  const parseFloors = (value: string): number | null => {
    const cleaned = value.replace(/,/g, "").trim();
    if (cleaned === "") return null;
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  };

  // 포맷된 문자열을 숫자로 변환 (면적은 소수 가능)
  const parseSize = (value: string): number | null => {
    const cleaned = value.replace(/,/g, "").trim();
    if (cleaned === "") return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  return (
    <div className="clog-section">
      <FieldSet>
        <FieldLegend className="mb-4">시설 정보</FieldLegend>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormHelper name="floors" label="층수" required>
            <InputGroup>
              <Controller
                control={form.control}
                name="floors"
                render={({ field }) => (
                  <InputGroupInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(field.value)}
                    onChange={(e) => {
                      const num = parseFloors(e.target.value);
                      field.onChange(num);
                    }}
                    onBlur={field.onBlur}
                    placeholder="층수를 입력하세요"
                    className="text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <InputGroupAddon align="inline-end" className="border-l pl-2">
                <InputGroupText>층</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormHelper>

          <FormHelper name="size_sqm" label="면적" required>
            <InputGroup>
              <Controller
                control={form.control}
                name="size_sqm"
                render={({ field }) => (
                  <InputGroupInput
                    type="text"
                    inputMode="decimal"
                    value={formatNumber(field.value)}
                    onChange={(e) => {
                      const num = parseSize(e.target.value);
                      field.onChange(num);
                    }}
                    onBlur={field.onBlur}
                    placeholder="면적을 입력하세요"
                    className="text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                )}
              />
              <InputGroupAddon align="inline-end" className="border-l pl-2">
                <InputGroupText>m²</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormHelper>
        </div>
      </FieldSet>
    </div>
  );
}

export default SectionFacilityInfo;
