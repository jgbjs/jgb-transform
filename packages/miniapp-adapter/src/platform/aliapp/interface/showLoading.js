import { ExtendExistValue } from '../../../utils/index'

export function showLoading(opts) {
  const { title } = opts;
  const options = ExtendExistValue(opts, {
    content: title
  })
  my.showLoading(options)
}
