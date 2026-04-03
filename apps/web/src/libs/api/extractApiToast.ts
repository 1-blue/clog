/** openapi-fetch / mutation onError에서 `{ toast }` JSON 본문 추출 */
export const extractApiToastAsync = async (
  err: unknown,
): Promise<string | null> => {
  if (!err || typeof err !== "object") return null;
  const o = err as Record<string, unknown>;

  const res = o.response as Response | undefined;
  if (res && typeof res.json === "function") {
    try {
      const j = (await res.clone().json()) as { toast?: string };
      if (typeof j.toast === "string" && j.toast.length > 0) return j.toast;
    } catch {
      /* empty */
    }
  }

  if (typeof o.message === "string" && o.message.length > 0) {
    return o.message;
  }

  return null;
};
