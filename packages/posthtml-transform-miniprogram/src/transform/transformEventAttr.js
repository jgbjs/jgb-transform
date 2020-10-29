/**
 * 通用属性事件名转换
 * @param {*} source
 * @param {*} target
 */
export function createTransformEventAttr(source, target) {
  // 支付宝小程序和微信小程序差异比较多
  if (target !== "aliapp") {
    return returnSelf;
  }

  return transformAliappEventAttr;
}

const MATCH_EVENT_ATTR = /^(bind|catch){1}:?(.*)/;

/**
 * wx转换支付宝事件
 * @param {*} node
 */
export function transformAliappEventAttr(node) {
  const attrs = node.attrs;
  if (!attrs) return node;
  const commonEventMapping = {
    touchstart: "TouchStart",
    touchmove: "TouchMove",
    touchend: "TouchEnd",
    touchcancel: "TouchCancel",
    longtap: "LongTap",
    transitionend: "TransitionEnd",
    animationstart: "AnimationStart",
    animationiteration: "AnimationIteration",
    animationend: "AnimationEnd",
  };
  // capture-bind:* , capture-catch:* 支付宝不支持所以忽略
  Object.keys(attrs).forEach((key) => {
    const matches = key.match(MATCH_EVENT_ATTR);
    if (!matches) return;
    const [g, eventStartKey, eventName] = matches;
    // bind:* , bindtap => onTap
    // catch:* , catchtap => catchTap
    let evtName = commonEventMapping[eventName];
    if (!evtName) {
      evtName = eventName[0].toUpperCase() + eventName.slice(1);
    }
    // bind => on, 否则默认
    const attr = eventStartKey.replace("bind", "on") + evtName;
    const value = attrs[key];
    attrs[attr] = value === "" ? true : value;
    if (attr !== key) {
      delete attrs[key];
    }
  });
  return node;
}

function returnSelf(node) {
  return node;
}
