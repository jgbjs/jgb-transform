export function showLoading(opts) {
  const {title} = opts;
  my.showLoading({
    ...opts,
    content: title
  })
}
