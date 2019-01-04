export function showLoading(opts) {
  const {title} = opts;
  moveBy.showLoading({
    ...opts,
    content: title
  })
}
