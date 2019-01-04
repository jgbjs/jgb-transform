export function scanCode(opts) {
  /**
   * scanType: Array.<string>
   */
  const {onlyFromCamera, scanType, success} = opts
  my.scan({
    ...opts,
    hideAlbum: onlyFromCamera,
    type: formatToWechat(scanType[0]),
    success(res) {
      const {code, qrCode, barCode} = res
      success && success({
        result: code,
        scanType: scanType[0],
        charSet: '',
        path: code || '',
        rawData: qrCode || barCode
      })
    }
  })
}

const mapping = {
  'barCode': 'bar',
  'qrCode': 'qr'
}

function formatToWechat(scanType) {
  return mapping[scanType] || scanType
}
