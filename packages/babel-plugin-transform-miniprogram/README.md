# `babel-plugin-transform-miniprogram`

> babel plugin transform miniprogram's api general solution scheme

## default

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

| 选项名 | 说明             | 默认值          |
| ------ | ---------------- | --------------- |
| source | 需要转义的关键字 | wx              |
| target | 替换值           | swan            |
| lib    | 适配库（^0.2.0） | miniapp-adapter |


