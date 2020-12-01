/**
 * 将 wx 转换成 swan
 * wx.xxx => swan.xxx
 * wx['xxx'] => swan['xxx']
 * var t = wx; => var t = swan;
 * export default wx => export default swan
 * function get(ctx = wx) {} => function get(ctx = swan) {}
 */

const resolve = require("resolve");
const path = require("path");
const fs = require("fs");

let SOURCE = "wx";
let TARGET = "swan";
/* 适配库包名 */
let adapterLib = "";
const DEFAULT_LIB = "miniapp-adapter";
const IGNORE_KEYWORD = "@jgb-ignore";
const ADAPTER_COMPOENT = "AdapterComponent";
const COMPONENT_WRAP = "WrapComponent";
const ADAPTER_BEHAVIOR = "AdapterBehavior";
const ADAPTER_PAGE = "AdapterPage";
const PAGE_WRAP = "WrapPage";
const ADAPTER_APP = "AdapterApp";
const APP_WRAP = "WrapApp";

/** 设置是否需要导入默认需要替换的适配库  */
const ImportDefaultSpecifierKey = "needImportDefaultSpecifier";
/** 设置导入多个需要的Specifiers  */
const ImportSpecifiersKey = "importSpecifiers";

const mappingAdapterLib = {
  wx: "wechat",
  swan: "baidu",
  my: "aliapp",
  tt: "tt",
};

const aliasAdapterTarget = Object.keys(mappingAdapterLib).reduce((obj, key) => {
  const value = mappingAdapterLib[key];
  obj[key] = [key, value];
  return obj;
}, {});

const cacheResult = new Map();
/** 判断是否需要重写原生组件 */
const shouldAdapterPlatform = (target) => {
  if (cacheResult.has(target)) {
    return cacheResult.get(target);
  }

  const result =
    aliasAdapterTarget["my"].indexOf(target) >= 0 ||
    aliasAdapterTarget["swan"].indexOf(target) >= 0 ||
    aliasAdapterTarget["tt"].indexOf(target) >= 0;

  cacheResult.set(target, result);
  return result;
};

