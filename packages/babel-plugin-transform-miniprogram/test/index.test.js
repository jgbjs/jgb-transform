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

function wrapTests(tests) {
  const keys = Object.keys(tests)
  keys.forEach(key => {
    const value = tests[key]
    if (typeof value === 'object') {
      value.code = pretty(value.code)
      value.formatResult = (code) => pretty(code)
      value.output = pretty(value.output)
      tests[key] = value
    }
  })
  return tests
}

function PluginTester(params) {
  params.tests = wrapTests(params.tests)
  pluginTester(params)
}

PluginTester({
  pluginName: `babel-plugin-transform-wx-to-swan`,
  plugin,
  pluginOptions: {
    source: 'wx',
    target: 'swan',
  },
  // fixtures: path.join(__dirname, 'fixtures'),
  tests: {
    "const defefine wx: not transform": {
      code: (`const wx = {};
      wx.request({});`),
      output: (`const wx = {};wx.request({});`)
    },
    "import wx: not transfrom": {
      code: (`import wx from 'xxxx';
      wx.request({});`),
      output: (`import wx from 'xxxx';
      wx.request({});`)
    },
    "wx.request({})": {
      code: "wx.request({});",
      output: (`import swan from "miniapp-adapter/lib/platform/baidu/index.js";      
      swan.request({});`)
    },
    [`wx["request"]({})`]: {
      code: `wx["request"]({});`,
      output: (`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      swan["request"]({});`),
    },
    "var request = wx.request": {
      code: `var request = wx.request;`,
      output: (`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      var request = swan.request;`)
    },
    "var temp = wx": {
      code: `var temp = wx;`,
      output: (`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      var temp = swan;`)
    },
    "var systemInfo = wx.getSystemInfoSync();": {
      code: `var systemInfo = wx.getSystemInfoSync();`,
      output: (`import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      var systemInfo = swan.getSystemInfoSync();`)
    },
    [`export default wx`]: {
      code: `export default wx`,
      output: `import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      export default swan;`
    },
    [`module.exports = wx;`]: {
      code: `module.exports = wx;`,
      output: `import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      module.exports = swan;`
    },
    [`function get(ctx = wx) {}`]: {
      code: `function get(ctx = wx) {}`,
      output: `import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      function get(ctx = swan) {}`
    },
    [`(ctx || wx).createSelectorQuery()`]: {
      code: `(ctx || wx).createSelectorQuery();`,
      output: `import swan from "miniapp-adapter/lib/platform/baidu/index.js";
      (ctx || swan).createSelectorQuery();`
    },
    [`swan: will not tranform Page,Component,Behavior,App`]: {
      code: `Component({});
      App({});
      Page({});
      Behavior({});`,
      output: `Component({});
      App({});
      Page({});
      Behavior({});`
    }
  },
})

PluginTester({
  pluginName: `babel-plugin-transform-wx-to-aliapp`,
  plugin,
  pluginOptions: {
    source: 'wx',
    target: 'my',
  },
  tests: {
    "test ignore key: @jgb-ignore": {
      code: `// @jgb-ignore
      wx.request();
      Component({});`,
      output: `// @jgb-ignore
      wx.request();
      Component({});`
    },
    "ali: var request = wx.request": {
      code: `var request = wx.request;`,
      output: `import my from "miniapp-adapter/lib/platform/aliapp/index.js";
      var request = my.request;`,
      pluginOptions: {
        target: 'my',
      },
    },
    "ali: replace Component": {
      code: `Component({});`,
      output: `import { AdapterComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterComponent({}, Component);`
    },
    "ali: replace Behavior": {
      code: `Behavior({});`,
      output: `import { AdapterBehavior } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterBehavior({});`
    },
    "ali: replace Page": {
      code: `Page({});`,
      output: `import { AdapterPage } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterPage({}, Page);`
    },
    "ali: while not replace App": {
      code: `App({});`,
      output: `App({});`,
    },
    "Page assignment": {
      code: `const oldPage = Page;
      wx.Page = Page;`,
      output: `import my, { WrapPage } from "miniapp-adapter/lib/platform/aliapp/index.js";
      const oldPage = WrapPage(Page);
      my.Page = WrapPage(Page);`
    },
    "Component assignment": {
      code: `const oldComponent = Component;
      wx.Component = Component;`,
      output: `import my, { WrapComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      const oldComponent = WrapComponent(Component);
      my.Component = WrapComponent(Component);`
    }
  }
})
