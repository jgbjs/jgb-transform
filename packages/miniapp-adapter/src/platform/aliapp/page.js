// @jgb-ignore

import { selectAllComponents, selectComponent } from "./base";
import { defineProperty } from "../../utils/index";
import { createSelectorQuery } from "./wxml/createSelectorQuery";
import { createIntersectionObserver } from "./wxml/createIntersectionObserver";

export default function AdapterAliappPage(opts, ...otherOpts) {
  const oldLoad = opts.onLoad || (() => {});

  opts.onLoad = function (...args) {
    extendInstance(this);
    oldLoad.apply(this, args);
  };

  // 取最后一个参数作为Page
  const InjectPage = otherOpts.length
    ? otherOpts[otherOpts.length - 1] || Page
    : Page;

  InjectPage(opts);
}

export function WrapPage(InjectPage = Page) {
  return (opts) => {
    AdapterAliappPage(opts, InjectPage);
  };
}

/**
 * 扩展实例属性
 * @param {*} ctx
 */
function extendInstance(ctx) {
  defineProperty(ctx, "selectAllComponents", selectAllComponents);
  defineProperty(ctx, "selectComponent", selectComponent);
  defineProperty(ctx, "createSelectorQuery", () => createSelectorQuery());

  defineProperty(ctx, "createIntersectionObserver", (options) =>
    createIntersectionObserver(ctx, options)
  );
}
