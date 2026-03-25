import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

/** yyyy-MM-dd → 한국어 긴 날짜 (툴팁·선택 영역) */
export const formatYmdLongKorean = (ymd: string): string => {
  return format(parseISO(`${ymd}T12:00:00`), "PPP EEEE", { locale: ko });
};
