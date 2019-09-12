import { getCurrentPage } from '../utils/getCurrentPage'

/** 在页面中存放componets的key */
export const PAGE_COMPONENTS = '$components$'

/**
 * 将组件添加到当前页面
 */
export function addComponentToPage(ctx) {
  if (!ctx.$page) {
    ctx.$page = getCurrentPage();
  }
  if (!ctx.$page[PAGE_COMPONENTS]) {
    ctx.$page[PAGE_COMPONENTS] = new Set();
  }

  const components = ctx.$page[PAGE_COMPONENTS]
  if (components.has(ctx)) return false;
  components.add(ctx);
  return true;
}

/**
 * 从当前页面移除组件
 */
export function removeComponentToPage(ctx) {
  if (!ctx.$page || !ctx.$page[PAGE_COMPONENTS]) return
  const components = ctx.$page[PAGE_COMPONENTS]
  components.delete(ctx)
}
