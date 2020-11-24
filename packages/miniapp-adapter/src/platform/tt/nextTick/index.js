const p = Promise.resolve()

export function nextTick(cb) {
  return p.then(cb)
}
