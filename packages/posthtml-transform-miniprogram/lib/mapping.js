'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getMapping;
/**
 * attr属性mapping表
 * 以微信小程序为优先,一一对应
 */

var wxAttrs = ['wx:for', 'wx:for-index', 'wx:for-item', 'wx:key', 'wx:if', 'wx:elif', 'wx:else'];

var swanAttrs = ['s-for', 's-for-index', 's-for-item', 's-key', // ''
's-if', 's-elif', 's-else'];

var MATCH_BRACE = /(?:{)+([^}]+)(?:})+/;

var swanTranformAttrValue = function swanTranformAttrValue(node) {
  // template: data={{}} => data={{{}}}
  if (node.tag === 'template') {
    var data = node.attrs.data;
    if (!data) return;
    node.attrs.data = data.replace(MATCH_BRACE, function (g, $1) {
      return '{{{' + $1 + '}}}';
    });
  }
  if (node.tag === 'scroll-view') {
    // {{ scroll }} => {= scroll =}
    ['scroll-top', 'scroll-left', 'scroll-into-view'].forEach(function (attr) {
      var contains = !!node.attrs[attr];
      if (!contains) return;
      node.attrs[attr] = node.attrs[attr].replace(MATCH_BRACE, function (g, $1) {
        return '{= ' + $1 + ' =}';
      });
    });
  }
  return node;
};

var mapping = {
  attr: {
    wx: wxAttrs,
    s: swanAttrs,
    swan: swanAttrs
  },
  attrValue: {
    wx: function wx(node) {
      return node;
    },
    s: swanTranformAttrValue,
    swan: swanTranformAttrValue
  }
};

function getMapping(source, target) {
  return {
    attr: {
      source: ignoreEmptyAttr(mapping.attr[source]),
      target: ignoreEmptyAttr(mapping.attr[target])
    },
    attrValue: mapping.attrValue[target]
  };
}

function ignoreEmptyAttr(attrs) {
  return attrs.filter(function (attr) {
    return !!attr;
  });
}