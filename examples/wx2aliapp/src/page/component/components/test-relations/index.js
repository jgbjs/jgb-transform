Component({
  props: {},
  relations: {
    './test-relations': {
      type: 'parent',
      linked(target) {
        console.info('linked =====> current: test-relations-index', this.is, target)
      }
    }
  },
  created() {
    console.log('test-relations-index init')
  }
})
