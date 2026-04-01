"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileEditSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해 주세요.")
    .max(20, "닉네임은 20자 이하여야 합니다."),
  bio: z.string().max(200, "한 줄 소개는 200자 이하여야 합니다."),
  instagramId: z
    .string()
    .max(50, "인스타그램 아이디는 50자 이하여야 합니다."),
  youtubeUrl: z.string().max(200, "URL은 200자 이하여야 합니다."),
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
