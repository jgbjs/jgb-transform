import {
  emulateExcuteRelations,
  collectRelations,
  getRelationNodes,
} from "../../emulation/relations";
import {
  addComponentToPage,
  removeComponentToPage,
} from "../../emulation/pageComponents";

/**
 * 适配微信小程序Component参数的组件方法
 * @param {*} opts
 */
export default function AdapterBaiduComponent(
  opts,
  InjectComponent = Component
) {
  opts = AdapterComponent(opts);

  InjectComponent(opts);
}

export function WrapComponent(InjectComponent = Component) {
  return (opts) => {
    AdapterBaiduComponent(opts, InjectComponent);
  };
}

export function AdapterComponent(opts) {
  const { created, attached, detached, relations = {} } = opts;

  opts.created = function () {
    addComponentToPage(this);
    collectRelations(this, relations);
    created && created.call(this);
  };

  opts.attached = function () {
    emulateExcuteRelations(this, "attached");
    attached && attached.call(this);
  };

  opts.detached = function () {
    emulateExcuteRelations(this, "detached");
    removeComponentToPage(this);

    detached && detached.call(this);
  };

  const methods = opts.methods || {};
  methods.getRelationNodes = function (path) {
    return getRelationNodes(path, this);
  };
  opts.methods = methods;

  return opts;
}
