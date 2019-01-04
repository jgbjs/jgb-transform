export const request = opts => {
  const {header, success} = opts
  return my.httpRequest({
    ...opts,
    headers: header,
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
