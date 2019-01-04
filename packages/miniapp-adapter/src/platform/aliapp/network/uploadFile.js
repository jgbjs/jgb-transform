export function uploadFile(opts) {
  const {name, filePath} = opts
  return my.uploadFile({
    ...opts,
    fileType: getFileTypeFromFilePath(filePath),
    fileName: name
  })
}

const FileTypeMapping = {
  'image': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
  'video': ['mp4', 'mov', 'm4v', 'flv', 'avi', 'wmv', 'rmvb', 'rm', 'mkv', '3gp'],
  'audio': ['mp3', 'ogg', 'aac', 'wma', 'wav', 'ape', 'flac']
}

function getFileTypeFromFilePath(filePath) {
  // xxx.jpg => .jpg
  const lastIndex = filePath.lastIndexOf('.') + 1
  const ext = filePath.slice(lastIndex);
  console.log(ext)
  const fileTypes = Object.keys(FileTypeMapping)
  for (const fileType of fileTypes) {
    const exts = FileTypeMapping[fileType]
    if (exts.includes(ext)) {
      return fileType
    }
  }

  // 默认图片
  return 'image'
}
