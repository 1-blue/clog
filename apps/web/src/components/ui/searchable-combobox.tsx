"use client";

import { Combobox } from "@base-ui/react/combobox";
import { MapPin, Search } from "lucide-react";
import * as React from "react";

import { cn } from "#web/libs/utils";

export interface ISearchableComboboxProps<TItem> {
  items: readonly TItem[];
  value: TItem | null;
  onValueChange: (value: TItem | null) => void;
  onInputValueChange?: (inputValue: string) => void;
  itemToStringLabel: (item: TItem) => string;
  /** 항목 동일성 (기본: getItemKey 결과 비교) */
  isItemEqualToValue?: (a: TItem, b: TItem) => boolean;
  getItemKey: (item: TItem) => string;
  renderItem: (item: TItem) => React.ReactNode;
  /** 목록이 비었을 때 (Combobox.Empty) */
  emptyContent?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  /** @default false */
  modal?: boolean;
  /** @default true */
  autoHighlight?: boolean;
}

const defaultInputClass =
  "h-12 w-full rounded-2xl border border-outline-variant/40 bg-surface-container-high py-3 pr-11 pl-11 text-sm text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none";

function SearchableComboboxInner<TItem>(
  props: ISearchableComboboxProps<TItem>,
) {
  const {
    items,
    value,
    onValueChange,
    onInputValueChange,
    itemToStringLabel,
    isItemEqualToValue: isItemEqualToValueProp,
    getItemKey,
    renderItem,
    emptyContent = "검색 결과가 없어요",
    placeholder = "검색어를 입력하세요",
    disabled,
    className,
    inputClassName,
    modal = false,
    autoHighlight = true,
  } = props;

  const list = items as TItem[];
  const isItemEqualToValue =
    isItemEqualToValueProp ??
    ((a: TItem, b: TItem) => getItemKey(a) === getItemKey(b));

  return (
    <Combobox.Root<TItem, false>
      items={list}
      filteredItems={list}
      filter={null}
      autoComplete="none"
      autoHighlight={autoHighlight}
      value={value}
      onValueChange={onValueChange}
      onInputValueChange={onInputValueChange}
      isItemEqualToValue={isItemEqualToValue}
      itemToStringLabel={itemToStringLabel}
      modal={modal}
      disabled={disabled}
    >
      <div className={cn("relative", className)}>
        <Combobox.Input
          placeholder={placeholder}
          className={cn(defaultInputClass, inputClassName)}
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
              "box-border max-h-[min(var(--available-height),15rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] min-w-0",
              "origin-[var(--transform-origin)] overflow-y-auto overscroll-contain",
              "rounded-2xl border border-outline-variant bg-popover py-2 text-on-surface shadow-lg",
              "scroll-pt-2 scroll-pb-2 outline-none",
            )}
          >
            <Combobox.Empty className="px-4 py-6 text-center text-sm leading-snug text-muted-foreground empty:hidden">
              {emptyContent}
            </Combobox.Empty>
            <Combobox.List className="outline-none">
              {(item: TItem) => (
                <Combobox.Item
                  key={getItemKey(item)}
                  value={item}
                  className="grid w-full min-w-0 cursor-default grid-cols-1 px-4 py-2.5 text-left text-sm text-on-surface outline-none select-none data-highlighted:bg-surface-container-high"
                >
                  {renderItem(item)}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

/** Base UI 검색 콤보 — 암장 검색 등 공통 UI (폼/데이터는 부모에서 연결) */
const SearchableCombobox = SearchableComboboxInner as <TItem>(
  props: ISearchableComboboxProps<TItem>,
) => React.JSX.Element;

export default SearchableCombobox;
