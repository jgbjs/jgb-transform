export function onCompassChange(cb) {
  my.onCompassChange((res) => {
    cb && cb({
      ...res,
      accuracy: 'unreliable'
    })
  })
}

export function startCompass(opts) {
  const {interval, success, complete} = opts;
  setTimeout(() => {
    success && success();
    complete && complete();
  }, 0)
}

export function stopCompass(opts) {
  const {success, complete} = opts;
  my.offCompassChange();
  setTimeout(() => {
    success && success();
    complete && complete();
  }, 0);
}
