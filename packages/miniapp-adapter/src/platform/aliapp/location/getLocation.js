import coor from '../../../utils/convertLocation'

export function getLocation(opts) {
  /**
   * type:
   *  wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
   * altitude:
   *  传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
   */
  const {type, altitude, success=() => {
    }} = opts;

  my.getLocation({
    ...opts,
    type: 0,
    success(res) {
      if (type === 'gcj02') {
        return success(resultFormatToWeChat(res))
      }

      let {longitude, latitude} = res;
      [longitude, latitude] = coor.gcj02towgs84(longitude * 1, latitude * 1);
      success(resultFormatToWeChat({
        ...res,
        longitude,
        latitude
      }))
    }
  })
}

function resultFormatToWeChat(res) {
  let {longitude, latitude, accuracy, horizontalAccuracy} = res;
  return {
    speed: 0,
    altitude: 0,
    verticalAccuracy: 0,
    ...res,
    longitude: longitude * 1,
    latitude: latitude * 1,
    accuracy: accuracy * 1,
    horizontalAccuracy: horizontalAccuracy * 1
  }
}
