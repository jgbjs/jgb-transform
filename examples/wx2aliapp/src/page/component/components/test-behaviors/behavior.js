export default Behavior({
  propterties: {
    behaviorProps: String
  },
  data: {
    bdata: 'wo shi behavior'
  },
  attached() {
    console.log(`Behavior attached`, this)
  },
  methods: {
    behaviorTap() {
      console.log(`behaviorTap`)
    },
    getComponent() {
      const coms = this.selectAllComponents('.test')
      console.log(coms)

    }
  }
})
