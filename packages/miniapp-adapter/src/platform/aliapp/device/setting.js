export function openSetting(opts) {
  const {success} = opts;
  my.openSetting({
    ...opts,
    success(res) {
      success && success({
        authSetting: formatToWeChat(res.authSetting)
      })
    }
  })
}

export function getSetting(opts) {
  const {success} = opts;
  my.getSetting({
    ...opts,
    success(res) {
      success && success({
        authSetting: formateToWeChat(res.authSetting)
      })
    }
  })
}

export function authorize(opts) {
  const {scope} = opts;


  const scopeMapping = {
    'scope.address': 'ADDRESSBOOK',
    'scope.record': 'MICROPHONE',
    'scope.camera': 'CAMERA',
    'scope.writePhotosAlbum': 'PHOTO',
    'scope.userLocation': 'LBS'
  }

  const result = formatToWeChat({
    [scope]: true
  }, scopeMapping)

  const authType = Object.keys(result)[0]
  my.showAuthGuide({
    ...opts,
    authType
  })
}

const aliappMapping = {
  'scope.userInfo': 'scope.userInfo',
  'scope.location': ' scope.userLocation',
  'scope.album': 'scope.writePhotosAlbum',
  'scope.camera': 'scope.camera',
  'scope.audioRecord': 'scope.record'
}

function formatToWeChat(authSetting, mapping = aliappMapping) {
  const keys = Object.keys(authSetting)
  return keys.reduce((obj, key) => {
    const replacedKey = mapping[key]
    if (replacedKey) {
      const value = obj[key];
      obj[replacedKey] = value
    }
    return obj
  }, {})
}
