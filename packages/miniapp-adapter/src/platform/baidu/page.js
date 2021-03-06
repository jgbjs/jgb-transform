import { defineProperty } from '../../utils/index'
import { createSelectorQuery } from './wxml'

export default function AdapterBaiduPage(opts, ...otherOpts) {
  // 取最后一个参数作为Page
  const InjectPage = otherOpts.length ? (otherOpts[otherOpts.length - 1] || Page) : Page;

  const oldLoad = opts.onLoad || (() => {
  });

  opts.onLoad = function (...args) {
    extendInstance.call(this)
    oldLoad.apply(this, args)
  }

  InjectPage(opts)
}

export function WrapPage(InjectPage = Page) {
  return (opts) => {
    AdapterBaiduPage(opts, InjectPage)
  }
}


/**
 * 扩展实例属性
 * @param {*} ctx 
 */
function extendInstance() {
  defineProperty(this, 'createIntersectionObserver', (opts) => swan.createIntersectionObserver(this, opts));
  defineProperty(this, 'createSelectorQuery', () => createSelectorQuery().in(this))
}
