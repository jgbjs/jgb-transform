import {
  createTransformAttr,
  createTransformAttrValue,
  createTransformEventAttr,
  createTransfromTag,
} from "./transform";

export default function transformer(options) {
  const { source, target, name } = options;
  const transformAttr = createTransformAttr(source, target, name);
  const transformAttrValue = createTransformAttrValue(source, target, name);
  const transformEventAttr = createTransformEventAttr(source, target, name);
  const transfromTag = createTransfromTag(source, target, name);
  return [transfromTag, transformAttr, transformAttrValue, transformEventAttr];
}
