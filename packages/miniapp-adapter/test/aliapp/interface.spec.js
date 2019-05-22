const wx = require("../../src/platform/aliapp").default;


global.my = {

}


describe('interface', () => {
  test('nextTick', () => {
    let idx = 0
    wx.nextTick(() => {
      idx++;
    })
    expect(idx).toBe(0)

    return Promise.resolve().then(() => {
      expect(idx).toBe(1)
    })
  })
})
