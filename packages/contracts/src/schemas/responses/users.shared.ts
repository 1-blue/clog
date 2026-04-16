import { z } from "../../openapi/registry";

export const AuthorSummary = z
  .object({
    id: z.string().uuid(),
    nickname: z.string(),
    profileImage: z.string().nullable(),
  })
  .openapi("AuthorSummary");

export const HomeGymSummary = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
  })
  .openapi("HomeGymSummary");
