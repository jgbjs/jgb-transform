import convertLocation from '../../src/utils/convertLocation'

const longitude = 116.404;
const latitude = 39.915;

it('test bd09togcj02', () => {
  const [x, y] = convertLocation.bd09togcj02(longitude, latitude)
  expect(x).toBeCloseTo(116.39762729119315, 10)
  expect(y).toBeCloseTo(39.90865673957631, 10)
})

it('test gcj02tobd09', () => {
  const [x, y] = convertLocation.gcj02tobd09(longitude, latitude)
  expect(x).toBeCloseTo(116.41036949371029, 10)
  expect(y).toBeCloseTo(39.92133699351021, 10)
})

it('test gcj02towgs84', () => {
  const [x, y] = convertLocation.gcj02towgs84(longitude, latitude)
  expect(x).toBeCloseTo(116.39775550083061, 10)
  expect(y).toBeCloseTo(39.91359571849836, 10)
})

it('test wgs84togcj02', () => {
  const [x, y] = convertLocation.wgs84togcj02(longitude, latitude)
  expect(x).toBeCloseTo(116.41024449916938, 10)
  expect(y).toBeCloseTo(39.91640428150164, 10)
})
