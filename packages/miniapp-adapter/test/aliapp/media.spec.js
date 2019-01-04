const wx = require("../../src/platform/aliapp").default;

global.my = {
  chooseImage(opts) {
    const {count = 1, success} = opts

    success && success({
      apFilePaths: Array(count).fill({}).map((v, index) => `image-${index}.jpg`)
    })
  },
  compressImage(opts) {
    // compressLevel : 0~4
    const {quality=80, compressLevel=4, success} = opts
    expect(compressLevel).toBeLessThanOrEqual(4)
    success && success({
      quality,
      compressLevel
    })
  },
  previewImage(opts) {
    const {urls, current=0, success} = opts;
    expect(Array.isArray(urls)).toBeTruthy()

    const len = urls.length;
    expect(len).toBeGreaterThanOrEqual(1);
    expect(typeof current).toBe('number')
    expect(current).toBeLessThanOrEqual(len);
    expect(current).toBeGreaterThanOrEqual(0)
    success && success({
      current
    })
  },
  saveImage(opts) {
    const {url, success} = opts;
    expect(typeof url).toBe('string')
    success && success({
      url
    })
  }
}

describe('chooseImage', () => {
  test('success', () => {
    wx.chooseImage({
      count: 2,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        expect(Array.isArray(tempFilePaths)).toBeTruthy();
        expect(tempFilePaths.length).toBe(2);
        expect(tempFilePaths[0]).toEqual(expect.stringContaining(`image-0.jpg`))
      }
    })
  })
})

describe('compressImage', () => {
  test('default quality', () => {
    wx.compressImage({
      src: '',
      success({quality, compressLevel}) {
        expect(quality).toBe(80);
        expect(compressLevel).toBe(4);
      }
    })
  })

  test('quality: 80', () => {
    wx.compressImage({
      src: '',
      quality: 80,
      success({quality, compressLevel}) {
        expect(compressLevel).toBe(2);
      }
    })
  })

  test('quality: 60', () => {
    wx.compressImage({
      src: '',
      quality: 60,
      success({quality, compressLevel}) {
        expect(compressLevel).toBe(1);
      }
    })
  })

  test('quality: 30', () => {
    wx.compressImage({
      src: '',
      quality: 30,
      success({quality, compressLevel}) {
        expect(compressLevel).toBe(0);
      }
    })
  })
})

describe('previewImage', () => {
  test('preivewImage: default current', () => {
    wx.previewImage({
      urls: [''],
      success({current}) {
        expect(current).toBe(0)
      }
    })
  })

  test('preivewImage: with current', () => {
    wx.previewImage({
      urls: ['abc', 'def'],
      current: 'def',
      success({current}) {
        expect(current).toBe(1)
      }
    })
  })

  test('preivewImage: current no in urls', () => {
    wx.previewImage({
      urls: ['abc', 'def'],
      current: 'defdd',
      success({current}) {
        expect(current).toBe(0)
      }
    })
  })

})

describe('saveImageToPhotosAlbum', () => {
  test('success', () => {
    const filePath = 'abc'
    wx.saveImageToPhotosAlbum({
      filePath,
      success({url}) {
        expect(url).toBe(filePath)
      }
    })
  })
})
