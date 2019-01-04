export function getSavedFileInfo(opts) {
  const {filePath} = opts;
  my.getSavedFileInfo({
    ...opts,
    apFilePath: filePath
  })
}
