import { prisma } from "@clog/db/prisma";

export type TLinkedProvider = "KAKAO" | "GOOGLE";

const providerToLabel = (provider: string): TLinkedProvider | null => {
  const p = provider.toLowerCase();
  if (p === "google") return "GOOGLE";
  if (p === "kakao") return "KAKAO";
  return null;
};

/** NextAuth `Account.provider` 문자열 → API 응답용 enum 라벨 */
export const linkedProvidersFromAccountRows = (
  accounts: { provider: string }[],
): TLinkedProvider[] => {
  const set = new Set<TLinkedProvider>();
  for (const a of accounts) {
    const label = providerToLabel(a.provider);
    if (label) set.add(label);
  }
  return [...set];
};

export const getLinkedProvidersForUserId = async (
  userId: string,
): Promise<TLinkedProvider[]> => {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true },
  });
  return linkedProvidersFromAccountRows(accounts);
};

export const formatLinkedProviders = (providers: TLinkedProvider[]): string =>
  providers
    .map((p) => (p === "KAKAO" ? "카카오" : "구글"))
    .join(", ") || "—";
