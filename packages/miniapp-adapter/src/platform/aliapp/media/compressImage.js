export function compressImage(opts) {
  const {src, quality} = opts
  my.compressImage({
    ...opts,
    apFilePaths: [src],
    /**
     * 微信中quality
     * 压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）。
     * 
     * 支付宝中compressLevel
     *  0	低质量
        1	中等质量
        2	高质量
        3	不压缩
        4	根据网络适应
     */
    compressLevel: quality2CompressLevel(quality)
  })
}

function quality2CompressLevel(quality) {
  if (typeof quality !== 'number') {
    return 4
  }

  if (quality < 50) {
    return 0
  }

  if (quality < 80) {
    return 1
  }

  return 2
}
