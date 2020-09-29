export function getSystemInfo(opts) {
  const { success } = opts;
  my.getSystemInfo({
    ...opts,
    success(res) {
      success && success(formatToWeChat(res));
    },
  });
}

export function getSystemInfoSync() {
  return formatToWeChat(my.getSystemInfoSync());
}

function formatToWeChat(res) {
  // screenWidth,screenHeight 在支付宝中会乘以 dpr和预期不符合
  const { windowWidth, windowHeight } = res;
  return {
    ...res,
    screenWidth: windowWidth,
    screenHeight: windowHeight,
    SDKVersion: my.SDKVersion,
    benchmarkLevel: -1,
  };
}
