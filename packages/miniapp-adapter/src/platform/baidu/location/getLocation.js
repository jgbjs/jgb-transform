export function getLocation(opts) {
  /**
   * type:
   *  wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
   * altitude:
   *  传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
   */
  const {altitude = 'false', success=() => {}} = opts;

  swan.getLocation({
    ...opts,
    altitude: formatAltitude(altitude),
    success(res) {
      success(res); 
    }
  })
}

/**
 * 百度类型为boolean，微信类型为string，抹平差异
 * @param {string} altitude 
 */
function formatAltitude(altitude) {
  let newAltitude = false;
  try {
    newAltitude = !!JSON.parse(altitude);
  } catch(e) {}
  return newAltitude;
}
