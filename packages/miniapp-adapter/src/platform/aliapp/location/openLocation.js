export function openLocation(opts) {
  const {latitude, longitude} = opts;
  my.openLocation({
    ...opts,
    longitude: `${longitude}`,
    latitude: `${latitude}`
  })
}
