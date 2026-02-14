"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { GymFormValues } from "../../hooks/useAdminGymForm";
import FormHelper from "#/src/components/custom/FormHelper";
import { Checkbox } from "#/src/components/ui/checkbox";
import { FieldSet, FieldLegend } from "#/src/components/ui/field";
import { problemTypeOptions } from "./utils";

function SectionProblemTypes() {
  const form = useFormContext<GymFormValues>();

  return (
    <div className="clog-section">
      <FieldSet>
        <FieldLegend className="mb-4">문제 타입</FieldLegend>

        <FormHelper
          name="problem_types"
          label="문제 타입"
          required
          description="여러 개 선택 가능합니다"
        >
          <Controller
            control={form.control}
            name="problem_types"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {problemTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      checked={field.value?.includes(option.value) ?? false}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, option.value]);
                        } else {
                          field.onChange(
                            current.filter((v) => v !== option.value)
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </FormHelper>
      </FieldSet>
    </div>
  );
}

export default SectionProblemTypes;
