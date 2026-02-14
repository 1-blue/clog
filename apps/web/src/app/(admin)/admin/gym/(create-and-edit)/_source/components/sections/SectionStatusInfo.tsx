"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { GymFormValues } from "../../hooks/useAdminGymForm";
import FormHelper from "#/src/components/custom/FormHelper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/src/components/ui/select";
import { FieldSet, FieldLegend } from "#/src/components/ui/field";
import { gymStatusOptions } from "./utils";

function SectionStatusInfo() {
  const form = useFormContext<GymFormValues>();

  return (
    <div className="clog-section">
      <FieldSet>
        <FieldLegend className="mb-4">상태</FieldLegend>

        <FormHelper name="status" label="암장 상태" required>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {field.value
                      ? gymStatusOptions.find(
                          (opt) => opt.value === field.value
                        )?.label
                      : "상태를 선택하세요"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {gymStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormHelper>
      </FieldSet>
    </div>
  );
}

export default SectionStatusInfo;
