exports.default = {
  request({
    success
  }){
    console.log('invoke h5 request')
    success('success')
  }
}