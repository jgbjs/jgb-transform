export function getClipboardData(opts) {
  const {success} = opts;
  my.getClipboard({
    ...opts,
    success(res) {
      success && success({
        data: res.text
      })
    }
  })
}


export function setClipboardData(opts) {
  my.setClipboard({
    ...opts,
    text: opts.data
  })
}
