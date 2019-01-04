export function chooseImage(opts) {
  const {success} = opts;
  my.chooseImage({
    ...opts,
    success(res) {
      const {apFilePaths} = res;
      success && success({
        tempFilePaths: apFilePaths,
        tempFiles: {
          path: '',
          size: 0
        }
      })
    }
  })
}
