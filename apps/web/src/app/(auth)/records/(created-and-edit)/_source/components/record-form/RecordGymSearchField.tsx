"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import FormHelper from "#web/components/shared/FormHelper";
import SearchableCombobox from "#web/components/ui/searchable-combobox";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";
import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

type GymListItem = components["schemas"]["GymListItem"];
type GymOption = Pick<GymListItem, "id" | "name">;

interface IProps {
  className?: string;
}

const RecordGymSearchField: React.FC<IProps> = ({ className }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TRecordFormData>();
  const gymId = useWatch({ control, name: "gymId" });
  const gymName = useWatch({ control, name: "gymName" });

  const [draft, setDraft] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(draft.trim()), 280);
    return () => clearTimeout(t);
  }, [draft]);

  const { data: gyms = [] } = openapi.useQuery(
    "get",
    "/api/v1/gyms",
    {
      params: {
        query: {
          limit: 50,
          ...(debounced ? { search: debounced } : {}),
        },
      },
    },
    { select: (d) => d.payload?.items ?? [] },
  );

  const items = useMemo<GymOption[]>(
    () => gyms.map((g) => ({ id: g.id, name: g.name })),
    [gyms],
  );

  const value: GymOption | null =
    gymId && gymName ? { id: gymId, name: gymName } : null;

  return (
    <FormHelper
      label="암장 찾기"
      labelClassName={recordFormFieldLabelClass}
      className={cn("gap-2", className)}
      message={{ error: errors.gymId?.message }}
      cloneChild={false}
      controlAriaLabel="암장 검색"
    >
      <SearchableCombobox<GymOption>
        items={items}
        value={value}
        onValueChange={(next) => {
          if (next) {
            setValue("gymId", next.id, { shouldValidate: true });
            setValue("gymName", next.name);
          } else {
            setValue("gymId", "", { shouldValidate: true });
            setValue("gymName", "");
          }
          setValue("userMembershipId", "");
        }}
        onInputValueChange={setDraft}
        itemToStringLabel={(g) => g.name}
        getItemKey={(g) => g.id}
        isItemEqualToValue={(a, b) => a.id === b.id}
        renderItem={(item) => (
          <span className="min-w-0 font-medium break-words">{item.name}</span>
        )}
        placeholder="암장 이름을 입력하세요"
      />
    </FormHelper>
  );
};

export default RecordGymSearchField;
