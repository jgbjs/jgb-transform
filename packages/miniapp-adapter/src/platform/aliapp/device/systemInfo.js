export function getSystemInfo(opts) {
  const {success} = opts;
  my.getSystemInfo({
    ...opts,
    success(res) {
      success && success(formatToWeChat(res))
    }
  })
}

export function getSystemInfoSync() {
  return formatToWeChat(my.getSystemInfoSync())
}

function formatToWeChat(res) {
  return {
    ...res,
    SDKVersion: my.SDKVersion,
    benchmarkLevel: -1
  }
}
