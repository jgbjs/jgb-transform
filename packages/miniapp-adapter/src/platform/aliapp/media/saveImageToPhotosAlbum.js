export function saveImageToPhotosAlbum(opts) {
  const {filePath} = opts;
  my.saveImage({
    ...opts,
    url: filePath
  })
}
