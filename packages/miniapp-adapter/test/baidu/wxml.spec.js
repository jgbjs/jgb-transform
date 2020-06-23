const { supportCustomComponentSelector } = require("../../src/platform/baidu/wxml/createSelectorQuery");

global.getCurrentPages = function () {
  return [{
    privateProperties: {
      customComponents: {
        'test-comp': {
          uniquePrefix: 'sw-1'
        }
      }
    }
  }]
}

describe('supportCustomComponentSelector', () => {
  it('test normal selector', () => {
    const result = supportCustomComponentSelector('.item');
    expect(result).toBe('.sw-1__item')
  })

  it('test custom component selector', () => {
    const result = supportCustomComponentSelector('.active >>> .item');
    expect(result).toBe('.sw-1__item')
  })
})