export default function ({ types: t }) {
  const json = getConfigExternalClass();
  return {
    visitor: {
      Program: {
        enter(path, state) {
          this.needTransform = true;
          const opts = state.opts;
          if (opts.source) {
            SOURCE = opts.source;
          }

          if (opts.target) {
            TARGET = opts.target;
          }

          // 注释中含有忽略转换关键字
          const comments = path.parent.comments;
          if (
            comments &&
            comments.length &&
            comments.filter((c) => c.value.includes(IGNORE_KEYWORD)).length
          ) {
            this.needTransform = false;
          }

          if (SOURCE === TARGET) {
            this.needTransform = false;
          }

          if (this.needTransform === false) {
            path.stop();
            return;
          }

          adapterLib = getAdapterRealPath(opts.lib);
        },
        exit(path, state) {
          if (!this.needTransform) return;
          if (this.isImported) return;
          if (!adapterLib) return;
          const importDeclarations = [];
          // import wx from 'xxx/xxx'
          if (this[ImportDefaultSpecifierKey]) {
            importDeclarations.push(
              t.importDefaultSpecifier(t.identifier(SOURCE))
            );
          }

          // when wx2aliapp
          if (shouldAdapterPlatform(TARGET)) {
            if (this[ImportSpecifiersKey]) {
              const importSpecifiers = new Set(this[ImportSpecifiersKey]);
              for (const sp of importSpecifiers) {
                // import {AdapterComponent} from 'xxx/xxx'
                importDeclarations.push(
                  t.importSpecifier(t.identifier(sp), t.identifier(sp))
                );
              }
            }
          }

          if (importDeclarations.length === 0) {
            return;
          }

          const importAst = t.importDeclaration(
            importDeclarations,
            t.stringLiteral(adapterLib)
          );
          this.isImported = true;
          path.node.body.unshift(importAst);
        },
      },
      /**
       *  const oldPage = Page;
       *  =>
       *  const oldPage = WrapPage(Page);
       */
      VariableDeclarator(path) {
        // when wx2aliapp replace
        if (!shouldAdapterPlatform(TARGET)) {
          return;
        }
        const init = path.get("init");
        if (!t.isIdentifier(init)) return;
        const name = init.node.name;
        switch (name) {
          case "Page":
            init.replaceWith(
              t.callExpression(t.identifier(PAGE_WRAP), [t.identifier(name)])
            );
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              PAGE_WRAP
            );
            break;

          case "Component":
            init.replaceWith(
              t.callExpression(t.identifier(COMPONENT_WRAP), [
                t.identifier(name),
              ])
            );
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              COMPONENT_WRAP
            );
            break;
          case "App":
            init.replaceWith(
              t.callExpression(t.identifier(APP_WRAP), [t.identifier(name)])
            );
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              APP_WRAP
            );
            break;
        }
      },
      /**
       *  wx.oldPage = Page;
       *  =>
       *  wx.oldPage = WrapPage(Page);
       */

      AssignmentExpression(path) {
        // when wx2aliapp replace
        if (!shouldAdapterPlatform(TARGET)) {
          return;
        }

        const right = path.get("right");
        if (!t.isIdentifier(right)) return;

        const name = right.node.name;
        switch (name) {
          case "Page":
            right.replaceWith(
              t.callExpression(t.identifier(PAGE_WRAP), [t.identifier(name)])
            );
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              PAGE_WRAP
            );
            break;

          case "Component":
            right.replaceWith(
              t.callExpression(t.identifier(COMPONENT_WRAP), [
                t.identifier(name),
              ])
            );
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              COMPONENT_WRAP
            );
            break;
        }
      },
      Property(path) {
        if (TARGET !== "my") return;

        // 收集 externalClasses 的值
        const key = path.get("key");
        const value = path.get("value");
        if (
          t.isIdentifier(key) &&
          key.node.name === "externalClasses" &&
          t.isArrayExpression(value)
        ) {
          const elements = value.node.elements;
          const externalClasses = [];
          elements.forEach((el) => {
            if (t.isLiteral(el)) {
              externalClasses.push(el.value);
            }
          });

          if (externalClasses.length) {
            const len = json.externalClasses.length;
            const set = new Set(
              [].concat(
                json.externalClasses,
                externalClasses,
                getConfigExternalClass().externalClasses
              )
            );
            if (set.size > len) {
              json.externalClasses = [...set].filter(Boolean);
              setConfigExternalClass(JSON.stringify(json, null, "\t"));
            }
          }
        }
      },
      Identifier(path) {
        if (!this.needTransform) return;
        const hasScope = !!path.scope.bindings[SOURCE];
        // 局部重新定义该变量则忽略替换
        if (hasScope) return;
        if (path.node.name === SOURCE) {
          this[ImportDefaultSpecifierKey] = true;
          // path.replaceWith(t.identifier(TARGET))
        }
      },
      CallExpression(path) {
        const callee = path.get("callee");
        if (!callee.node) return;
        const name = callee.node.name;

        switch (name) {
          case "require":
            const args = path.get("arguments");
            if (args && args.length === 1) {
              const stringLiteral = args[0];
              if (t.isStringLiteral(stringLiteral)) {
                if (stringLiteral.node.value.includes(adapterLib)) {
                  this.isImported = true;
                }
              }
            }
            break;

          default:
            break;
        }

        // when wx2aliapp replace
        if (!shouldAdapterPlatform(TARGET)) {
          return;
        }

        switch (name) {
          // Component({}) => AdapterComponent({},Component)
          case "Component":
            path.node.callee.name = ADAPTER_COMPOENT;
            path.node.arguments.push(t.Identifier(name));
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              ADAPTER_COMPOENT
            );
            break;
          // Page({}) => AdapterPage({},Page)
          case "Page":
            path.node.callee.name = ADAPTER_PAGE;
            path.node.arguments.push(t.Identifier(name));
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              ADAPTER_PAGE
            );
            break;
          // App({}) => AdapterApp({}, App)
          case "App":
            path.node.callee.name = ADAPTER_APP;
            path.node.arguments.push(t.Identifier(name));
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              ADAPTER_APP
            );
            break;
          // Behavior({}) => AdapterBehavior({})
          case "Behavior":
            path.node.callee.name = ADAPTER_BEHAVIOR;
            this[ImportSpecifiersKey] = safePush(
              this[ImportSpecifiersKey],
              ADAPTER_BEHAVIOR
            );
            break;

          default:
            break;
        }
      },
      ImportDeclaration(path) {
        const source = path.get("source");
        // already transform
        if (source.node && source.node.value.includes(adapterLib)) {
          this.isImported = true;
        }
      },
      /**
       * 字节跳动
       * const c = this.selectComponent('selector');
       * =>
       * const c = await this.selectComponentAsync('selector');
       * */
      MemberExpression(path) {
        if (aliasAdapterTarget["tt"].indexOf(TARGET) >= 0) {
          addAysncFuncForTTComponent(path, t);
        }
      },
    },
  };
}

