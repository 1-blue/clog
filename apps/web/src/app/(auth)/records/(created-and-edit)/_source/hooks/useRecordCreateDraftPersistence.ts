"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import type { TRecordFormData } from "./useRecordForm";
import {
  formValuesToDraftSlice,
  getDefaultRecordCreateFormValues,
  mergeDefaultsWithDraft,
  readRecordCreateDraftBucket,
  upsertRecordCreateDraftForDate,
} from "../utils/record-create-draft-storage";

const DEBOUNCE_MS = 400;

/**
 * 기록 **생성** 폼만: localStorage에 날짜별 초안 저장·복구.
 * 날짜 변경 시 이전 날짜 스냅샷은 `onBeforeDateYmdChange`에서 flush 한 뒤 `dateYmd`를 바꿔야 함.
 */
export const useRecordCreateDraftPersistence = (
  methods: UseFormReturn<TRecordFormData>,
) => {
  const { control, reset, getValues } = methods;
  const dateYmd = useWatch({ control, name: "dateYmd" });
  const prevDateYmdRef = useRef<string | undefined>(undefined);
  const allValues = useWatch({ control });
  const [persistenceReady, setPersistenceReady] = useState(false);

  const flushCurrentDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    const v = getValues();
    const y = v.dateYmd;
    if (!y || !/^\d{4}-\d{2}-\d{2}$/.test(y)) return;
    upsertRecordCreateDraftForDate(y, formValuesToDraftSlice(v));
  }, [getValues]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const y = getValues("dateYmd");
    prevDateYmdRef.current = y;

    if (y && /^\d{4}-\d{2}-\d{2}$/.test(y)) {
      const bucket = readRecordCreateDraftBucket();
      const draft = bucket?.byDate[y];
      if (draft) {
        const base = getDefaultRecordCreateFormValues(y);
        reset(mergeDefaultsWithDraft(base, draft), { keepDefaultValues: false });
      }
    }

    setPersistenceReady(true);
    // 클라이언트 마운트 1회만 — RHF getValues/reset은 안정 참조
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!persistenceReady) return;
    if (dateYmd === prevDateYmdRef.current) return;

    prevDateYmdRef.current = dateYmd;
    const bucket = readRecordCreateDraftBucket();
    const draft = bucket?.byDate[dateYmd];
    const base = getDefaultRecordCreateFormValues(dateYmd);
    const merged = draft ? mergeDefaultsWithDraft(base, draft) : base;
    reset(merged, { keepDefaultValues: false });
  }, [dateYmd, persistenceReady, reset]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!persistenceReady) return;

    const t = window.setTimeout(() => {
      const v = getValues();
      if (!v.dateYmd || !/^\d{4}-\d{2}-\d{2}$/.test(v.dateYmd)) return;
      upsertRecordCreateDraftForDate(v.dateYmd, formValuesToDraftSlice(v));
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(t);
  }, [allValues, getValues, persistenceReady]);

  return { onBeforeDateYmdChange: flushCurrentDraft };
};
