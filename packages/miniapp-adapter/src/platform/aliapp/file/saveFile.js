export function saveFile(opts) {
  const {tempFilePath, success} = opts
  my.saveFile({
    ...opts,
    apFilePath: tempFilePath,
    success(res) {
      const savedFilePath = res.apFilePath
      success && success({
        savedFilePath
      })
    }
  })
}
