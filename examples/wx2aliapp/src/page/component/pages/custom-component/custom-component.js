Page({
  data: {
    mprop: 'test-props',
    extra: 'custom-component-data-extra'
  },
  changeTestPropsValue() {
    this.setData({
      mprop: 'test-props [changed]'
    })
  },
  getComponent() {
    const comps = this.selectComponent('.test')
    console.log(comps)
  },
  onGetProp(e) {
    console.log('onGetProp', e)
  }
})
