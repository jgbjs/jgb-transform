const wx = require("../../src/platform/aliapp").default;

global.my = {
  getLocation(opts) {
    const {type=0, success} = opts;
    expect(type).toBe(0);
    success && success({
      longitude: '116.404',
      latitude: '39.915'
    })
  },
  openLocation(opts) {
    const {longitude, latitude, success} = opts;
    expect(typeof longitude).toBe('string')
    expect(typeof latitude).toBe('string')
    success && success()
  }
}

describe('getLocation', () => {
  test('default type', () => {
    wx.getLocation({
      success(res) {
        const {longitude, latitude} = res;
        expect(typeof longitude).toBe('number')
        expect(typeof latitude).toBe('number')
        console.log(longitude, latitude);
        expect(longitude).toBeCloseTo(116.39775550083061, 10)
        expect(latitude).toBeCloseTo(39.91359571849836, 10)
      }
    })
  })

  test('type = gcj02', () => {
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const {longitude, latitude} = res;
        expect(typeof longitude).toBe('number')
        expect(typeof latitude).toBe('number')
        console.log(longitude, latitude);
        expect(longitude).toBeCloseTo(116.404, 10)
        expect(latitude).toBeCloseTo(39.915, 10)
      }
    })
  })
})

describe('openLocation', () => {
  test('longitude is string', () => {
    wx.openLocation({
      longitude: 116.404,
      latitude: 39.915
    })
  })
})
