class SelectorQuery {
  constructor(params = {}) {
    // 记录步骤
    this.steps = []

    // 所有的noderef回调
    this.callbacks = []

    this.context = params.context;
  }

  select(selector) {
    this.steps.push({
      name: 'select',
      args: [selector]
    })
    return this
  }

  selectAll(selector) {
    this.steps.push({
      name: 'selectAll',
      args: [selector]
    })
    return this
  }

  selectViewport() {
    this.steps.push({
      name: 'selectViewport'
    })
    return this
  }

  /** 支付宝小程序不支持  */
  in(component) {
    console.warn('支付宝小程序不支持 in 方法')
    this.context = component;
    // this.steps.push({
    //   name: 'in',
    //   args: [component]
    // })
    return this
  }

  /** 执行 */
  exec(callback) {
    let selectorQuery = this.context ? my.createSelectorQuery() : my.createSelectorQuery({
      page: this.context
    })
    selectorQuery = this.steps.reduce((selectorQuery, {name, args=[]}) => {
      return selectorQuery[name].apply(selectorQuery, args)
    }, selectorQuery)

    const callbacks = this.callbacks;

    selectorQuery.exec(function(...args) {
      try {
        callbacks.forEach(cb => {
          cb.apply(this, args)
        })
      } catch (error) {
        console.error(error)
      }
      callback.apply(this, args);
    })

    return this
  }

  boundingClientRect(callback) {
    this.steps.push({
      name: 'boundingClientRect',
      args: [callback]
    })
    if (isFunction(callback)) {
      this.callbacks.push(callback)
    }
    return this
  }

  /** 支付宝小程序不支持  */
  fields(fields) {
    console.warn('支付宝小程序不支持 fields 方法')
    // this.steps.push({
    //   name: 'fields',
    //   args: [fields]
    // })
    return this
  }

  scrollOffset(callback) {
    this.steps.push({
      name: 'scrollOffset',
      args: [callback]
    })
    if (isFunction(callback)) {
      this.callbacks.push(callback)
    }
    return this
  }
}

function isFunction(fn) {
  return typeof fn === 'function'
}

export function createSelectorQuery(params) {
  return new SelectorQuery(params)
}