// @jgb-ignore

import { selectAllComponents, selectComponent } from './base'
import { defineProperty } from '../../utils/index'

export default function AdapterAliappPage(opts, ...otherOpts) {
  const oldLoad = opts.onLoad || (() => {
  });

  opts.onLoad = function(...args) {
    extendInstance.call(this)
    oldLoad.apply(this, args)
  }

  // 取最后一个参数作为Page
  const InjectPage = otherOpts.length ? (otherOpts[otherOpts.length - 1] || Page) : Page;

  InjectPage(opts)
}

export function WrapPage(InjectPage = Page) {
  return (opts) => {
    AdapterAliappPage(opts, InjectPage)
  }
}

/**
 * 扩展实例属性
 * @param {*} ctx 
 */
function extendInstance(ctx) {
  defineProperty(this, 'selectAllComponents', selectAllComponents)
  defineProperty(this, 'selectComponent', selectComponent)
}
