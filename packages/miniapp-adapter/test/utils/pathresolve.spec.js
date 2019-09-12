import { pathResolve } from '../../src/utils/pathReolve'

it(`pathResolve('/1/2' , './test')`, () => {
  const result = pathResolve('/1/2', './test')
  expect(result).toBe('/1/test')
})

it(`pathResolve('/1/2/3/4' , './test')`, () => {
  const result = pathResolve('/1/2/3/4', '../../test')
  expect(result).toBe('/1/test')
})

it(`pathResolve('/1/2/3/4' , '/test')`, () => {
  const result = pathResolve('/1/2/3/4', '/test')
  expect(result).toBe('test')
})

it(`pathResolve('/1/2/3/4' , 'test')`, () => {
  const result = pathResolve('/1/2/3/4', 'test')
  expect(result).toBe('/1/2/3/test')
})

it(`pathResolve('1/2/3/4', '../test')`, () => {
  const result = pathResolve('1/2/3/4', '../test')
  expect(result).toBe('1/2/test')
})
