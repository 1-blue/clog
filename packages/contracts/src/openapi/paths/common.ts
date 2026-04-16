import type { ZodTypeAny } from "zod";

import { z } from "../registry";

/** 단건 응답 envelope: `{ payload }` */
export const singleResponse = <T extends ZodTypeAny>(payload: T) =>
  z.object({ payload });

/** 페이지네이션 응답 envelope: `{ payload: { items, nextCursor } }` */
export const paginatedResponse = <T extends ZodTypeAny>(item: T) =>
  z.object({
    payload: z.object({
      items: z.array(item),
      nextCursor: z.string().nullable(),
    }),
  });

/** toast + payload 응답 envelope (mutation 성공 메시지 포함) */
export const toastResponse = <T extends ZodTypeAny>(payload: T) =>
  z.object({
    toast: z
      .object({
        type: z.enum(["success", "error", "info"]).optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
    payload,
  });

export const okResponse = z.object({ payload: z.object({}).passthrough() });

export const uuidParam = (name: string) =>
  z.object({ [name]: z.string().uuid() });
