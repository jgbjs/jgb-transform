export function startGyroscope(opts) {
  const {interval, success, complete} = opts;
  setTimeout(() => {
    success && success();
    complete && complete();
  }, 0)
}

export function stopGyroscope(opts) {
  const {success, complete} = opts;
  my.offGyroscopeChange();
  setTimeout(() => {
    success && success();
    complete && complete();
  }, 0);
}
