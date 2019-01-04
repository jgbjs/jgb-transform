export function showModal(opts) {
  const {success} = opts;
  moveBy.confirm({
    ...opts,
    confirmButtonText: opts.confirmButtonText,
    cancelButtonText: opts.cancelText,
    success(res) {
      res.cancel = !res.confirm
      success && success.call(this, res)
    }
  })
}
