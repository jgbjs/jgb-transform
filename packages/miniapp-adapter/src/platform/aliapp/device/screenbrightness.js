export function setScreenBrightness(opts) {
  const {value} = opts;
  my.setScreenBrightness({
    ...opts,
    brightness: value
  })
}

export function getScreenBrightness(opts) {
  const {success, brightness} = opts;
  my.getScreenBrightness({
    ...opts,
    success(res) {
      success && success({
        value: brightness
      })
    }
  })
}
