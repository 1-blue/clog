import { z } from "zod";

import {
  attemptResultEnum,
  difficultyEnum,
  normalizeSessionTimeRange,
  RECORD_CREATE_DRAFT_LOCAL_STORAGE_KEY,
} from "@clog/utils";

import type { TRecordFormData } from "../hooks/useRecordForm";

const DEFAULT_TIMES = normalizeSessionTimeRange(10 * 60 + 30, 14 * 60);

const draftRouteSchema = z.object({
  difficulty: difficultyEnum,
  result: attemptResultEnum,
  attempts: z.number().int().min(1),
  memo: z.string().max(200).optional(),
});

export const recordCreateDraftSliceSchema = z.object({
  gymId: z.string().optional(),
  gymName: z.string().optional(),
  dateYmd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startMinutes: z.number().int().optional(),
  endMinutes: z.number().int().optional(),
  memo: z.string().optional(),
  isPublic: z.boolean().optional(),
  routes: z.array(draftRouteSchema).optional(),
  imageUrls: z.array(z.string()).max(10).optional(),
});

export type TRecordCreateDraftSlice = z.infer<typeof recordCreateDraftSliceSchema>;

const bucketSchema = z.object({
  v: z.literal(1),
  byDate: z.record(z.string(), recordCreateDraftSliceSchema),
});

export type TRecordCreateDraftBucket = z.infer<typeof bucketSchema>;

export const getDefaultRecordCreateFormValues = (
  dateYmd: string,
): TRecordFormData => ({
  gymId: "",
  gymName: "",
  dateYmd,
  startMinutes: DEFAULT_TIMES.startMinutes,
  endMinutes: DEFAULT_TIMES.endMinutes,
  memo: "",
  isPublic: true,
  routes: [],
  imageUrls: [],
});

export const readRecordCreateDraftBucket = (): TRecordCreateDraftBucket | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RECORD_CREATE_DRAFT_LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const r = bucketSchema.safeParse(parsed);
    return r.success ? r.data : null;
  } catch {
    return null;
  }
};

export const writeRecordCreateDraftBucket = (bucket: TRecordCreateDraftBucket) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      RECORD_CREATE_DRAFT_LOCAL_STORAGE_KEY,
      JSON.stringify(bucket),
    );
  } catch {
    // quota / 비공개 모드
  }
};

export const upsertRecordCreateDraftForDate = (
  dateYmd: string,
  slice: TRecordCreateDraftSlice,
) => {
  const prev = readRecordCreateDraftBucket() ?? { v: 1 as const, byDate: {} };
  writeRecordCreateDraftBucket({
    v: 1,
    byDate: { ...prev.byDate, [dateYmd]: slice },
  });
};

export const removeRecordCreateDraftForDate = (dateYmd: string) => {
  const prev = readRecordCreateDraftBucket();
  if (!prev?.byDate[dateYmd]) return;
  const nextByDate = { ...prev.byDate };
  delete nextByDate[dateYmd];
  writeRecordCreateDraftBucket({ v: 1, byDate: nextByDate });
};

export const formValuesToDraftSlice = (
  v: TRecordFormData,
): TRecordCreateDraftSlice => ({
  gymId: v.gymId || undefined,
  gymName: v.gymName || undefined,
  dateYmd: v.dateYmd,
  startMinutes: v.startMinutes,
  endMinutes: v.endMinutes,
  memo: v.memo === "" ? undefined : v.memo,
  isPublic: v.isPublic,
  routes: v.routes?.length ? v.routes : undefined,
  imageUrls: v.imageUrls?.length ? v.imageUrls : undefined,
});

export const mergeDefaultsWithDraft = (
  base: TRecordFormData,
  draft: TRecordCreateDraftSlice,
): TRecordFormData => ({
  ...base,
  gymId: draft.gymId ?? base.gymId,
  gymName: draft.gymName ?? base.gymName,
  dateYmd: draft.dateYmd ?? base.dateYmd,
  startMinutes: draft.startMinutes ?? base.startMinutes,
  endMinutes: draft.endMinutes ?? base.endMinutes,
  memo: draft.memo ?? base.memo,
  isPublic: draft.isPublic ?? base.isPublic,
  routes: draft.routes ?? base.routes,
  imageUrls: draft.imageUrls ?? base.imageUrls ?? [],
});
