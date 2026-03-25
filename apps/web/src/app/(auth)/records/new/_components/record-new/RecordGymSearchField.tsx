"use client";

import { Combobox } from "@base-ui/react/combobox";
import { MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { components } from "#web/@types/openapi";
import { openapi } from "#web/apis/openapi";
import { cn } from "#web/libs/utils";

type GymListItem = components["schemas"]["GymListItem"];
type GymOption = Pick<GymListItem, "id" | "name">;

interface IProps {
  gymId: string;
  gymName: string;
  onSelect: (id: string, name: string) => void;
  className?: string;
}

const RecordGymSearchField = ({
  gymId,
  gymName,
  onSelect,
  className,
}: IProps) => {
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
    <div className={cn("space-y-2", className)}>
      <span className="text-xs font-bold tracking-wider text-outline uppercase">
        암장 찾기
      </span>
      <Combobox.Root<GymOption, false>
        items={items}
        filteredItems={items}
        filter={null}
        autoComplete="none"
        autoHighlight
        value={value}
        onValueChange={(next) => {
          if (next) onSelect(next.id, next.name);
          else onSelect("", "");
        }}
        onInputValueChange={(v) => setDraft(v)}
        isItemEqualToValue={(a, b) => a.id === b.id}
        itemToStringLabel={(g) => g.name}
        modal={false}
      >
        <div className="relative">
          <Combobox.Input
            placeholder="암장 이름을 입력하세요"
            className="h-12 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-high py-3 pr-11 pl-11 text-sm text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none"
          />
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-on-surface-variant"
            strokeWidth={2}
            aria-hidden
          />
          <MapPin
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-on-surface-variant"
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <Combobox.Portal>
          <Combobox.Positioner
            side="bottom"
            sideOffset={6}
            align="start"
            className="z-50 outline-none"
          >
            <Combobox.Popup
              className={cn(
                "box-border max-h-[min(var(--available-height),15rem)] max-w-[var(--available-width)] w-[var(--anchor-width)] min-w-0",
                "origin-[var(--transform-origin)] overflow-y-auto overscroll-contain",
                "rounded-2xl border border-outline-variant bg-popover py-2 text-on-surface shadow-lg",
                "scroll-pt-2 scroll-pb-2 outline-none",
              )}
            >
              <Combobox.Empty className="px-4 py-6 text-center text-sm leading-snug text-muted-foreground empty:hidden">
                검색 결과가 없어요
              </Combobox.Empty>
              <Combobox.List className="outline-none">
                {(item: GymOption) => (
                  <Combobox.Item
                    key={item.id}
                    value={item}
                    className="grid w-full min-w-0 cursor-default select-none grid-cols-1 px-4 py-2.5 text-left text-sm text-on-surface outline-none data-highlighted:bg-surface-container-high"
                  >
                    <span className="min-w-0 font-medium break-words">
                      {item.name}
                    </span>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
};

export default RecordGymSearchField;
