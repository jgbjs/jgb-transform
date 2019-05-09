import { mapping } from '../mapping';

/**
 * 通用属性名转换 
 * @example wx:if => s-if
 * @param {*} source 
 * @param {*} target 
 */
export function createTransformAttr(source, target) {
  if (source === target) {
    return node => node
  }

  const sourceAttr = mapping.attr[source]
  const targetAttr = mapping.attr[target]
  return (node) => {
    const attrs = node.attrs
    if (!attrs) return node;
    Object.keys(attrs).forEach(key => {
      const idx = sourceAttr.findIndex((attr) => attr === key)
      if (idx >= 0) {
        const attr = targetAttr[idx]
        const value = attrs[key]
        // some empty attr in posthtml like [s-else] will be tranform to [s-else=""]
        // so we should avoid tramform
        attrs[attr] = value === '' ? true : value
        delete attrs[key]
      }
    })
    return node
  }
}
