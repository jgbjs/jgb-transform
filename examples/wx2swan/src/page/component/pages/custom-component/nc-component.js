Component({
  data: {
    count: 1
  },
  props: {
    onCounterPlusOne: (data) => console.log(data),
    extra: 'default extra',
  },
  mixins: [{
    didMount() {
      console.log('mixin didMount')
    }
  }],
  didUpdate(prevProps, prevData) {
    console.log(`didUpdate`, prevProps, prevData)
  },
  didUnmount() {
    console.log(`didUnmount`)
  },
  methods: {
    bindClick() {
      this.setData({
        count: this.data.count + 1
      })
      this.props.onCounterPlusOne(this.data.count); // axml中的事件只能由methods中的方法响应
    }
  }
})
