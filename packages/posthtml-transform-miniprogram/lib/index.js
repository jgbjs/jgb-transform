'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapping = require('./mapping');

var _mapping2 = _interopRequireDefault(_mapping);

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _transformer = require('./transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initOptions(options) {
  options = options || {};
  options.source = 'wx';
  options.target = 'swan';
  return options;
}

function transform(options) {
  options = initOptions(options);
  return function (tree, callback) {
    var task = new _task2.default(tree, callback);
    var fns = (0, _transformer2.default)(options);
    task.append(fns);
    return task.walk();
  };
}

transform.match = function (expression, callback) {
  return function (tree) {
    tree.match(expression, callback);
  };
};

transform.walk = function (callback) {
  return function (tree) {
    tree.walk(callback);
  };
};

module.exports = transform;
exports.default = transform;