import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { z } from "zod";

import {
  attemptResultEnum,
  difficultyEnum,
  normalizeSessionTimeRange,
  SESSION_MAX_MINUTES,
  SESSION_MIN_MINUTES,
} from "@clog/utils";

/** default/optional 없이 폼 전용으로 정의 — zodResolver 타입 불일치 방지 */
const routeFormSchema = z.object({
  difficulty: difficultyEnum,
  result: attemptResultEnum,
  attempts: z.number().int().min(1),
  memo: z.string().max(200).optional(),
});

const recordFormSchema = z.object({
  gymId: z.string().min(1, "암장을 선택해주세요"),
  gymName: z.string().optional(),
  dateYmd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startMinutes: z
    .number()
    .int()
    .min(SESSION_MIN_MINUTES)
    .max(SESSION_MAX_MINUTES),
  endMinutes: z
    .number()
    .int()
    .min(SESSION_MIN_MINUTES)
    .max(SESSION_MAX_MINUTES),
  memo: z.string().max(500).optional(),
  isPublic: z.boolean(),
  routes: z.array(routeFormSchema).min(0),
  imageUrls: z.array(z.string()).max(10, "사진은 최대 10장까지 추가할 수 있어요").optional(),
  /** 빈 문자열이면 미연결 */
  userMembershipId: z.string().optional(),
  /** 빈 문자열이면 체크인 미연결 */
  gymCheckInId: z.string().optional(),
});

export type TRecordFormData = z.infer<typeof recordFormSchema>;

const DEFAULT_TIMES = normalizeSessionTimeRange(10 * 60 + 30, 14 * 60);

const useRecordForm = (props?: Partial<UseFormProps<TRecordFormData>>) => {
  const { defaultValues: defaultValuesOverride, ...rest } = props ?? {};

  return useForm<TRecordFormData>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      gymId: "",
      gymName: "",
      dateYmd: new Date().toISOString().split("T")[0]!,
      startMinutes: DEFAULT_TIMES.startMinutes,
      endMinutes: DEFAULT_TIMES.endMinutes,
      memo: "",
      isPublic: true,
      routes: [],
      imageUrls: [],
      userMembershipId: "",
      gymCheckInId: "",
      ...defaultValuesOverride,
    },
    mode: "onChange",
    ...rest,
  });
};

export default useRecordForm;
