import type { Prisma } from "@clog/db";

type TTx = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export const resolveSessionImageUrlsForDb = async (
  tx: TTx,
  gymId: string,
  imageUrls: string[] | undefined,
): Promise<string[] | undefined> => {
  if (imageUrls === undefined) return undefined;
  if (imageUrls.length > 0) return imageUrls;
  const gym = await tx.gym.findUnique({
    where: { id: gymId },
    select: { logoImageUrl: true },
  });
  if (gym?.logoImageUrl) return [gym.logoImageUrl];
  return [];
};
