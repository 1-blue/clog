"use client";

import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import FormHelper from "#web/components/shared/FormHelper";
import YmdSheetDateField from "#web/components/shared/YmdSheetDateField";
import { Button } from "#web/components/ui/button";
import { buttonVariants } from "#web/components/ui/button-variants";
import SearchableCombobox from "#web/components/ui/searchable-combobox";
import { Textarea } from "#web/components/ui/textarea";
import { ROUTES } from "#web/constants";
import useMembershipMutations from "#web/hooks/mutations/memberships/useMembershipMutations";
import { extractApiToastAsync } from "#web/libs/api/extractApiToast";
import { membershipPlanCodeLabel } from "#web/libs/membership/planLabels";

type TGymListItem = components["schemas"]["GymListItem"];
type TGymPick = Pick<TGymListItem, "id" | "name" | "address">;
type TGymPlan = components["schemas"]["GymMembershipPlan"];

const filterGymPicksByQuery = (items: TGymPick[], q: string): TGymPick[] => {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter(
    (g) =>
      g.name.toLowerCase().includes(needle) ||
      (g.address?.toLowerCase().includes(needle) ?? false),
  );
};

const MembershipNewMain = () => {
  const router = useRouter();
  const { createMutation } = useMembershipMutations();

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
      address: g.address,
    }));
  }, [gymsRes?.payload?.items]);

  const filteredItems = useMemo(() => {
    if (isPendingDebounce) return [];
    if (!debounced) return apiItems;
    return filterGymPicksByQuery(apiItems, debounced);
  }, [apiItems, debounced, isPendingDebounce]);

  const [gym, setGym] = useState<TGymPick | null>(null);
  const mergedItems = useMemo(() => {
    if (isPendingDebounce) return [];
    if (!gym) return filteredItems;
    if (filteredItems.some((i) => i.id === gym.id)) return filteredItems;
    return [gym, ...filteredItems];
  }, [filteredItems, gym, isPendingDebounce]);

  const { data: plans = [] } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}/membership-plans",
    { params: { path: { gymId: gym?.id ?? "" } } },
    {
      enabled: Boolean(gym?.id),
      select: (d) => d.payload ?? [],
    },
  );

  const planRows = (plans as TGymPlan[]).filter((p) => p.code !== "COUNT_DAY");
  const [planId, setPlanId] = useState("");
  const [startedDateYmd, setStartedDateYmd] = useState(
    () => new Date().toISOString().split("T")[0]!,
  );
  const [note, setNote] = useState("");

  const canSubmit = Boolean(
    gym && planId && /^\d{4}-\d{2}-\d{2}$/.test(startedDateYmd),
  );

  const onSubmit = () => {
    if (!gym || !planId) return;
    createMutation.mutate(
      {
        body: {
          gymId: gym.id,
          planId,
          startedDateYmd,
          ...(note.trim() ? { note: note.trim() } : {}),
        },
      },
      {
        onSuccess: () => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.replace(ROUTES.MY.MEMBERSHIPS.path);
          }
        },
        onError: async (e) => {
          toast.error(
            (await extractApiToastAsync(e)) ?? "회원권 등록에 실패했습니다.",
          );
        },
      },
    );
  };

  const emptyContent = isPendingDebounce
    ? "검색 중…"
    : isFetching
      ? "검색 중…"
      : "결과가 없습니다.";

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-10">
      <TopBar title="회원권 등록" />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 pt-4">
        <FormHelper label="암장" cloneChild={false}>
          <SearchableCombobox<TGymPick>
            items={mergedItems}
            value={gym}
            onValueChange={(next) => {
              setGym(next);
              setPlanId("");
            }}
            onInputValueChange={setSearchQuery}
            itemToStringLabel={(g) => g.name}
            getItemKey={(g) => g.id}
            isItemEqualToValue={(a, b) => a.id === b.id}
            renderItem={(item) => (
              <span className="min-w-0 font-medium break-words">
                {item.name}
              </span>
            )}
            placeholder="암장 검색"
            emptyContent={emptyContent}
          />
        </FormHelper>

        {gym && planRows.length > 0 ? (
          <FormHelper label="상품" cloneChild={false}>
            <div className="flex flex-col gap-2">
              {planRows.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanId(p.id)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    planId === p.id
                      ? "border-primary bg-primary-container/30"
                      : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  <span>{membershipPlanCodeLabel(p.code)}</span>
                  <span className="font-semibold">
                    {p.priceWon.toLocaleString("ko-KR")}원
                  </span>
                </button>
              ))}
            </div>
          </FormHelper>
        ) : null}

        {gym && planRows.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            이 암장에 등록된 요금표가 없어요.
          </p>
        ) : null}

        <YmdSheetDateField
          label="시작일"
          sheetTitle="시작일 선택"
          valueYmd={startedDateYmd}
          onChangeYmd={setStartedDateYmd}
          disableFuture
        />

        <FormHelper label="메모 (선택)" cloneChild={false}>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="rounded-xl border-outline-variant/40"
            placeholder="메모"
          />
        </FormHelper>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={ROUTES.MY.MEMBERSHIPS.path}
            className={buttonVariants({
              variant: "outline",
              className: "h-11 w-full min-w-0 justify-center rounded-xl",
            })}
          >
            취소
          </Link>
          <Button
            className="h-11 w-full min-w-0 cursor-pointer justify-center rounded-xl"
            disabled={!canSubmit || createMutation.isPending}
            onClick={onSubmit}
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembershipNewMain;
