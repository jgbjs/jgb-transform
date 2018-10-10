import { mapping } from './mapping'
import _ from 'lodash'

const ENTER_STR = '\n '

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

const MATCH_BRACE = /(?:{)+([^}]+)(?:})+/

export function createTransformAttrValue(source, target) {
  if (source === target) {
    return node => node
  }

  const selector = {
    'swan': transformSwan
  }

  return selector[target]
}

/**
 * swan 转换器
 * @param {*} node 
 */
function transformSwan(node) {
  // template: data={{}} => data={{{}}}
  const attrs = node.attrs || {}
  if (node.tag === 'template') {
    const data = attrs.data
    if (!data) return
    node.attrs.data = data.replace(MATCH_BRACE, (g, $1) => {
      return `{{{${$1}}}}`
    })
  }
  if (node.tag === 'scroll-view') {
    // {{ scroll }} => {= scroll =}
    ['scroll-top', 'scroll-left', 'scroll-into-view'].forEach((attr) => {
      const contains = !!attrs[attr]
      if (!contains) return
      node.attrs[attr] = attrs[attr].replace(MATCH_BRACE, (g, $1) => {
        return `{= ${$1} =}`
      })
    })
  }
  // https://smartapp.baidu.com/docs/develop/framework/view_for/
  // s-for与s-if不可在同一标签下同时使用。
  const keys = Object.keys(attrs)
  if (keys.includes('s-for') && keys.includes('s-if')) {
    console.warn(`s-for与s-if不可在同一标签下同时使用。正在转换添加block作为s-for作为循环标签`)
    const value = attrs['s-for']
    delete node.attrs['s-for'];
    node.content = [ENTER_STR, cloneNode(node), ENTER_STR]
    node.tag = 'block'
    node.attrs = {
      's-for': value
    }
  }

  return node
}

export default function transformer(options) {
  const {source, target} = options
  const transformAttr = createTransformAttr(source, target)
  const transformAttrValue = createTransformAttrValue(source, target)
  return [transformAttr, transformAttrValue]
}

function cloneNode(node) {
  return _.cloneDeep(node)
}
