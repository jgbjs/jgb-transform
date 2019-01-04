export function makePhoneCall(opts) {
  const {phoneNumber} = opts;
  my.makePhoneCall({
    ...opts,
    number: phoneNumber
  })
}
