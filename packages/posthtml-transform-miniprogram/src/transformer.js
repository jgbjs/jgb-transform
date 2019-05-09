import { createTransformAttr, createTransformAttrValue, createTransformEventAttr } from './transform';


export default function transformer(options) {
  const {source, target} = options
  const transformAttr = createTransformAttr(source, target)
  const transformAttrValue = createTransformAttrValue(source, target)
  const transformEventAttr = createTransformEventAttr(source, target)
  return [transformAttr, transformAttrValue, transformEventAttr]
}

