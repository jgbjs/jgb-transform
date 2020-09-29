import _ from "lodash";
import fs from "fs";
import path from "path";

function cloneNode(node) {
  return _.cloneDeep(node);
}

const ENTER_STR = "\n ";

// 匹配2个以上大括号 like {{ data }} {{{ data }}}
const MATCH_BRACE = /(?:{){2,}([^}]+)(?:}){2,}/;

const strToClassReg = _.memoize((str) => {
  return new RegExp(`(^|\\s)(${str})`);
});

/**
 * 转换attrs的 key 和 value
 */
export function createTransformAttrValue(source, target, assetName) {
  if (source === target) {
    return returnSelf;
  }

  const selector = {
    swan: transformSwan,
    aliapp: transfromAliapp,
    my: transfromAliapp,
    tt: transformTT,
  };

  return selector[target];
}

function returnSelf(node) {
  return node;
}

/**
 * aliapp 转换器
 * @param {*} node
 */
function transfromAliapp(node, addAsyncTasks, done) {
  const attrs = node.attrs || {};
  if (node.tag === "icon") {
    const iconTypeNoSupport = ["circle", "info_circle"];
    if (iconTypeNoSupport.includes(attrs.type)) {
      console.warn(
        `支付宝小程序 <icon> 不支持 type: ${attrs.type}, 会导致页面不渲染。`
      );
    }
  }
  if (node.tag === "scroll-view") {
    const nameMapping = {
      bindscrolltoupper: "onScrollToUpper",
      bindscrolltolower: "onScrollToLower",
    };
    replaceAttrNames(nameMapping);
  }

  if (node.tag === "picker-view") {
    const nameMapping = {
      "indicator-style": "indicatorStyle",
    };
    replaceAttrNames(nameMapping);
  }

  if (node.tag === "slider") {
    const nameMapping = {
      "block-size": "handleSize",
      "block-color": "handleColor",
    };
    replaceAttrNames(nameMapping);
  }

  if (node.tag === "image") {
    const nameMapping = {
      "lazy-load": "lazyLoad",
    };
    replaceAttrNames(nameMapping);
  }

  if (node.tag === "canvas") {
    const nameMapping = {
      "canvas-id": "id",
    };
    replaceAttrNames(nameMapping);
  }

  if (node.tag === "map") {
    const nameMapping = {
      bindmarkertap: "onMarkerTap",
      bindcallouttap: "onCalloutTap",
      bindcontroltap: "onControlTap",
      bindregionchange: "onRegionChange",
    };
    replaceAttrNames(nameMapping);
  }

  fixExternalClass(attrs, addAsyncTasks, done);

  return node;

  function replaceAttrNames(nameMapping) {
    Object.keys(nameMapping).forEach((name) => {
      const value = attrs[name];
      if (value) {
        attrs[nameMapping[name]] = value;
        delete attrs[name];
      }
    });
  }
}

/**
 *  * 修复支付宝Component缺失 externalClasses功能
 *  * 替换`externalClass`中的class为修复后的fixData字段
 *  class="target-class"  => class="{{fixtargetClass}}"
 */
function fixExternalClass(attrs, addAsyncTasks, done) {
  // 如果属性有class
  if (attrs.class) {
    // addAsyncTasks();
    // TODO: 等待关联Component.js有externalClass设置或者通知，因为不确定编译的先后顺序
    // 由于上面这个方案实现难度较大，改为读取文件的形式
    const json = getConfigExternalClass();
    const externalClasses = json.externalClasses || [];
    externalClasses.forEach((cl) => {
      if (attrs.class.includes(cl)) {
        attrs.class = attrs.class.replace(
          strToClassReg(cl),
          (g, s1) => s1 + `{{fix${normalizeProp(cl)}}}`
        );
      }
    });
    // done();
  }
}

/**
 * 解析html字段变驼峰形式
 * xx-yy  => xxYy
 */
function normalizeProp(propKey) {
  return propKey.replace(/-\w/g, ($1) => $1.slice(1).toUpperCase());
}

function getConfigExternalClass() {
  const filePath = path.join(process.cwd(), ".externalClasses");
  if (fs.existsSync(filePath)) {
    const str = fs.readFileSync(filePath, { encoding: "utf-8" });
    const json = JSON.parse(str);
    return json;
  }
  return {};
}

/**
 * tt 头条转换器
 * https://developer.toutiao.com/docs/comp/button.html
 */
function transformTT(node) {
  const attrs = node.attrs || {};
  if (node.tag === "button") {
    const nameMapping = {
      // 'hover-start-time': 'hoverStartTime',
      // 'hover-stay-time': 'hoverStayTime',
    };
    replaceAttrNames(nameMapping);
  }
  return node;
  function replaceAttrNames(nameMapping) {
    Object.keys(nameMapping).forEach((name) => {
      const value = attrs[name];
      if (value) {
        attrs[nameMapping[name]] = value;
        delete attrs[name];
      }
    });
  }
}

/**
 * swan 转换器
 * @param {*} node
 */
function transformSwan(node) {
  // template: data={{}} => data={{{}}}
  const attrs = node.attrs || {};
  if (node.tag === "template") {
    const data = attrs.data;
    if (!data) return node;
    attrs.data = data.replace(MATCH_BRACE, (g, $1) => {
      return `{{{${$1}}}}`;
    });
  }
  if (node.tag === "scroll-view") {
    // {{ scroll }} => {= scroll =}
    ["scroll-top", "scroll-left" /* 'scroll-into-view' */].forEach((attr) => {
      const contains = !!attrs[attr];
      if (!contains) return;
      attrs[attr] = attrs[attr].replace(MATCH_BRACE, (g, $1) => {
        return `{= ${$1} =}`;
      });
    });
  }

  if (node.tag === "image") {
    if (typeof attrs.webp !== "undefined") {
      delete attrs.webp;
    }
  }

  // https://smartapp.baidu.com/docs/develop/framework/view_for/
  // s-for与s-if不可在同一标签下同时使用。
  const keys = Object.keys(attrs);
  if (keys.includes("s-for") && keys.includes("s-if")) {
    console.warn(
      `s-for与s-if不可在同一标签下同时使用。正在转换添加block作为s-for作为循环标签`
    );
    const popAttrKey = ["s-for", "s-for-index", "s-for-item", "s-key"];
    const popAttrs = _.pick(attrs, popAttrKey);
    node.attrs = _.omit(attrs, popAttrKey);
    node.content = [ENTER_STR, cloneNode(node), ENTER_STR];
    node.tag = "block";
    node.attrs = popAttrs;
  }

  return node;
}
