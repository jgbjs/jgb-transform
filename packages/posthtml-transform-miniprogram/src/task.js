export default class Task {
  constructor(tree, callback) {
    this.tree = tree
    this.callback = callback
    this.fns = []
    this.asyncTasks = 0;
    this.completed = false
  }

  walk() {
    this.tree.walk((node) => this.fns.reduce((lnode, fn) => {
      return fn(lnode, this.addAsyncTasks.bind(this), this.done.bind(this))
    }, node))
    this.completed = true
    this.done()
    return this.tree
  }

  addAsyncTasks() {
    this.asyncTasks++;
  }

  destory() {
    this.fns.length = 0;
  }

  done(isTaskDone = false) {
    if (isTaskDone) this.asyncTasks--;
    if (!this.asyncTasks && this.completed) {
      this.destory()
      this.callback(null, this.tree)
    }
  }

  append(fn) {
    if (Array.isArray(fn)) {
      fn.forEach(f => this.append(f))
    }

    if (typeof fn === 'function')
      this.fns.push(fn)
  }
}
