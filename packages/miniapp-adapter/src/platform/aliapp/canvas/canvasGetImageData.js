export function canvasGetImageData(opts, ctx) {
  const {canvasId} = opts;
  const canvas = my.createCanvasContext(canvasId)
  canvas.getImageData({
    ...opts
  })
}
