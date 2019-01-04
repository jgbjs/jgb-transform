export function canvasToTempFilePath(opts, ctx) {
  const {canvasId} = opts;
  const canvas = my.createCanvasContext(canvasId)
  canvas.toTempFilePath({
    ...opts
  })
}
