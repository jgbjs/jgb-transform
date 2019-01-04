export function startAccelerometer(opts) {
  const {interval, success, complete} = opts;
  setTimeout(() => {
    success && success();
    complete && complete();
  }, 0)
}

export function stopAccelerometer(opts) {
  const {success, complete} = opts;
  my.offAccelerometerChange();
  setTimeout(() => {
    success && success();
    complete && complete();
  }, 0);
}
