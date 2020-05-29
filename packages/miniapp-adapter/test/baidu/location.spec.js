const wx = require("../../src/platform/baidu").default;

global.swan = {
  getLocation(opts) {
    const {altitude, success} = opts;
    console.log('altitude: ', typeof altitude, altitude)
    expect(typeof altitude).toBe('boolean');
    success && success({
      longitude: 116.404,
      latitude: 39.915
    })
  }
}

describe('getLocation', () => {
  test('default altitude', () => {
    wx.getLocation({
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

  test('altitude = false', () => {
    wx.getLocation({
      altitude: 'false',
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

  test('altitude = true', () => {
    wx.getLocation({
      altitude: 'true',
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
