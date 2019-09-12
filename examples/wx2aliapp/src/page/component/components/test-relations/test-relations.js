Component({
  props:{},
  relations: {
    './index': {
      type: 'child',
      linked(target) {
        console.info('linked =====> current: test-relations', this.is ,target)
      }
    }
  },
  created() {
    console.log('test-relations init')
  }
})
