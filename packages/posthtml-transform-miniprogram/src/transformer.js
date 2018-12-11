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

/**
 * 通用属性事件名转换 
 * @param {*} source 
 * @param {*} target 
 */
export function createTransformEventAttr(source, target) {
  // 支付宝小程序和微信小程序差异比较多
  if (target !== 'aliapp') {
    return returnSelf
  }

  return transformAliappEventAttr
}

const MATCH_EVENT_ATTR = /^(bind|catch){1}:?(.*)/

/**
 * wx转换支付宝事件
 * @param {*} node 
 */
function transformAliappEventAttr(node) {
  const attrs = node.attrs
  if (!attrs) return node;
  const commonEventMapping = {
    touchstart: 'TouchStart',
    touchmove: 'TouchMove',
    touchend: 'TouchEnd',
    touchcancel: 'TouchCancel',
    longtap: 'LongTap'
  }
  // capture-bind:* , capture-catch:* 支付宝不支持所以忽略
  Object.keys(attrs).forEach(key => {
    const matches = key.match(MATCH_EVENT_ATTR);
    if (!matches) return;
    const [g, eventStartKey, eventName] = matches;
    // bind:* , bindtap => onTap
    // catch:* , catchtap => catchTap
    let evtName = commonEventMapping[eventName]
    if (!evtName) {
      evtName = eventName[0].toUpperCase() + eventName.slice(1)
    }
    const attr = 'on' + evtName;
    const value = attrs[key]
    attrs[attr] = value === '' ? true : value
    delete attrs[key]
  })
  return node;
}

// 匹配2个以上大括号 like {{ data }} {{{ data }}}
const MATCH_BRACE = /(?:{){2,}([^}]+)(?:}){2,}/

export function createTransformAttrValue(source, target) {
  if (source === target) {
    return returnSelf
  }

  const selector = {
    'swan': transformSwan,
    'aliapp': transfromAliapp,
    'my': transfromAliapp
  }

  return selector[target]
}



function returnSelf(node) {
  return node
}

/**
 * aliapp 转换器
 * @param {*} node 
 */
function transfromAliapp(node) {
  const attrs = node.attrs || {}
  if (node.tag === 'icon') {
    const iconTypeNoSupport = ['circle', 'info_circle']
    if (iconTypeNoSupport.includes(attrs.type)) {
      console.warn(`支付宝小程序 <icon> 不支持 type: ${attrs.type}, 会导致页面不渲染。`)
    }
  }
  if (node.tag === 'scroll-view') {
    const nameMapping = {
      bindscrolltoupper: 'onScrollToUpper',
      bindscrolltolower: 'onScrollToLower'
    }
    replaceAttrNames(nameMapping)
  }

  if (node.tag === 'picker-view') {
    const nameMapping = {
      'indicator-style': 'indicatorStyle'
    }
    replaceAttrNames(nameMapping)
  }

  if (node.tag === 'slider') {
    const nameMapping = {
      'block-size': 'handleSize',
      'block-color': 'handleColor'
    }
    replaceAttrNames(nameMapping)
  }

  if (node.tag === 'image') {
    const nameMapping = {
      'lazy-load': 'lazyLoad'
    }
    replaceAttrNames(nameMapping)
  }

  if (node.tag === 'canvas') {
    const nameMapping = {
      'canvas-id': 'id'
    }
    replaceAttrNames(nameMapping)
  }

  if (node.tag === 'map') {
    const nameMapping = {
      'bindmarkertap': 'onMarkerTap',
      'bindcallouttap': 'onCalloutTap',
      'bindcontroltap': 'onControlTap',
      'bindregionchange': 'onRegionChange'
    }
    replaceAttrNames(nameMapping)
  }

  return node

  function replaceAttrNames(nameMapping) {
    Object.keys(nameMapping).forEach(name => {
      const value = attrs[name]
      if (value) {
        attrs[nameMapping[name]] = value;
        delete attrs[name];
      }
    })
  }
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
    if (!data) return node;
    node.attrs.data = data.replace(MATCH_BRACE, (g, $1) => {
      return `{{{${$1}}}}`
    })
  }
  if (node.tag === 'scroll-view') {
    // {{ scroll }} => {= scroll =}
    ['scroll-top', 'scroll-left', 'scroll-into-view'].forEach((attr) => {
      const contains = !!attrs[attr]
      if (!contains) return;
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
  const transformEventAttr = createTransformEventAttr(source, target)
  return [transformAttr, transformAttrValue, transformEventAttr]
}

function cloneNode(node) {
  return _.cloneDeep(node)
}
