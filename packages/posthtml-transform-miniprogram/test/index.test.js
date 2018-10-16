'use strict';

const posthtml = require('posthtml')
const format = require('pretty');
const transform = require('../src/index');

expect.extend({
  async transformer(received, expected) {
    const html = await new Promise((resolve) => {
      posthtml()
        .use(transform())
        .process(received, {
          closingSingleTag: 'slash'
        })
        .then((result) => resolve(format(result.html)))
    })
    debugger;
    const pass = html === expected
    return {
      pass,
      message: () => pass ? `` : `not match`
    }
  }
})

describe('wx => swan', () => {
  test('wx:if => s-if', async () => {
    await expect(`<view wx:if="{{data}}"></view>`)
      .transformer(`<view s-if="{{data}}"></view>`)
  });

  test('wx:for => s-for', async () => {
    await expect(`<view wx:for="{{data}}" wx:for-item="item" wx:for-index="idx" wx:key="key"></view>`)
      .transformer(`<view s-for="{{data}}" s-for-item="item" s-for-index="idx" s-key="key"></view>`)
  })

  test(`wx:if => s-if`, async () => {
    await expect(`
    <view wx:if="{{length > 5}}"> 1 </view>
    <view wx:elif="{{length > 2}}"> 2 </view>
    <view wx:else> 3 </view>`)
      .transformer(format(`
    <view s-if="{{length > 5}}"> 1 </view>
    <view s-elif="{{length > 2}}"> 2 </view>
    <view s-else> 3 </view>`))
  })

  test(`template: {{}} => {{{}}}`, async () => {
    await expect(`<template is="msgItem" data="{{...item}}" />`)
      .transformer(`<template is="msgItem" data="{{{...item}}}"></template>`)
  })

  test(`scroll-view: {{data}} => {= data =}`, async () => {
    await expect(`<scroll-view scroll-top="{{scrollTop}}"></scroll-view>`)
      .transformer(`<scroll-view scroll-top="{= scrollTop =}"></scroll-view>`)
  })

  test(`auto add block when wx:if and wx:for in same tag`, async() => {
    await expect(`
    <view wx:for="{{items}}" wx:if="{{items}}">
      <view>data</view>
    </view>`)
      .transformer(format(`
    <block s-for="{{items}}">
      <view s-if="{{items}}">
        <view>data</view>
      </view>
    </block>`))

  })
})
