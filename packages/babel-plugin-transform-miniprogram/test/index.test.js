import pluginTester from "babel-plugin-tester";
import * as fs from "fs";
import * as path from "path";
import plugin from "../src";

const beautify = require("js-beautify").js;

function pretty(data) {
  return beautify(data, {
    indent_size: 2,
    space_in_empty_paren: true,
  });
}

function wrapTests(tests) {
  const keys = Object.keys(tests);
  keys.forEach((key) => {
    const value = tests[key];
    if (typeof value === "object") {
      value.code = pretty(value.code);
      value.formatResult = (code) => pretty(code);
      value.output = pretty(value.output);
      tests[key] = value;
    }
  });
  return tests;
}

function PluginTester(params) {
  params.tests = wrapTests(params.tests);
  params.babelOptions = {
    babelrc: false,
    configFile: false,
  }
  pluginTester(params);
}

PluginTester({
  pluginName: `babel-plugin-transform-wx-to-aliapp-collect-extenal-classes`,
  plugin,
  pluginOptions: {
    source: "wx",
    target: "my",
  },
  tests: {
    [`Component externalClasses`]: {
      code: `
      Component({
        externalClasses: ['custom-class']
      })`,
      output: `
      import { AdapterComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterComponent({
        externalClasses: ['custom-class']
      }, Component);`,
      teardown() {
        // 转换之后会有.externalClasses项目根目录中
        const json = fs.readFileSync(".externalClasses", { encoding: "utf-8" });
        expect(json.includes("custom-class")).toBe(true);
      },
    },
  },
});

PluginTester({
  pluginName: `babel-plugin-transform-wx-to-swan`,
  plugin,
  pluginOptions: {
    source: "wx",
    target: "swan",
  },
  // fixtures: path.join(__dirname, 'fixtures'),
  tests: {
    "const defefine wx: not transform": {
      code: `const wx = {};
      wx.request({});`,
      output: `const wx = {};wx.request({});`,
    },
    "import wx: not transfrom": {
      code: `import wx from 'xxxx';
      wx.request({});`,
      output: `import wx from 'xxxx';
      wx.request({});`,
    },
    "wx.request({})": {
      code: "wx.request({});",
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";      
      wx.request({});`,
    },
    [`wx["request"]({})`]: {
      code: `wx["request"]({});`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      wx["request"]({});`,
    },
    "var request = wx.request": {
      code: `var request = wx.request;`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      var request = wx.request;`,
    },
    "var temp = wx": {
      code: `var temp = wx;`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      var temp = wx;`,
    },
    "var systemInfo = wx.getSystemInfoSync();": {
      code: `var systemInfo = wx.getSystemInfoSync();`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      var systemInfo = wx.getSystemInfoSync();`,
    },
    [`export default wx`]: {
      code: `export default wx`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      export default wx;`,
    },
    [`module.exports = wx;`]: {
      code: `module.exports = wx;`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      module.exports = wx;`,
    },
    [`function get(ctx = wx) {}`]: {
      code: `function get(ctx = wx) {}`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      function get(ctx = wx) {}`,
    },
    [`(ctx || wx).createSelectorQuery()`]: {
      code: `(ctx || wx).createSelectorQuery();`,
      output: `import wx from "miniapp-adapter/lib/platform/baidu/index.js";
      (ctx || wx).createSelectorQuery();`,
    },
  },
});

