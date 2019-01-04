export function previewImage(opts) {
  const {urls, current} = opts
  my.previewImage({
    ...opts,
    // current 在微信小程序中是当前显示图片的链接
    // 而在支付宝中是当前显示图片索引，默认 0
    current: current ? Math.max(urls.indexOf(current), 0) : 0
  })
}
