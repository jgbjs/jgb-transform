import {
  addComponentToPage,
  removeComponentToPage,
} from "../../emulation/pageComponents";

/**
 * 适配微信小程序Component参数的组件方法
 * @param {*} opts
 */
export default function AdapterTTComponent(opts, InjectComponent = Component) {
  opts = AdapterComponent(opts);

  InjectComponent(opts);
}

export function WrapComponent(InjectComponent = Component) {
  return (opts) => {
    AdapterTTComponent(opts, InjectComponent);
  };
}

export function AdapterComponent(opts) {
  const { created, attached, detached, relations = {} } = opts;

  opts.created = function () {
    addComponentToPage(this);
    created && created.call(this);
  };

  opts.attached = function () {
    attached && attached.call(this);
  };

  opts.detached = function () {
    removeComponentToPage(this);

    detached && detached.call(this);
  };

  const methods = opts.methods || {};
  opts.methods = methods;

  for (const key of Object.keys(relations)) {
    const value = relations[key];
    for (const fnStr of Object.keys(value)) {
      const fn = value[fnStr];
      if (typeof fn == "function") {
        value[fnStr] = function (target) {
          fn.call(this, target.instance);
        };
      }
    }
  }
  opts.relations = {};

  return opts;
}
