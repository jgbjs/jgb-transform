const wx = require("../../src/platform/aliapp").default;

global.my = {
  httpRequest({success}) {
    success && success({
      data: "success",
      status: 200,
      headers: {
        mockHeader: true
      }
    });
  },
  downloadFile({success}) {
    success && success({
      apFilePath: 'file',
      statusCode: 200
    })
  },
  uploadFile({success, fileType, fileName}) {
    success && success({
      data: {
        fileType,
        fileName
      }
    })
  }
};

describe("request", () => {
  test("success", () => {
    wx.request({
      url: "url",
      success(result) {
        expect(result.data).toBe("success");
        expect(result.statusCode).toBe(200);
        expect(result.header).toEqual({
          mockHeader: true
        })
      }
    });
  });
});

describe('download', () => {
  test('success', () => {
    wx.downloadFile({
      url: 'url',
      success(res) {
        expect(res.tempFilePath).toBe('file');
        expect(res.statusCode).toBe(200);
      }
    })
  })
})

// describe('socket', () => {
//   test('')
// })

describe('upload', () => {
  test('success', () => {
    const file = 'filePath.jpg'
    wx.uploadFile({
      url: 'url',
      filePath: file,
      name: file,
      success(res) {
        const {fileType, fileName} = res.data
        expect(fileType).toBe('image');
        expect(fileName).toBe(file);
      }
    })
  })

  test('upload video', () => {
    const file = 'filePath.mp4'
    wx.uploadFile({
      url: 'url',
      filePath: file,
      name: file,
      success(res) {
        const {fileType} = res.data
        expect(fileType).toBe('video');
      }
    })
  })

  test('upload audio', () => {
    const file = 'filePath.mp3'
    wx.uploadFile({
      url: 'url',
      filePath: file,
      name: file,
      success(res) {
        const {fileType} = res.data
        expect(fileType).toBe('audio');
      }
    })
  })

  test('upload unkown ext file, default image', () => {
    const file = 'filePath.test'
    wx.uploadFile({
      url: 'url',
      filePath: file,
      name: file,
      success(res) {
        const {fileType} = res.data
        expect(fileType).toBe('image');
      }
    })
  })
})
