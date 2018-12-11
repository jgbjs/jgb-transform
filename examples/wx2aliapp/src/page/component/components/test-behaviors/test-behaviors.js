import b from './behavior'

Component({
  behaviors: [b],
  data: {
    data: 'wo shi test-behaviors'
  },
  attached() {
    console.log(`Component attached`, this)
  },
  methods: {
    tap(e) {
      console.log(`tap`, e, this)
      this.behaviorTap(e)
    }
  }
})
