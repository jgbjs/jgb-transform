import { selectAllComponents, selectComponent } from './component'
import { defineProperty } from '../../utils/index'

export default function AdapterAliappPage(opts, InjectPage = Page) {
  const oldLoad = opts.onLoad || (() => {
  });

  opts.onLoad = function(...args) {
    extendInstance.call(this)
    oldLoad.apply(this, args)
  }

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
