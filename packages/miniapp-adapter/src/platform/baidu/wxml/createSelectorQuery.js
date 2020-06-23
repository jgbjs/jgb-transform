import { getCurrentPage } from "../../../utils/getCurrentPage";

export function createSelectorQuery() {
  const selectorQuery = swan.createSelectorQuery()
  const { select, selectAll } = selectorQuery;

  selectorQuery.select = function (selector) {
    if (hasCustomComponentSelector(selector)) {
      selector = supportCustomComponentSelector(selector)
    }

    return select.call(selectorQuery, selector)
  }

  selectorQuery.selectAll = function (selector) {
    if (hasCustomComponentSelector(selector)) {
      selector = supportCustomComponentSelector(selector)
    }

    return selectAll.call(selectorQuery, selector)
  }

  return selectorQuery;
}

const ccs = '>>>'

/**
 * 判断是否包含跨自定义组件的后代选择器
 */
function hasCustomComponentSelector(selector) {
  return selector.includes(ccs)
}

/**
 * 支持跨自定义组件的后代选择器， >>>
 * 百度小程序会报错
 * @example
 *  supportCustomComponentSelector('.item >>> .active')
 * supportCustomComponentSelector('.item')
 */
export function supportCustomComponentSelector(selector) {
  const page = getCurrentPage();
  const result = selector.split(ccs);
  let [firstSelector = ''] = result;
  let compSelector = result.pop();
  compSelector = (compSelector || firstSelector).trim();
  const uniquePrefix = []
  if (page && page.privateProperties && page.privateProperties.customComponents) {
    const customComponents = page.privateProperties.customComponents
    const keys = Object.keys(customComponents)
    for (const key of keys) {
      const comp = customComponents[key];
      uniquePrefix.push(comp.uniquePrefix)
    }
  }
  const sCompSelector = compSelector.slice(1)
  return uniquePrefix.map(prefix => `.${prefix}__${sCompSelector}`).join(',')
}
