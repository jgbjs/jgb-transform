import { PAGE_COMPONENTS } from '../../emulation/pageComponents'

/**
 * selectAllComponents
 * @param {*} selector #id or .selector
 */
export function selectAllComponents(selector) {
  // this.$page 为 Component中对当前页面的实例
  const $page = this.$page || this
  let results = []
  const components = $page[PAGE_COMPONENTS]
  if (!$page.$getComponentBy) {
    if (!components) {
      return []
    }
    results = [...components]
  } else {
    // 支付宝内部查询所有节点
    $page.$getComponentBy((result) => {
      results.push(result)
    })
  }

  // 备用方案
  if (results.length === 0) {
    results = [...components]
  }

  // 等待
  return results.filter(r => {
    const id = r.props.id;
    const classNames = (r.props.className || '').split(' ').filter(s => !!s);
    if (selector.startsWith('#') && `#${id}` === selector) {
      return true
    }

    if (selector.startsWith('.') && classNames.length) {
      if (classNames.filter(className => `.${className}` === selector).length) {
        return true
      }
    }

    return false
  })
}

/**
 * selectComponent
 */
export function selectComponent(selector) {
  const components = selectAllComponents.call(this, selector);
  return components.length ? components[0] : undefined;
}
