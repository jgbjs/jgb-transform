# miniapp-adapter

适配基于微信小程序[(文档)](https://developers.weixin.qq.com/miniprogram/dev/api/)
适配不同小程序 API

* 微信小程序(wechat) [default]
* 支付宝小程序(aliapp) (支持70%) 
* 百度小程序(baidu) （支持80%）百度微信基本相同
* html(h5) [TODO]

## INSTALL

```bash
yarn add --dev miniapp-adapter
```

## USAGE

基于 webpack alias

```js
// webpack.config.js
const requireAdapter = require('miniapp-adapter').default

module.exports = {
  resolve: {
    alias: {
      wx: requireAdapter('wechat') // aliapp | baidu | h5
    }
  }
}
```
