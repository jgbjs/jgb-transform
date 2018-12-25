module.exports = {
  cache: false,
  // "entryFiles": ['page/API/index.js'],
  "entryFiles": ['app.js',  'app.json', 'app.wxss' ],
  presets: ['aliapp'],
  plugins: [['css', {
    outExt: '.acss',
    extensions: ['.wxss'],
  }], ['html', {
    extensions: ['.wxml'],
    outExt: '.axml'
  }]]
}