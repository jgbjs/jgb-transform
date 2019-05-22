const p = Promise.resolve()

export function nextTick(cb) {
  p.then(cb)
}