const ttAyncFuncKey = [
  "selectComponent",
  "selectAllComponents",
  "getRelationNodes",
];

// 字节为某些方法增加async语法，可能会影响之前代码的流程
function addAysncFuncForTTComponent(path, t) {
  const property = path.get("property");
  if (property.node && ttAyncFuncKey.includes(property.node.name)) {
    // this.selectComponent => this.selectComponentAync
    property.replaceWith(t.Identifier(`${property.node.name}Async`));

    // 找到最近的Function改为async
    const functionExpression = path.getFunctionParent();
    let shouldAsyncFunction = false;

    // 将原本调用方法改为 await
    const callExpression = path.findParent((p) => p.isCallExpression());
    if (callExpression && !t.isAwaitExpression(callExpression.parent)) {
      const expressionNodePath = callExpression.parentPath.parentPath;
      // 当使用 this.c = this.selectComponent 时
      // 转化成如下，为了兼容在同步代码
      //  this.c = this.selectComponentAsync;
      //  this.c = await this.selectComponentAsync;
      if (t.isExpressionStatement(expressionNodePath)) {
        const expressionNode = callExpression.parentPath.parent;
        const expressionStatement = t.cloneDeep(expressionNode);
        expressionNodePath.replaceWithMultiple([
          expressionStatement,
          expressionNode,
        ]);
      }

      // return 不加await
      if (!t.isReturnStatement(callExpression.parentPath)) {
        shouldAsyncFunction = true;
        const cloneNode = t.clone(callExpression.node);
        callExpression.replaceWith(t.AwaitExpression(cloneNode));
      }
    }

    if (
      shouldAsyncFunction &&
      functionExpression &&
      functionExpression.node.async === false
    ) {
      functionExpression.node.async = true;
    }
  }
}

function getConfigExternalClass() {
  const filePath = path.join(process.cwd(), ".externalClasses");
  if (fs.existsSync(filePath)) {
    const str = fs.readFileSync(filePath, { encoding: "utf-8" });
    const json = JSON.parse(str);
    return json;
  }
  return {
    externalClasses: [],
  };
}

function setConfigExternalClass(data) {
  const filePath = path.join(process.cwd(), ".externalClasses");
  fs.writeFileSync(filePath, data, { encoding: "utf-8" });
}

function safePush(arr, item) {
  arr = arr || [];
  arr.push(item);
  return arr;
}

let cachedAdapterRealPath = "";

function getAdapterRealPath(requireLib = DEFAULT_LIB) {
  if (SOURCE === TARGET) return;
  if (cachedAdapterRealPath) return cachedAdapterRealPath;
  let lib;
  try {
    lib = resolve.sync(requireLib, {
      basedir: process.cwd(),
    });
  } catch (error) {
    console.log(error);
    return;
  }
  lib = require(lib);
  lib = lib.default || lib;
  if (requireLib === DEFAULT_LIB) {
    const requireAdapter = lib;
    const adapterRealPath = requireAdapter(mappingAdapterLib[TARGET] || TARGET);
    if (adapterRealPath) return formatRequirePath(requireLib, adapterRealPath);
    return;
  }

  cachedAdapterRealPath = formatRequirePath(requireLib, lib(TARGET));

  return cachedAdapterRealPath;
}

function formatRequirePath(requireLib, adapterPath) {
  if (!path.isAbsolute(adapterPath)) {
    return adapterPath.replace(/\\/g, "/");
  }

  if (path.isAbsolute(requireLib)) {
    return adapterPath.replace(/\\/g, "/");
  }

  /**
   *  xxx/miniapp-adapter/index => miniapp-adapter/index
   */
  const [libName] = requireLib.split("/");
  const [, relativePath] = adapterPath.split(libName);
  return `${libName}${relativePath}`.replace(/\\/g, "/");
}
