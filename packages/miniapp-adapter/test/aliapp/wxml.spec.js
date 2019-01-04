const wx = require("../../src/platform/aliapp").default;
global.my = {
  createSelectorQuery() {
    return new MockSelectorQuery()
  }
}

class MockSelectorQuery {
  constructor() {
    this.steps = []
    this.dom = [{
      className: 'all',
      "x": 1,
      "y": -34,
      "width": 1367,
      "height": 18,
      "top": -34,
      "right": 1368,
      "bottom": -16,
      "left": 1,
      "scrollTop": 0,
      "scrollLeft": 0
    }, {
      className: 'all',
      "x": 1,
      "y": -16,
      "width": 1367,
      "height": 18,
      "top": -16,
      "right": 1368,
      "bottom": 2,
      "left": 1
    }, {
      id: 'one',
      "x": 1,
      "y": 2,
      "width": 1367,
      "height": 18,
      "top": 2,
      "right": 1368,
      "bottom": 20,
      "left": 1
    }, {
      id: 'scroll',
      "scrollTop": 0,
      "scrollLeft": 0
    }, {
      viewport: true,
      "width": 1384,
      "height": 360,
      "scrollTop": 35,
      "scrollLeft": 0
    }]
  }

  select(selector) {
    this.steps.push({
      name: 'select',
      args: selector
    })
    return this
  }

  selectAll(selector) {
    this.steps.push({
      name: 'selectAll',
      args: selector
    })
    return this;
  }

  selectViewport() {
    this.steps.push({
      name: 'selectViewport'
    })
    return this
  }

  boundingClientRect() {
    this.steps.push({
      name: 'boundingClientRect',
    })
    return this
  }

  _boundingClientRect(step) {
    const {name, args} = step
    const result = this._query(name, args);
    return result;
  }

  scrollOffset() {
    this.steps.push({
      name: 'scrollOffset',
    })
    return this
  }

  _scrollOffset(step) {
    const {name, args} = step
    const result = this._query(name, args);
    return result;
  }

  _query(name, args) {
    const selector = args;
    if ('selectViewport' === name) {
      return this.dom.filter(d => d.viewport === true)[0]
    }

    const isClassSelector = selector.startsWith('.')

    if (isClassSelector) {
      const classSelector = selector.slice(1)

      const result = this.dom.filter(d => {
        return d.className === classSelector
      })

      return formatResult(result)
    }

    const isIdSelector = selector.startsWith('#')

    if (isIdSelector) {
      const idSelector = selector.slice(1)
      const result = this.dom.filter(d => {
        return d.id === idSelector
      })

      return formatResult(result)
    }

    return formatResult([]);

    function formatResult(result) {
      switch (name) {
        case 'select':
          return (Array.isArray(result) ? result[0] : result) || null;
          break;
        case 'selectAll':
          return [].concat(result).filter(r => !!r);
          break;
      }
    }
  }

  exec(cb) {
    const steps = this.steps;
    const result = []
    while (steps.length) {
      const selectStep = steps.shift();
      const queryStep = steps.shift();
      const {name} = queryStep;

      const ret = this[`_${name}`](selectStep)
      result.push(ret)
    }

    cb(result)
  }
}

describe('selectorQuery', () => {
  test('select(#non-exists).boundingClientRect', () => {
    wx.createSelectorQuery()
      .select('#non-exists').boundingClientRect((ret) => {
      expect(ret).toBeNull()
    }).exec((ret) => {
      expect(ret.length).toBe(1)
      expect(ret[0]).toBeNull()
    });
  });

  test('select(#one).boundingClientRect', () => {
    wx.createSelectorQuery()
      .select('#one').boundingClientRect((result) => {
      expect(result.y).toBe(2)
    }).exec((ret) => {
      expect(Array.isArray(ret)).toBeTruthy()
      const result = ret[0]
      expect(result.x).toBe(1)
    });
  })

  test('selectall(.all).boundingClientRect', () => {
    wx.createSelectorQuery()
      .selectAll('.all').boundingClientRect((result) => {
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(2);
      expect(result[0].y).toBe(-34)
    }).exec((ret) => {
      expect(ret.length).toBe(1)
      const result = ret[0];
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(2);
      expect(result[0].width).toBe(1367)
    });
  });

  test('select(#scroll).scrollOffset', () => {
    wx.createSelectorQuery()
      .select('#scroll').scrollOffset((result) => {
      expect(result.scrollTop).toBe(0)
    }).exec()
  })

  test('selectViewport().scrollOffset', () => {
    wx.createSelectorQuery()
      .selectViewport().scrollOffset((result) => {
      expect(result.scrollTop).toBe(35)
    }).exec()
  })
})

describe('mock selectorQuery.fields', () => {
  test('selectall(.all).fields({size})', () => {
    wx.createSelectorQuery()
      .selectAll('.all')
      .fields({
        size: true
      }, (result) => {
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(2);
        expect(result[0].width).toBe(1367);
        expect(result[1].height).toBe(18);
      }).exec((ret) => {
      const result = ret[0];
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(2);
      expect(result[0].width).toBe(1367);
      expect(result[1].height).toBe(18);
    })
  })

  test('select(.all).fields({size,scrollOffset,rect}))', () => {
    wx.createSelectorQuery()
      .select('.all')
      .fields({
        size: true,
        scrollOffset: true,
        rect: true
      }, (result) => {
        expect(!Array.isArray(result)).toBeTruthy();
        expect(result.width).toBe(1367);
        expect(result.top).toBe(-34);
        expect(result.scrollTop).toBe(0);
      }).exec((ret) => {
      const result = ret[0];
      expect(!Array.isArray(result)).toBeTruthy();
      expect(result.width).toBe(1367);
      expect(result.top).toBe(-34);
      expect(result.scrollTop).toBe(0);
    })
  })
})
