export function hook(ctx, method, func) {
  const oldFunc = ctx[method];

  ctx[method] = function (...params) {
    func.apply(this, params);
    if (typeof oldFunc === 'function') {
      oldFunc.apply(this, params)
    }
  }

  return ctx;
}
