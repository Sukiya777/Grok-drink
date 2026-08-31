/** 触感反馈：仅手机等有振动硬件时生效，桌面端静默跳过。
 *  pattern 单位为毫秒。 */
export function haptic(pattern: number | number[] = 12) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    /* iOS Safari 无 vibrate：什么都不做 */
  }
}
