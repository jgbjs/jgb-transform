/**
 * 获取当前页面
 */
export function getCurrentPage() {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    return pages[pages.length - 1]
  }
}
