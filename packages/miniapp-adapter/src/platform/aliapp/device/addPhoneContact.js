export function addPhoneContact(opts) {
  const {weChatNumber} = opts;
  my.addPhoneContact({
    ...opts,
    alipayAccount: weChatNumber
  })
}
