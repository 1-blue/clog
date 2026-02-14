import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Constants } from "@clog/db";

const gymCityEnum = Constants.public.Enums.gym_city_enum;

const problemTypeEnum = Constants.public.Enums.problem_type_enum;

const gymStatusEnum = Constants.public.Enums.gym_status_enum;

// Zod 스키마 정의
const gymFormSchema = z.object({
  /** 암장 이름 (필수, 100자 이하) */
  name: z
    .string()
    .min(1, "암장 이름을 입력해주세요")
    .max(100, "암장 이름은 100자 이내로 입력해주세요"),

  /** 주소 (필수, 200자 이하) */
  address: z
    .string()
    .min(1, "주소를 입력해주세요")
    .max(200, "주소는 200자 이내로 입력해주세요"),

  /** 시/도 (필수, enum) */
  city: z.enum(gymCityEnum, {
    message: "시/도를 선택해주세요",
  }),

  /** 시/군/구 (필수, 50자 이하) */
  district: z
    .string()
    .min(1, "시/군/구를 입력해주세요")
    .max(50, "시/군/구는 50자 이내로 입력해주세요"),

  /** 전화번호 (필수, 전화번호 형식) */
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(
      /^(\d{2,3}-\d{3,4}-\d{4}|\d{10,11})$/,
      "올바른 전화번호 형식이 아닙니다 (예: 02-1234-5678 또는 01012345678)"
    ),

  /** 평일 시작 시간 (필수, HH:MM 형식) */
  weekday_start: z
    .string()
    .min(1, "평일 시작 시간을 입력해주세요")
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "올바른 시간 형식이 아닙니다 (HH:MM)"
    ),

  /** 평일 종료 시간 (필수, HH:MM 형식) */
  weekday_end: z
    .string()
    .min(1, "평일 종료 시간을 입력해주세요")
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "올바른 시간 형식이 아닙니다 (HH:MM)"
    ),

  /** 주말 시작 시간 (필수, HH:MM 형식) */
  weekend_start: z
    .string()
    .min(1, "주말 시작 시간을 입력해주세요")
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "올바른 시간 형식이 아닙니다 (HH:MM)"
    ),

  /** 주말 종료 시간 (필수, HH:MM 형식) */
  weekend_end: z
    .string()
    .min(1, "주말 종료 시간을 입력해주세요")
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "올바른 시간 형식이 아닙니다 (HH:MM)"
    ),

  /** 층수 (필수, 양의 정수) */
  floors: z
    .number()
    .int("층수는 정수로 입력해주세요")
    .positive("층수는 양수여야 합니다"),

  /** 면적 (필수, 양수, ㎡) */
  size_sqm: z.number().positive("면적은 양수여야 합니다"),

  /** 1회 이용료 (필수, 0 이상 정수) */
  single_price: z
    .number()
    .int("가격은 정수로 입력해주세요")
    .nonnegative("가격은 0 이상이어야 합니다"),

  /** 10회 이용료 (필수, 0 이상 정수) */
  ten_times_price: z
    .number()
    .int("가격은 정수로 입력해주세요")
    .nonnegative("가격은 0 이상이어야 합니다"),

  /** 월 이용료 (필수, 0 이상 정수) */
  monthly_price: z
    .number()
    .int("가격은 정수로 입력해주세요")
    .nonnegative("가격은 0 이상이어야 합니다"),

  /** 주차장 보유 여부 */
  has_parking: z.boolean(),
  /** 락커 보유 여부 */
  has_locker: z.boolean(),
  /** 샤워실 보유 여부 */
  has_shower: z.boolean(),
  /** 카페 보유 여부 */
  has_cafe: z.boolean(),
  /** 샵 보유 여부 */
  has_shop: z.boolean(),
  /** 족욕 보유 여부 */
  has_footbath: z.boolean(),
  /** 지구력 보유 여부 */
  has_endurance: z.boolean(),
  /** 리드 보유 여부 */
  has_lead: z.boolean(),

  /** 문제 타입 (필수, 다중 선택 배열) */
  problem_types: z
    .array(z.enum(problemTypeEnum))
    .min(1, "최소 1개 이상의 문제 타입을 선택해주세요"),

  /** 상태 (enum) */
  status: z.enum(gymStatusEnum),
});

export type GymFormValues = z.infer<typeof gymFormSchema>;

const useAdminGymForm = () => {
  const form = useForm<GymFormValues>({
    resolver: zodResolver(gymFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "seoul",
      district: "",
      phone: "",
      weekday_start: "09:00",
      weekday_end: "22:00",
      weekend_start: "10:00",
      weekend_end: "21:00",
      floors: 1,
      size_sqm: 40,
      single_price: 20000,
      ten_times_price: 170000,
      monthly_price: 130000,
      has_parking: true,
      has_locker: false,
      has_shower: true,
      has_cafe: false,
      has_shop: false,
      has_footbath: true,
      has_endurance: true,
      has_lead: false,
      problem_types: ["dyno", "balance", "overhang"],
      status: "pending",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return form;
};

export default useAdminGymForm;
