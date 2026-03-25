/** seed `openHours` JSON: `{ lines: string[] }` */
export function parseOpenHoursLines(openHours: unknown): string[] {
  if (!openHours || typeof openHours !== "object") return [];
  const lines = (openHours as { lines?: unknown }).lines;
  if (!Array.isArray(lines)) return [];
  return lines.filter((l): l is string => typeof l === "string");
}
