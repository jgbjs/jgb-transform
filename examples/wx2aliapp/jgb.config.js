module.exports = {
  cache: false,
  // "entryFiles": ['page/API/index.js'],
  // "entryFiles": ['test/about.axml'],
  "entryFiles": ['app.js', 'app.json', 'app.wxss'],
  alias: {
    "miniapp-adapter/lib": "../../packages/miniapp-adapter/src"
  },
  presets: ['aliapp'],
  plugins: [['css', {
    outExt: '.acss',
    extensions: ['.wxss'],
  }], ['html', {
    extensions: ['.wxml'],
    outExt: '.axml'
  }]]
}
