'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * attr属性mapping表
 * 以微信小程序为优先,一一对应
 */

var wxAttrs = exports.wxAttrs = ['wx:for', 'wx:for-index', 'wx:for-item', 'wx:key', 'wx:if', 'wx:elif', 'wx:else'];

var swanAttrs = exports.swanAttrs = ['s-for', 's-for-index', 's-for-item', 's-key', // ''
's-if', 's-elif', 's-else'];

var mapping = exports.mapping = {
  attr: {
    wx: wxAttrs,
    s: swanAttrs,
    swan: swanAttrs
  }
};