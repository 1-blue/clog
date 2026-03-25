"use server";

import { revalidateTag } from "next/cache";

export const revalidateTagForServer = async (tags: string[]) => {
  tags.forEach((tag) => revalidateTag(tag, "max"));
};
