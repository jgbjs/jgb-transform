import { ExtendExistValue } from '../../../utils/index'

export function showToast(opts) {
  const { success } = opts;
  const options = ExtendExistValue(opts, {
    content: opts.content || opts.title,
    type: opts.type || opts.icon,
    success(res) {
      res.cancel = !res.confirm
      success && success.call(this, res)
    }
  })
  my.showToast(options)
}

