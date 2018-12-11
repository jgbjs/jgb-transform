Page({
  data: {
    mprop: 'test-props',
  },
  changeTestPropsValue() {
    this.setData({
      mprop: 'test-props [changed]'
    })
  },
  getComponent() {
    const comps = this.selectAllComponents('.test')
    console.log(comps)
  }
})
