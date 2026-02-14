import { startOfWeek, endOfWeek } from "date-fns";

/** 이번주 월요일 날짜 반환 */
export const getThisWeekMonday = () => {
  return startOfWeek(new Date(), { weekStartsOn: 1 });
};

/** 이번주 일요일 날짜 반환 */
export const getThisWeekSunday = () => {
  return endOfWeek(new Date(), { weekStartsOn: 1 });
};
