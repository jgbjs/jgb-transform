export const request = opts => {
  const { header } = opts
  my.httpRequest({
    ...opts,
    headers: header
  })
}
