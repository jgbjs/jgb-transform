# miniapp-adapter

适配基于微信小程序[(文档)](https://developers.weixin.qq.com/miniprogram/dev/api/)
适配不同小程序 API

* 微信小程序(wechat) [default]
* 支付宝小程序(aliapp) (支持90%)
* 百度小程序(baidu) （支持90%）百度微信基本相同

## INSTALL

```bash
yarn add --dev miniapp-adapter babel-plugin-transform-miniprogram
```

## USAGE

适配器搭配babel插件`babel-plugin-transform-miniprogram`来使用

## 适配

### 支付宝

* api
  * createSelectorQuery
  * canvasGetImageData
  * …
* Component
  * relations
  * this.createSelectorQuery
  * this.createIntersectionObserver
  * this.triggerEvent
  * this.selectAllComponents
  * this.selectComponent
* Page
  * this.selectAllComponents
  * this.selectComponent

### 百度

* api
  * nextTick

* Component
  * relations