
class SelectorQuery {
  constructor(params = {}) {
    // 记录步骤
    this.steps = []

    // 所有的noderef回调
    this.callbacks = []

    this.context = params.context;

    this.batchId = 1;
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

    const steps = this.steps;
    const callbacks = this.callbacks;

    selectorQuery = this.steps.reduce((selectorQuery, {name, batchId, args=[]}) => {
      const fn = selectorQuery[name]
      return fn.apply(selectorQuery, args)
    }, selectorQuery)

    selectorQuery.exec(function(ret) {
      const mergeBatch = new MergeBatch();

      while (callbacks.length) {
        const [cb, params={}] = callbacks.shift();
        const result = ret.shift();
        if (params.batchId) {
          mergeBatch.startBatch(params.batchId, result)
        } else {
          mergeBatch.endBatch();
          mergeBatch.push(result)
        }
        cb.call(this, result);
      }

      mergeBatch.endBatch();

      callback && callback.call(this, mergeBatch.data);
      callbacks.length = 0;
      steps.length = 0;
    })

    return this
  }

  boundingClientRect(callback, batchId) {
    this.steps.push({
      batchId,
      name: 'boundingClientRect',
      args: [callback]
    })

    this.callbacks.push([
      isFunction(callback) ? callback : noop,
      {
        batchId,
      }])

    return this
  }

  scrollOffset(callback, batchId) {
    this.steps.push({
      batchId,
      name: 'scrollOffset',
      args: [callback]
    })
    this.callbacks.push([
      isFunction(callback) ? callback : noop,
      {
        batchId,
      }])
    return this
  }

  /** 支付宝小程序不支持  */
  fields(fields, callback = noop) {
    const supportKeys = ['rect', 'size', 'scrollOffset'];
    const isIncludeNotSupportKey = Object.keys(fields).some(key => !supportKeys.includes(key))
    if (isIncludeNotSupportKey) {
      console.warn('  支付宝小程序fields方法fields参数只支持：rect, size, scrollOffset  ');
    }

    const {rect, size, scrollOffset} = fields;
    /** 累计器：记录有多少查询合并  */
    let acc = 0;
    const lastStep = this.steps[this.steps.length - 1];
    const batchId = this.batchId++;
    lastStep.batchId = batchId;
    const mergeBatch = new MergeBatch();

    const cb = (result) => {
      mergeBatch.startBatch(batchId, result);
      if (--acc === 0) {
        mergeBatch.endBatch(batchId);
        callback(mergeBatch.data[0])
      }
    }

    if (rect || size) {
      acc++;
      this.boundingClientRect(cb, batchId);
    }

    if (scrollOffset) {
      // 重新执行之前select操作
      if (acc > 0) {
        this.steps.push({
          batchId,
          ...lastStep,
        })
      }
      acc++;
      this.scrollOffset(cb, batchId);
    }

    // this.steps.push({
    //   name: 'fields',
    //   args: [fields, callback]
    // })
    return this
  }

  /** 支付宝小程序不支持  */
  context(callback) {
    console.warn('支付宝小程序不支持 context 方法')
    // this.steps.push({
    //   name: 'context',
    //   args: [ callback]
    // })
    return this;
  }
}

class MergeBatch {
  constructor() {
    this.data = []
  }

  push(data) {
    this.data.push(data)
  }

  clear() {
    this.data.length = 0;
  }

  startBatch(batchId, data) {
    this.currentBatchId = batchId;
    const batchData = this.currentBatchData;
    // 第一次进入
    if (batchData.length === 0) {
      this.push(this.placeholderBatchStr)
    }
    // 推入 batchId 的数据
    batchData.push(data);
  }

  get placeholderBatchStr() {
    const batchId = this.currentBatchId
    return `batch-data-${batchId}`
  }

  get currentBatchData() {
    const placeholder = this.placeholderBatchStr;
    if (!this[placeholder]) {
      this[placeholder] = []
    }

    return this[placeholder]
  }

  endBatch(batchId) {
    const placeholder = batchId ? `batch-data-${batchId}` : this.placeholderBatchStr;
    const batchData = this[placeholder] || [];
    const index = this.data.findIndex(d => d === placeholder);
    // replace placeholder to real data
    if (index >= 0) {
      const isMultipleResult = Array.isArray(batchData[0])
      let ret = [];
      // merge result
      batchData.forEach(result => {
        ret = [].concat(result)
          .map((mergeResult, idx) => {
            if (ret[idx]) {
              return Object.assign(ret[idx], mergeResult)
            }
            return mergeResult
          });
      })

      if (isMultipleResult) {
        this.data.splice(index, 1, ret)
      } else {
        this.data.splice(index, 1, ret[0] || null)
      }
    }

    this.currentBatchId = null;
    this[this.placeholderBatchStr] = null;
  }
}

/* 空方法 */
function noop() {

}


function isFunction(fn) {
  return typeof fn === 'function'
}

export function createSelectorQuery(params) {
  return new SelectorQuery(params)
}