PluginTester({
  pluginName: `babel-plugin-transform-wx-to-aliapp`,
  plugin,
  pluginOptions: {
    source: "wx",
    target: "my",
  },
  tests: {
    "contains my and wx": {
      code: `
      wx.showToast({});
      my.Page({});`,
      output: `
      import wx from "miniapp-adapter/lib/platform/aliapp/index.js";
      wx.showToast({});
      my.Page({}); `,
    },
    "test ignore key: @jgb-ignore": {
      code: `// @jgb-ignore
      wx.request();
      Component({});`,
      output: `// @jgb-ignore
      wx.request();
      Component({});`,
    },
    "ali: var request = wx.request": {
      code: `var request = wx.request;`,
      output: `import wx from "miniapp-adapter/lib/platform/aliapp/index.js";
      var request = wx.request;`,
      pluginOptions: {
        target: "my",
      },
    },
    "ali: replace Component": {
      code: `Component({});`,
      output: `import { AdapterComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterComponent({}, Component);`,
    },
    "ali: replace Behavior": {
      code: `Behavior({});`,
      output: `import { AdapterBehavior } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterBehavior({});`,
    },
    "ali: replace Page": {
      code: `Page({});`,
      output: `import { AdapterPage } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterPage({}, Page);`,
    },
    "ali: replace App": {
      code: `App({});`,
      output: `import { AdapterApp } from "miniapp-adapter/lib/platform/aliapp/index.js";
      AdapterApp({}, App);`,
    },
    "Page assignment": {
      code: `const oldPage = Page;
      wx.Page = Page;`,
      output: `import wx, { WrapPage } from "miniapp-adapter/lib/platform/aliapp/index.js";
      const oldPage = WrapPage(Page);
      wx.Page = WrapPage(Page);`,
    },
    "Component assignment": {
      code: `const oldComponent = Component;
      wx.Component = Component;`,
      output: `import wx, { WrapComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      const oldComponent = WrapComponent(Component);
      wx.Component = WrapComponent(Component);`,
    },
    "already transfrom import demo": {
      code: `
      import wx, { WrapComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      wx.getInfo();
      const oldComponent = WrapComponent(Component);
      `,
      output: `
      import wx, { WrapComponent } from "miniapp-adapter/lib/platform/aliapp/index.js";
      wx.getInfo();
      const oldComponent = WrapComponent(Component);
      `,
    },
    "already transfrom require demo": {
      code: `
      const index = require("miniapp-adapter/lib/platform/aliapp/index.js");

      const wx = index;
      const { WrapComponent } = index;      
      wx.getInfo();
      const oldComponent = WrapComponent(Component);
      `,
      output: `
      const index = require("miniapp-adapter/lib/platform/aliapp/index.js");
      
      const wx = index;
      const { WrapComponent } = index;
      wx.getInfo();
      const oldComponent = WrapComponent(Component);
      `,
    },
  },
});

PluginTester({
  pluginName: `babel-plugin-transform-wx-to-tt`,
  plugin,
  pluginOptions: {
    source: "wx",
    target: "tt",
  },
  // fixtures: path.join(__dirname, 'fixtures'),
  tests: {
    "this.selectComponent('asdf')": {
      code: `({
        func() {
          const c = this.selectComponent('asdf');
          this.c = this.selectComponent('asdf');
        },
        ret() {
          return this.selectComponent('asdf');
        }
      })`,
      output: `({
        async func() {
          const c = await this.selectComponentAsync('asdf');
          this.c = this.selectComponentAsync('asdf');
          this.c = await this.selectComponentAsync('asdf');
        },
        
        ret() {
          return this.selectComponentAsync('asdf');
        }

      });`,
    },
    "this.selectComponent('asdf'); mulity": {
      code: `({
        func() {
          const c = this.selectComponent('asdf');
          const comp = this.selectComponent('asdf123');
        }
      })`,
      output: `({
        async func() {
          const c = await this.selectComponentAsync('asdf');
          const comp = await this.selectComponentAsync('asdf123');
        }
        
      });`,
    },
    "const defefine wx: not transform": {
      code: `const wx = {};
      wx.request({});`,
      output: `const wx = {};wx.request({});`,
    },
    "import wx: not transfrom": {
      code: `import wx from 'xxxx';
      wx.request({});`,
      output: `import wx from 'xxxx';
      wx.request({});`,
    },
    "wx.request({})": {
      code: "wx.request({});",
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";      
      wx.request({});`,
    },
    [`wx["request"]({})`]: {
      code: `wx["request"]({});`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      wx["request"]({});`,
    },
    "var request = wx.request": {
      code: `var request = wx.request;`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      var request = wx.request;`,
    },
    "var temp = wx": {
      code: `var temp = wx;`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      var temp = wx;`,
    },
    "var systemInfo = wx.getSystemInfoSync();": {
      code: `var systemInfo = wx.getSystemInfoSync();`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      var systemInfo = wx.getSystemInfoSync();`,
    },
    [`export default wx`]: {
      code: `export default wx`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      export default wx;`,
    },
    [`module.exports = wx;`]: {
      code: `module.exports = wx;`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      module.exports = wx;`,
    },
    [`function get(ctx = wx) {}`]: {
      code: `function get(ctx = wx) {}`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      function get(ctx = wx) {}`,
    },
    [`(ctx || wx).createSelectorQuery()`]: {
      code: `(ctx || wx).createSelectorQuery();`,
      output: `import wx from "miniapp-adapter/lib/platform/tt/index.js";
      (ctx || wx).createSelectorQuery();`,
    },
  },
});
