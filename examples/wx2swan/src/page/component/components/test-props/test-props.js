Component({
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        console.log('observer myProperty value changed', newVal, oldVal, changedPath)
        this.setData({
          myProperty2: 'myProperty2'
        })
      }
    },
    myProperty2: String // 简化的定义方式
  },
  methods: {
    trigger() {
      this.triggerEvent('getprop', {
        p: this.properties.myProperty
      })
    }
  }
})
