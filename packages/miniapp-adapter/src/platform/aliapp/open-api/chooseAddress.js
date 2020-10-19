export function chooseAddress(opts) {
  return my.getAddress({
    ...opts,
    success(res) {
      const {
        address: detailInfo,
        prov: provinceName,
        city: cityName,
        area: countyName,
        fullname: userName,
        mobilePhone: telNumber,
      } = res;
      opts.success &&
        opts.success({
          userName,
          provinceName,
          cityName,
          countyName,
          detailInfo,
          telNumber,
        });
    },
  });
}
