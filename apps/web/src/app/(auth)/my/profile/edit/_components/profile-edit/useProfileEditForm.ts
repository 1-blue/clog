"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileEditSchema = z.object({
  nickname: z.string().min(1).max(20),
  bio: z.string().max(200),
  instagramId: z.string().max(50),
  youtubeUrl: z.string().max(200),
});

export type TProfileEditFormData = z.infer<typeof profileEditSchema>;

interface IOptions {
  defaultValues: TProfileEditFormData;
}

const useProfileEditForm = ({ defaultValues }: IOptions) => {
  return useForm<TProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues,
    mode: "onChange",
  });
};

export default useProfileEditForm;
