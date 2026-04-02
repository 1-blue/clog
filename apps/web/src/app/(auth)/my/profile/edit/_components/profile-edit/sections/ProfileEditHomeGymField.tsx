"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import { openapi } from "#web/apis/openapi";
import SearchableCombobox from "#web/components/ui/searchable-combobox";

import type { TProfileEditFormData } from "../useProfileEditForm";

type TGymPick = {
  id: string;
  name: string;
  address: string | null;
};

const ProfileEditHomeGymField = () => {
  const { control, setValue } = useFormContext<TProfileEditFormData>();
  const homeGymId = useWatch({ control, name: "homeGymId" });
  const homeGymName = useWatch({ control, name: "homeGymName" });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = window.setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      350,
    );
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  const trimmedInput = searchQuery.trim();
  const debounced = debouncedSearch.trim();

  /**
   * 디바운스가 아직 입력을 따라잡지 못한 구간 — 이전 요청(예: "구"만 검색) 결과가
   * 화면의 "구로"와 맞지 않으므로 목록을 비움.
   */
  const isPendingDebounce =
    trimmedInput.length >= 1 && trimmedInput !== debounced;

  /** 입력이 비었을 때만 전체 목록(첫 페이지) */
  const fetchBrowseAll = trimmedInput.length === 0;
  /** 디바운스가 입력과 일치할 때만 검색(부분 문자열로 API를 치지 않음) */
  const fetchWithSearch =
    trimmedInput.length >= 1 && trimmedInput === debounced;

  const queryEnabled = fetchBrowseAll || fetchWithSearch;

  const { data: gymsRes, isFetching } = openapi.useQuery(
    "get",
    "/api/v1/gyms",
    {
      params: {
        query: {
          limit: fetchWithSearch ? 20 : 50,
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

  const apiItems: TGymPick[] = useMemo(() => {
    const raw = gymsRes?.payload?.items ?? [];
    return raw.map((g) => ({
      id: g.id,
      name: g.name,
      address: g.address ?? null,
    }));
  }, [gymsRes?.payload?.items]);

  const selected = useMemo((): TGymPick | null => {
    if (!homeGymId || !homeGymName) return null;
    return { id: homeGymId, name: homeGymName, address: null };
  }, [homeGymId, homeGymName]);

  const mergedItems = useMemo(() => {
    if (isPendingDebounce) return [];
    if (!selected) return apiItems;
    if (apiItems.some((i) => i.id === selected.id)) return apiItems;
    return [selected, ...apiItems];
  }, [apiItems, isPendingDebounce, selected]);

  const emptyContent = isPendingDebounce
    ? "검색 중…"
    : isFetching
      ? "검색 중…"
      : "결과가 없습니다.";

  return (
    <SearchableCombobox<TGymPick>
      items={mergedItems}
      value={selected}
      onValueChange={(g) => {
        setValue("homeGymId", g?.id ?? null, { shouldDirty: true });
        setValue("homeGymName", g?.name ?? "", { shouldDirty: true });
      }}
      onInputValueChange={setSearchQuery}
      itemToStringLabel={(g) => g.name}
      getItemKey={(g) => g.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      renderItem={(item) => (
        <>
          <span className="wrap-break-words min-w-0 font-medium">
            {item.name}
          </span>
          {item.address ? (
            <span className="block truncate text-xs text-muted-foreground">
              {item.address}
            </span>
          ) : null}
        </>
      )}
      emptyContent={emptyContent}
      placeholder="암장 이름을 입력하세요"
    />
  );
};

export default ProfileEditHomeGymField;
