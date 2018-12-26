'use strict';

const posthtml = require('posthtml')
const format = require('pretty');
const transform = require('../src/index');


expect.extend({
  async transformSwan(received, expected) {
    let html = await processHtml(received)
    html = format(html);
    expected = format(expected)
    const pass = html === expected
    if (!pass) {
      console.log(html, '\n', expected)
    }
    return {
      pass,
      message: () => pass ? `` : `not match`
    }
  },
  async transfromAliapp(received, expected) {
    let html = await processHtml(received, 'aliapp')
    html = format(html);
    expected = format(expected)
    const pass = html === expected
    if (!pass) {
      console.log(html, '\n', expected)
    }
    return {
      pass,
      message: () => pass ? `` : `not match`
    }
  }
})

function processHtml(received, target = 'swan') {
  return new Promise((resolve) => {
    posthtml()
      .use(transform({
        source: 'wx',
        target
      }))
      .process(received, {
        closingSingleTag: 'slash'
      })
      .then((result) => resolve(format(result.html)))
  })
}

describe('wx => aliapp', () => {
  test('wx:if => a:if', async () => {
    await expect(`<view wx:if="{{data}}"></view>`)
      .transfromAliapp(`<view a:if="{{data}}"></view>`)
  })

  test('<scroll-view> event', async () => {
    await expect(`<scroll-view bindscrolltoupper="bindscrolltoupper" bindscrolltolower="bindscrolltolower" bindscroll="bindscroll"></scroll-view>`)
      .transfromAliapp(`<scroll-view onScrollToUpper="bindscrolltoupper" onScrollToLower="bindscrolltolower" onScroll="bindscroll"></scroll-view>`)
  })

  test('ali origin event like will not tranform', async () => {
    await expect(`<view onTap="bind">
    <view class="chooseCar" onTap="bindChooseCar"></view>
    </view>`)
      .transfromAliapp(`<view onTap="bind">
      <view class="chooseCar" onTap="bindChooseCar"></view>
      </view>`)
  })
})

describe('wx => swan', () => {
  test('wx:if => s-if', async () => {
    await expect(`<view wx:if="{{data}}"></view>`)
      .transformSwan(`<view s-if="{{data}}"></view>`)
  });

  test('wx:for => s-for', async () => {
    await expect(`<view wx:for="{{data}}" wx:for-item="item" wx:for-index="idx" wx:key="key"></view>`)
      .transformSwan(`<view s-for="{{data}}" s-for-item="item" s-for-index="idx" s-key="key"></view>`)
  })

  test(`wx:if => s-if`, async () => {
    await expect(`
    <view wx:if="{{length > 5}}"> 1 </view>
    <view wx:elif="{{length > 2}}"> 2 </view>
    <view wx:else> 3 </view>`)
      .transformSwan(format(`
    <view s-if="{{length > 5}}"> 1 </view>
    <view s-elif="{{length > 2}}"> 2 </view>
    <view s-else> 3 </view>`))
  })

  test(`template: {{}} => {{{}}}`, async () => {
    await expect(`<template is="msgItem" data="{{...item}}" />`)
      .transformSwan(`<template is="msgItem" data="{{{...item}}}"></template>`)
  })

  test(`scroll-view: {{data}} => {= data =}`, async () => {
    await expect(`<scroll-view scroll-top="{{scrollTop}}"></scroll-view>`)
      .transformSwan(`<scroll-view scroll-top="{= scrollTop =}"></scroll-view>`)
  })

  test(`auto add block when wx:if and wx:for in same tag`, async() => {
    await expect(`
    <view wx:for="{{items}}" wx:if="{{items}}">
      <view>data</view>
    </view>`)
      .transformSwan(format(`
    <block s-for="{{items}}">
      <view s-if="{{items}}">
        <view>data</view>
      </view>
    </block>`))

  })
})
