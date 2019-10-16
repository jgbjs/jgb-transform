import { createTransformAttr, createTransformAttrValue, createTransformEventAttr, createTransfromTag } from './transform';


export default function transformer(options) {
  const { source, target } = options
  const transformAttr = createTransformAttr(source, target)
  const transformAttrValue = createTransformAttrValue(source, target)
  const transformEventAttr = createTransformEventAttr(source, target)
  const transfromTag = createTransfromTag(source, target);
  return [transfromTag, transformAttr, transformAttrValue, transformEventAttr]
}

