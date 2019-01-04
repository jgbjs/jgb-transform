export function showActionSheet(opts) {
  const {itemList, success} = opts
  my.showActionSheet({
    ...opts,
    items: itemList,
    success(res) {
      res.tapIndex = res.index
      success && success(res)
    }
  })
}
