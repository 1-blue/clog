/** 이번주 월요일 날짜 반환 */
export const getThisWeekMonday = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
};

/** 이번주 일요일 날짜 반환 */
export const getThisWeekSunday = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const sunday = new Date(now);
  sunday.setDate(now.getDate() + diffToSunday);
  sunday.setHours(23, 59, 59, 999);

  return sunday;
};
