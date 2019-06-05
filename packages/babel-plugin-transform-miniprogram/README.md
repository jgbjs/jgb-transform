# `babel-plugin-transform-miniprogram`

> babel plugin transform miniprogram's api general solution scheme

wx => swan

## Usage

```shell
# install
yarn add babel-plugin-transform-miniprogram --dev
```

.babelrc

```json
{
  "plugins": ["transform-miniprogram"]
}
```

## options

| 选项名 | 说明             | 默认值          | 可选值  |
| ------ | ---------------- | --------------- | ------- |
| source | 需要转义的关键字 | wx              |         |
| target | 替换值           | swan            | swan,my,tt |
| lib    | 适配库（^0.2.0） | miniapp-adapter |         |

## details

* v0.3.1 起支持支付宝转换，转换适配 *Component =>  AdapterComponent*, *Page => AdapterPage*，*Behavior => AdapterBehavior*, 适配库 **miniapp-adpater（^1.3.0）**

* 可以在文件中设置忽略关键字 **@jgb-ignore** 忽略转换。e.g.

  ```js
  // @jgb-ignore
  ```
