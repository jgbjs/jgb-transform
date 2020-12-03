import { traverse as alipayTraverse } from "./alipay";
import { traverse as bytedanceTraverse } from "./bytedance";
import { shouldAdapterNativeFunction } from "../platform";
import { getAdapterRealPath, mixin } from "../helper";

let SOURCE = "wx";
let TARGET = "swan";

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

/* 适配库包名 */
let adapterLib = "";

// 设置全局环境变量
function setGlobalEnv(opts = {}) {
  if (opts.source) {
    SOURCE = opts.source;
    global.SOURCE = SOURCE;
  }

  if (opts.target) {
    TARGET = opts.target;
    global.TARGET = TARGET;
  }
}

// 是否应该忽略转换
function shouldIgnoreTransform(comments) {
  return (
    SOURCE === TARGET ||
    (comments &&
      comments.length &&
      comments.filter((c) => c.value.includes(IGNORE_KEYWORD)).length)
  );
}

export default function (t) {
  return mixin(traverse(t), alipayTraverse(t), bytedanceTraverse(t));
}

export function traverse(t) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          this.needTransform = true;
          const opts = state.opts;
          setGlobalEnv(opts);

          // 注释中含有忽略转换关键字
          const comments = path.parent.comments;
          if (shouldIgnoreTransform(comments)) {
            this.needTransform = false;
          }

          if (this.needTransform === false) {
            path.stop();
            return;
          }

          adapterLib = getAdapterRealPath(opts.lib, TARGET);
        },
        exit(path, state) {
          // 不需要转换
          if (!this.needTransform) return;
          // 已经导入适配库
          if (this.isImported) return;
          if (!adapterLib) return;
          const importDeclarations = [];
          // import wx from 'xxx/xxx'
          if (this[ImportDefaultSpecifierKey]) {
            importDeclarations.push(
              t.importDefaultSpecifier(t.identifier(SOURCE))
            );
          }

          // 适配原生方法
          if (shouldAdapterNativeFunction(TARGET)) {
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
        if (!shouldAdapterNativeFunction(TARGET)) {
          return;
        }
        const init = path.get("init");
        if (!t.isIdentifier(init)) return;
        const name = init.node.name;
        switch (name) {
          case "Page": {
            const callExpression = adapterNativeFunction(
              t,
              this,
              name,
              PAGE_WRAP,
            );
            init.replaceWith(callExpression);
            break;
          }

          case "Component": {
            const callExpression = adapterNativeFunction(
              t,
              this,
              name,
              COMPONENT_WRAP,
            );
            init.replaceWith(callExpression);
            break;
          }
          case "App": {
            const callExpression = adapterNativeFunction(
              t,
              this,
              name,
              APP_WRAP,
            );
            init.replaceWith(callExpression);
            break;
          }
        }
      },
      /**
       *  wx.oldPage = Page;
       *  =>
       *  wx.oldPage = WrapPage(Page);
       */
      AssignmentExpression(path) {
        if (!shouldAdapterNativeFunction(TARGET)) {
          return;
        }

        const right = path.get("right");
        if (!t.isIdentifier(right)) return;

        const name = right.node.name;
        switch (name) {
          case "Page": {
            const callExpression = adapterNativeFunction(
              t,
              this,
              name,
              PAGE_WRAP,
            );
            right.replaceWith(callExpression);
            break;
          }

          case "Component": {
            const callExpression = adapterNativeFunction(
              t,
              this,
              name,
              COMPONENT_WRAP,
            );
            right.replaceWith(callExpression);
            break;
          }
        }
      },
      /**
       * 判断是否需要导入适配api
       * @param {*} path
       */
      Identifier(path) {
        if (!this.needTransform) return;
        const hasScope = !!path.scope.bindings[SOURCE];
        // 局部重新定义该变量则忽略替换
        if (hasScope) return;
        if (path.node.name === SOURCE) {
          this[ImportDefaultSpecifierKey] = true;
        }
      },
      /**
       * Page({}) => AdapterPage({},Page)
       * @param {*} path
       */
      CallExpression(path) {
        const callee = path.get("callee");
        if (!callee.node) return;
        const name = callee.node.name;

        // 判断适配库是否已经导入
        if (name === "require" && !this.isImported) {
          const args = path.get("arguments");
          if (args && args.length === 1) {
            const stringLiteral = args[0];
            if (t.isStringLiteral(stringLiteral)) {
              if (stringLiteral.node.value.includes(adapterLib)) {
                this.isImported = true;
              }
            }
          }
        }

        if (!shouldAdapterNativeFunction(TARGET)) {
          return;
        }

        switch (name) {
          // Component({}) => AdapterComponent({},Component)
          case "Component":
            path.node.callee.name = ADAPTER_COMPOENT;
            path.node.arguments.push(t.Identifier(name));
            addImportSpecifiers(ADAPTER_COMPOENT, this);
            break;
          // Page({}) => AdapterPage({},Page)
          case "Page":
            path.node.callee.name = ADAPTER_PAGE;
            path.node.arguments.push(t.Identifier(name));
            addImportSpecifiers(ADAPTER_PAGE, this);
            break;
          // App({}) => AdapterApp({}, App)
          case "App":
            path.node.callee.name = ADAPTER_APP;
            path.node.arguments.push(t.Identifier(name));
            addImportSpecifiers(ADAPTER_APP, this);
            break;
          // Behavior({}) => AdapterBehavior({})
          case "Behavior":
            path.node.callee.name = ADAPTER_BEHAVIOR;
            addImportSpecifiers(ADAPTER_BEHAVIOR, this);
            break;

          default:
            break;
        }
      },
      /**
       * 是否导入
       * @param {*} path
       */
      ImportDeclaration(path) {
        const source = path.get("source");
        // already transform
        if (source.node && source.node.value.includes(adapterLib)) {
          this.isImported = true;
        }
      },
    },
  };
}

/**
 * 创建 => wrapName(name)
 * @param {*} t
 * @param {*} wrapName
 * @param {*} name
 */
function createReplaceCallExpression(t, wrapName, name) {
  return t.callExpression(t.identifier(wrapName), [t.identifier(name)]);
}

function addImportSpecifiers(wrapName, ctx) {
  ctx[ImportSpecifiersKey] = safePush(ctx[ImportSpecifiersKey], wrapName);
}

function adapterNativeFunction(t, ctx, name, wrapName) {
  addImportSpecifiers(wrapName, ctx);
  return createReplaceCallExpression(t, wrapName, name);
}

function safePush(arr, item) {
  arr = arr || [];
  arr.push(item);
  return arr;
}
