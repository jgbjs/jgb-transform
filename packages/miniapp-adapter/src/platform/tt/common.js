/**
 * 在字节小程序中： https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/custom-component/component-constructor
 * selectComponent、selectAllComponents、getRelationNodes API 均为异步 API，需要指定回调函数
 * 但在 1.16.2.0 版本后支持同步写法
 * 现在统一添加后缀表示异步写法，返回Promise
 * @param {*} methods
 */
export function addAsyncMethod(methods) {
  ["selectComponent", "selectAllComponents", "getRelationNodes"].forEach(
    (key) => {
      methods[`${key}Async`] = function (selector, cb) {
        const p = new Promise((resolve) => {
          if (typeof cb === "function") {
            cb();
          }
          this[key](selector, resolve);
        });
        return tryProxyPromise(p);
      };
    }
  );
  return methods;
}

/**
 * 由于需要针对 selectComponent等接口的异步化
 * 需要对同步写法兼容
 */
function tryProxyPromise(promise) {
  let value;

  promise.then((v) => {
    value = v;
  });

  return new Proxy(promise, {
    get(target, property) {
      if (target[property]) {
        if (typeof promise[property] === "function")
          return promise[property].bind(promise);

        return promise[property];
      }

      if (value) {
        return value[property];
      }
      return createLazyFunction(target, property, promise);
    },
    set(obj, prop, v) {
      if (value) {
        value[prop] = v;
      }
    },
  });
}

/**
 * 延迟执行方法
 */
function createLazyFunction(ctx, key, promise) {
  return new Proxy(() => {}, {
    apply(target, thisArg, argumentsList) {
      promise.then((value) => {
        if(!value) return;
        const fn = value[key];
        if (typeof fn === "function") {
          fn.apply(ctx, argumentsList);
        }
      });
    },
  });
}
