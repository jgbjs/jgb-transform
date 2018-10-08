'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapping = require('./mapping');

var _mapping2 = _interopRequireDefault(_mapping);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initOptions(options) {
  options = options || {};
  options.source = 'wx';
  options.target = 's';
  return options;
}

function transform(options) {
  options = initOptions(options);
  var _options = options,
      source = _options.source,
      target = _options.target;

  var mapping = (0, _mapping2.default)(source, target);
  return function (tree, callback) {
    var sourceAttr = mapping.attr.source;
    var targetAttr = mapping.attr.target;
    var transfromAttrValue = mapping.attrValue;

    tree.walk(function (node) {
      var attrs = node.attrs;
      if (!attrs) return node;
      Object.keys(attrs).forEach(function (key) {
        var idx = sourceAttr.findIndex(function (attr) {
          return attr === key;
        });
        if (idx >= 0) {
          var attr = targetAttr[idx];
          var value = attrs[key];
          // some empty attr in posthtml like [s-else] will be tranform to [s-else=""]
          // so we should avoid tramform
          attrs[attr] = value === '' ? true : value;
          delete attrs[key];
        }
      });

      return transfromAttrValue(node);
    });
    callback(null, tree);
    return tree;
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