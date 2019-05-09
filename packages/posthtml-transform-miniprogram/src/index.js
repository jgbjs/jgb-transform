import Task from './task';
import transformer from './transformer'

function initOptions(options) {
  options = options || {}

  if (options.target === 'my') {
    options.target = 'aliapp'
  }

  return options
}

function transform(options) {
  options = initOptions(options)
  return (tree, callback) => {
    const task = new Task(tree, callback);
    const fns = transformer(options)
    task.append(fns)
    return task.walk();
  }
}

transform.match = function(expression, callback) {
  return function(tree) {
    tree.match(expression, callback);
  }
};

transform.walk = function(callback) {
  return function(tree) {
    tree.walk(callback);
  }
};

module.exports = transform;
export default transform;
