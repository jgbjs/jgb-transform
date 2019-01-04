export function canvasPutImageData(opts, ctx) {
  const {canvasId} = opts;
  const canvas = my.createCanvasContext(canvasId)
  canvas.putImageData({
    ...opts
  })
}
