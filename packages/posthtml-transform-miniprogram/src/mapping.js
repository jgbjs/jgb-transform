/**
 * attr属性mapping表
 * 以微信小程序为优先,一一对应
 */

export const wxAttrs = [
  'wx:for',
  'wx:for-index',
  'wx:for-item',
  'wx:key',
  'wx:if',
  'wx:elif',
  'wx:else'
]

export const swanAttrs = [
  's-for',
  's-for-index',
  's-for-item',
  's-key', // ''
  's-if',
  's-elif',
  's-else'
]

export const aliappAttrs = [
  'a:for',
  'a:for-index',
  'a:for-item',
  'a:key',
  'a:if',
  'a:elif',
  'a:else'
]

// 头条
export const ttAttrs = [
  'tt:for',
  'tt:for-index',
  'tt:for-item',
  'tt:key',
  'tt:if',
  'tt:elif',
  'tt:else'
]

export const mapping = {
  attr: {
    wx: wxAttrs,
    swan: swanAttrs,
    aliapp: aliappAttrs,
    tt: ttAttrs
  }
}
