export type TLinkedProvider = "KAKAO" | "GOOGLE";

/** Supabase Auth `identities` → 연동 provider 목록 */
export const linkedProvidersFromSupabase = (
  identities: { provider?: string }[] | null | undefined,
): TLinkedProvider[] => {
  const set = new Set<TLinkedProvider>();
  for (const id of identities ?? []) {
    const p = id.provider?.toLowerCase();
    if (p === "kakao") set.add("KAKAO");
    if (p === "google") set.add("GOOGLE");
  }
  return [...set];
};

export const formatLinkedProviders = (
  providers: TLinkedProvider[],
): string =>
  providers.length > 0 ? providers.join(", ") : "알 수 없음";
