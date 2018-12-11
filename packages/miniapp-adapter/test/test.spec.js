const miniappAdapter = require('../lib')
const requireAdapterPath = miniappAdapter.default
const extendSupportPlatform = miniappAdapter.extendSupportPlatform

describe('extendSupportPlatform', () => {
  test('resolve success', () => {
    extendSupportPlatform(
      'h5',
      require.resolve('./h5_platform_example/index.js')
    )

    const adapterPath = requireAdapterPath('h5')
    const wx = require(adapterPath).default
    wx.request({
      url: '',
      success(result) {
        expect(result).toBe('success')
      }
    })
  })
})
