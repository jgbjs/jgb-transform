export function ProxyInvokePlatformApi(api) {
  if (typeof Proxy !== "undefined") {
    const _api = api;
    api = new Proxy(
      {},
      {
        get(target, key, receiver) {
          if (_api[key]) return _api[key];

          // almost all wx[key] is a function
          return () => {
            console.warn(`invoke wx.${key}, but not achieve function`);
          };
        },
        set(target, key, value) {
          _api[key] = value;
        }
      }
    );
  }
  return api;
}

export function Extend(obj, newObj) {
  return Object.assign(obj, newObj);
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
