export const request = opts => {
  const { success } = opts
  const innerRequest = my.request || my.httpRequest;
  // 默认的请求的ContentType为 json
  const headers = Object.assign({
    'Content-Type': 'application/json'
  }, opts.header || opts.headers || {});

  return innerRequest({
    ...opts,
    headers,
    success(res) {
      const { data, status, headers } = res;
      success && success({
        data,
        statusCode: status,
        header: headers
      })
    }
  })
}

export const httpRequest = request;
