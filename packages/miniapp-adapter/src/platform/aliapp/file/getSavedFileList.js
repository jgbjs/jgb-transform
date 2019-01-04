export function getSavedFileList(opts) {
  const {success} = opts;
  my.getSavedFileList({
    ...opts,
    success(res) {
      const {fileList} = res;
      success && success({
        fileList: fileList.map(file => {
          return {
            ...file,
            filePath: file.apFilePath
          }
        })
      })
    }
  })
}
