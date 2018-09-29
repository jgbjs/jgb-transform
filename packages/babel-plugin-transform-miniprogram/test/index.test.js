import pluginTester from 'babel-plugin-tester'
import * as path from 'path'
import plugin from '../src'

pluginTester({
  pluginName: `babel-plugin-transform-wx-to-swan`,
  plugin,
  pluginOptions: {
    SOURCE: 'wx',
    TARGET: 'swan',
  },
  // fixtures: path.join(__dirname, 'fixtures'),
  tests: {
    "wx.request({})": {
      code: "wx.request({});",
      output: "swan.request({});"
    },
    [`wx["request"]({})`]: {
      code: `wx["request"]({});`,
      output: `swan["request"]({});`,
    },
    "var request = wx.request": {
      code: `var request = wx.request;`,
      output: `var request = swan.request;`
    },
    "var temp = wx": {
      code: `var temp = wx;`,
      output: `var temp = swan;`
    },
    [`export default wx`]: {
      code: `export default wx`,
      output: `export default swan;`
    },
    [`module.exports = wx;`]: {
      code: `module.exports = wx;`,
      output: `module.exports = swan;`
    },
    "ali: var request = wx.request": {
      code: `var request = wx.request;`,
      output: `var request = my.request;`,
      pluginOptions: {
        TARGET: 'my',
      },
    }
  },
})
