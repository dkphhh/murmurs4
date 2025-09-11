/**
 * 将 "YYYY-MM-DD HH:mm:ss" 转化为 "YYYY-MM-DDTHH:mm:ss+08:00"
 * @param input 原始时间字符串，例如 "2025-09-02 16:26:56"
 * @param offset 时区偏移，默认 "+08:00"
 * @returns 格式化后的带时区时间字符串
 */
export function convertDatetimeTextToIsoWithOffset(
  input: string,
  offset = "+08:00",
): string {
  const m = input.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.\d+)?$/,
  );
  if (!m) throw new Error(`时间格式不符合预期: ${input}`);
  return `${m[1]}T${m[2]}${offset}`;
}

/**
 * 将给定的 Date 对象格式化为类似 ISO 的日期时间字符串（不含毫秒与时区信息）。
 *
 * 格式: "YYYY-MM-DD HH:mm:ss"（各字段会补零至固定宽度）。
 *
 * @param d - 要格式化的 Date 对象（使用本地时间的年、月、日、时、分、秒）。
 * @returns 格式化后的字符串，例如 "2025-09-03T14:05:09"。
 *
 * @remarks
 * - 函数基于本地时间的 getFullYear/getMonth/getDate/getHours/getMinutes/getSeconds 生成字符串。
 * - 不会包含毫秒（.sss）和时区偏移（例如 "+08:00" 或 "Z"）。尽管函数名包含 "WithOffset"，当前实现并未附加任何时区偏移信息。
 * - 注意 JavaScript 中的月份索引从 0 开始，函数内部已对月份进行了 +1 以输出常见的 1-12 表示。
 *
 * @example
 * const s = formatIsoWithOffset(new Date(2025, 8, 3, 14, 5, 9));
 * // s === "2025-09-03 14:05:09"
 */
export function formatDatetimeToText(d: Date) {
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

export function isThisDateTime(s: string): boolean {
  try {
    const d = new Date(s);
    return !isNaN(d.getTime());
  } catch {
    return false;
  }
}
