export function showModal(opts) {
  const {success} = opts;
  my.confirm({
    ...opts,
    confirmButtonText: opts.confirmText,
    cancelButtonText: opts.cancelText,
    success(res) {
      res.cancel = !res.confirm
      success && success.call(this, res)
    }
  })
}
