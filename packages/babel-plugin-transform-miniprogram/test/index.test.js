import pluginTester from 'babel-plugin-tester'
import * as path from 'path'
import plugin from '../src'

const beautify = require('js-beautify').js

function pretty(data) {
  return beautify(data, {
    indent_size: 2,
    space_in_empty_paren: true
  })
}

pluginTester({
  pluginName: `babel-plugin-transform-wx-to-swan`,
  plugin,
  pluginOptions: {
    source: 'wx',
    target: 'swan',
  },
  // fixtures: path.join(__dirname, 'fixtures'),
  tests: {
    "wx.request({})": {
      code: "wx.request({});",
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";      
      swan.request({});`)
    },
    [`wx["request"]({})`]: {
      code: `wx["request"]({});`,
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      swan["request"]({});`),
    },
    "var request = wx.request": {
      code: `var request = wx.request;`,
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      var request = swan.request;`)
    },
    "var temp = wx": {
      code: `var temp = wx;`,
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      var temp = swan;`)
    },
    "var systemInfo = wx.getSystemInfoSync();": {
      code: `var systemInfo = wx.getSystemInfoSync();`,
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      var systemInfo = swan.getSystemInfoSync();`)
    },
    [`export default wx`]: {
      code: `export default wx`,
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      export default swan;`)
    },
    [`module.exports = wx;`]: {
      code: `module.exports = wx;`,
      output: pretty(`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      module.exports = swan;`)
    },
    "ali: var request = wx.request": {
      code: `var request = wx.request;`,
      output: pretty(`import my from "miniapp-adapter/lib/platform/aliapp/index.js";
      var request = my.request;`),
      pluginOptions: {
        target: 'my',
      },
    }
  },
})
