"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { GymFormValues } from "../../hooks/useAdminGymForm";
import { Checkbox } from "#/src/components/ui/checkbox";
import { FieldSet, FieldLegend } from "#/src/components/ui/field";
import { facilityOptions } from "./utils";

function SectionFacilities() {
  const form = useFormContext<GymFormValues>();

  return (
    <div className="clog-section">
      <FieldSet>
        <FieldLegend className="mb-4">편의시설</FieldLegend>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {facilityOptions.map((option) => (
            <Controller
              key={option.value}
              control={form.control}
              name={option.value}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              )}
            />
          ))}
        </div>
      </FieldSet>
    </div>
  );
}

export default SectionFacilities;
