import { ExtendExistValue } from '../../../utils/index'

export function showActionSheet(opts) {
  const { itemList, success } = opts
  const options = ExtendExistValue(opts, {
    items: itemList,
    success(res) {
      res.tapIndex = res.index
      success && success(res)
    }
  })
  my.showActionSheet(options)
}
