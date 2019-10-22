export function ProxyInvokePlatformApi(api = {}) {
  // if (typeof Proxy !== "undefined") {
  //   const proxyApi = new Proxy(
  //     {},
  //     {
  //       get(target, key, receiver) {
  //         if (api[key]) return api[key];

  //         // almost all wx[key] is a function
  //         return () => {
  //           console.warn(`invoke wx.${key}, but not achieve function`);
  //         };
  //       },
  //       set(target, key, value) {
  //         api[key] = value;
  //         return value;
  //       }
  //     }
  //   );

  //   return proxyApi
  // }
  return api;
}

export function Extend(obj, newObj) {
  return Object.assign(obj, newObj);
}

export function ExtendExistValue(obj, newObj) {
  const keys = Object.keys(newObj)
  keys.forEach(key => {
    const value = newObj[key]
    if(typeof value !== undefined) {
      obj[key] = value;
    }
  })
  return obj
}

export function defineProperty(ctx, name, value) {
  Object.defineProperty(ctx, name, {
    get() {
      return value
    },
    set(v) {
      value = v
    }
  })
}
