/**
 * wechat can set two way
 * 1. wx.setStorageSync('key', 'value')
 * 2. like aliapp wx.setStorage({
        key:"key",
        data:"value"
      })
 */
export function setStorageSync(key, data) {
  if (typeof key === "string") {
    my.setStorageSync({
      key,
      data
    })
  } else {
    my.setStorageSync(key);
  }
}
