export const request = opts => {
  const {header, success} = opts
  const innerRequest = my.request || my.httpRequest;
  return innerRequest({
    ...opts,
    headers: header || opts.headers,
    success(res) {
      const {data, status, headers} = res;
      success && success({
        data,
        statusCode: status,
        header: headers
      })
    }
  })
}
