/**
 * 解析路径
 *    resolvePath('/index', './current') => 'current'
 */
export function pathResolve(route, url) {
  if (!url) {
    return route;
  }

  if (url[0] === '/') {
    // /index
    url = url.substr(1);
    return pathResolve('', url);
  }

  if (url[0] !== '.') {
    // index
    return pathResolve(route, `./${url}`);
  }

  let current = route.split('/');

  if (url[0] === '.' && url[1] === '/') {
    // ./index
    url = url.substr(2);
    if (url[0] !== '.') {
      if (current.length) {
        current[current.length - 1] = url;
      } else {
        current = [url];
      }
      return current.length === 1 ? current[0] : current.join('/');
    }
    return pathResolve(current.join('/'), url);
  }


  if (url[0] === '.' && url[1] === '.' && url[2] === '/') {
    // ../index || ....../index || ../../../index
    url = url.replace(/^\.*/gi, '');
    current.pop();
    return pathResolve(current.join('/'), `.${url}`);
  }
  
  if (url[0] === '.') {
    return pathResolve(route, url.substr(1));
  }
}
