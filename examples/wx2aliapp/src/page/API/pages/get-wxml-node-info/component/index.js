// test selectorQuery.in()
Component({
  data: {
    width: 0,
    height: 0,
    left: 0,
    top: 0
  },
  attached() {
    this.createSelectorQuery('.query-node')
      .select('.query-node')
      .boundingClientRect()
      .exec((res) => {
        const [result] = res;
        this.setData(result)
      })
  }
})
