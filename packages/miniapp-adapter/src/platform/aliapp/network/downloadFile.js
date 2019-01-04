export function downloadFile(opts) {
  const {success} = opts;
  return my.downloadFile({
    ...opts,
    success(res) {
      success && success({
        tempFilePath: res.apFilePath,
        statusCode: 200
      })
    }
  })
}
