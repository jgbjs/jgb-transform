import { ExtendExistValue } from '../../../utils/index'

export function showModal(opts) {
  const { success } = opts;
  const options = ExtendExistValue(opts, {
    confirmButtonText: opts.confirmText || '确定',
    cancelButtonText: opts.cancelText || '取消',
    success(res) {
      res.cancel = !res.confirm
      success && success.call(this, res)
    }
  })
  my.confirm(options)
}
