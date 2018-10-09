'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransformAttr = createTransformAttr;
exports.createTransformAttrValue = createTransformAttrValue;
exports.default = transformer;

var _mapping = require('./mapping');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENTER_STR = '\n ';

/**
 * 通用属性名转换 
 * @example wx:if => s-if
 * @param {*} source 
 * @param {*} target 
 */
function createTransformAttr(source, target) {
  if (source === target) {
    return function (node) {
      return node;
    };
  }

  var sourceAttr = _mapping.mapping.attr[source];
  var targetAttr = _mapping.mapping.attr[target];
  return function (node) {
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
    return node;
  };
}

var MATCH_BRACE = /(?:{)+([^}]+)(?:})+/;

function createTransformAttrValue(source, target) {
  if (source === target) {
    return function (node) {
      return node;
    };
  }

  var selector = {
    'swan': transformSwan
  };

  return selector[target];
}

/**
 * swan 转换器
 * @param {*} node 
 */
function transformSwan(node) {
  // template: data={{}} => data={{{}}}
  var attrs = node.attrs || {};
  if (node.tag === 'template') {
    var data = attrs.data;
    if (!data) return;
    node.attrs.data = data.replace(MATCH_BRACE, function (g, $1) {
      return '{{{' + $1 + '}}}';
    });
  }
  if (node.tag === 'scroll-view') {
    // {{ scroll }} => {= scroll =}
    ['scroll-top', 'scroll-left', 'scroll-into-view'].forEach(function (attr) {
      var contains = !!attrs[attr];
      if (!contains) return;
      node.attrs[attr] = attrs[attr].replace(MATCH_BRACE, function (g, $1) {
        return '{= ' + $1 + ' =}';
      });
    });
  }
  // https://smartapp.baidu.com/docs/develop/framework/view_for/
  // s-for与s-if不可在同一标签下同时使用。
  var keys = Object.keys(attrs);
  if (keys.includes('s-for') && keys.includes('s-if')) {
    var value = attrs['s-if'];
    delete node.attrs['s-if'];
    debugger;
    node.content = [ENTER_STR, cloneNode(node), ENTER_STR];
    node.tag = 'block';
    node.attrs = {
      's-if': value
    };
  }

  return node;
}

function transformer(options) {
  var source = options.source,
      target = options.target;

  var transformAttr = createTransformAttr(source, target);
  var transformAttrValue = createTransformAttrValue(source, target);
  return [transformAttr, transformAttrValue];
}

function cloneNode(node) {
  return _lodash2.default.cloneDeep(node);
}