export function login(opts) {
  return my.getAuthCode({
    ...opts,
    success(res) {
      opts.success &&
        opts.success({
          code: res.authCode,
        });
    },
  });
}
