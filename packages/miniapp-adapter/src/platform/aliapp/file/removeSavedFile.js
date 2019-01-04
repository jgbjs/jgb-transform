export function removeSavedFile(opts) {
  const {filePath} = opts;
  my.removeSavedFile({
    ...opts,
    apFilePath: filePath
  })
}
