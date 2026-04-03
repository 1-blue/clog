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
type GymOption = Pick<GymListItem, "id" | "name"> & {
  address?: string | null;
};

interface IProps {
  className?: string;
}

const filterGymsByQuery = (items: GymOption[], q: string): GymOption[] => {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter(
    (g) =>
      g.name.toLowerCase().includes(needle) ||
      (g.address?.toLowerCase().includes(needle) ?? false),
  );
};

const RecordGymSearchField: React.FC<IProps> = ({ className }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TRecordFormData>();
  const gymId = useWatch({ control, name: "gymId" });
  const gymName = useWatch({ control, name: "gymName" });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      280,
    );
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  const trimmedInput = searchQuery.trim();
  const debounced = debouncedSearch.trim();
  const isPendingDebounce =
    trimmedInput.length >= 1 && trimmedInput !== debounced;
  const fetchBrowseAll = trimmedInput.length === 0;
  const fetchWithSearch =
    trimmedInput.length >= 1 && trimmedInput === debounced;
  const queryEnabled = fetchBrowseAll || fetchWithSearch;

  const { data: gymsRes, isFetching } = openapi.useQuery(
    "get",
    "/api/v1/gyms",
    {
      params: {
        query: {
          limit: fetchWithSearch ? 50 : 50,
          sort: "name",
          ...(fetchWithSearch ? { search: debounced } : {}),
        },
      },
    },
    {
      enabled: queryEnabled,
      staleTime: 20_000,
    },
  );

  const apiItems: GymOption[] = useMemo(() => {
    const raw = gymsRes?.payload?.items ?? [];
    return raw.map((g) => ({
      id: g.id,
      name: g.name,
      address: g.address,
    }));
  }, [gymsRes?.payload?.items]);

  const filteredItems = useMemo(() => {
    if (isPendingDebounce) return [];
    if (!debounced) return apiItems;
    return filterGymsByQuery(apiItems, debounced);
  }, [apiItems, debounced, isPendingDebounce]);

  const value = useMemo((): GymOption | null => {
    if (!gymId || !gymName) return null;
    return { id: gymId, name: gymName, address: null };
  }, [gymId, gymName]);

  const mergedItems = useMemo(() => {
    if (isPendingDebounce) return [];
    if (!value) return filteredItems;
    if (filteredItems.some((i) => i.id === value.id)) return filteredItems;
    return [value, ...filteredItems];
  }, [filteredItems, isPendingDebounce, value]);

  const emptyContent = isPendingDebounce
    ? "검색 중…"
    : isFetching
      ? "검색 중…"
      : "결과가 없습니다.";

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
        items={mergedItems}
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
        onInputValueChange={setSearchQuery}
        itemToStringLabel={(g) => g.name}
        getItemKey={(g) => g.id}
        isItemEqualToValue={(a, b) => a.id === b.id}
        renderItem={(item) => (
          <span className="min-w-0 font-medium break-words">{item.name}</span>
        )}
        placeholder="암장 이름을 입력하세요"
        emptyContent={emptyContent}
      />
    </FormHelper>
  );
};

export default RecordGymSearchField;
