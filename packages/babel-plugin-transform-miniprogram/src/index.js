/**
 * 将 wx 转换成 swan
 * wx.xxx => swan.xxx
 * wx['xxx'] => swan['xxx']
 * var t = wx; => var t = swan; 
 * export default wx => export default swan
 * function get(ctx = wx) {} => function get(ctx = swan) {}
 */

const resolve = require('resolve');
const path = require('path')

let SOURCE = 'wx'
let TARGET = 'swan'
/* 适配库包名 */
let adapterLib = '';
const DEFAULT_LIB = 'miniapp-adapter';
const IGNORE_KEYWORD = '@jgb-ignore'
const ADAPTER_COMPOENT = 'AdapterComponent'
const ADAPTER_BEHAVIOR = 'AdapterBehavior'
const ADAPTER_PAGE = 'AdapterPage'

/** 设置是否需要导入默认需要替换的适配库  */
const ImportDefaultSpecifierKey = 'needImportDefaultSpecifier'
/** 设置导入多个需要的Specifiers  */
const ImportSpecifiersKey = 'importSpecifiers'

const mappingAdapterLib = {
  wx: 'wechat',
  swan: 'baidu',
  my: 'aliapp'
}

const aliasAdapterTarget = Object.keys(mappingAdapterLib).reduce((obj, key) => {
  const value = mappingAdapterLib[key]
  obj[key] = [key, value]
  return obj
}, {})

export default function ({types:t}) {
  return {
    pre(state) {
      const filename = state.opts.filename;
      const [plugin] = state.opts.plugins
      const [, opts={}] = plugin

      state.needTransform = true;

      if (opts.source) {
        SOURCE = opts.source
      }

      if (opts.target) {
        TARGET = opts.target
      }

      // 注释中含有忽略转换关键字
      const comments = state.ast.comments
      if (comments && comments.length && comments.filter(c => c.value.includes(IGNORE_KEYWORD)).length) {
        state.needTransform = false
      }

      if (SOURCE === TARGET) {
        state.needTransform = false
      }

      adapterLib = getAdapterRealPath(opts.lib)
    },
    post(state) {
      if (!state.needTransform) return
      if (state.ast.isImported) return
      if (!adapterLib) return
      const importDeclarations = []
      // import wx from 'xxx/xxx'
      if (state[ImportDefaultSpecifierKey]) {
        importDeclarations.push(t.importDefaultSpecifier(t.identifier(TARGET)))
      }

      // when wx2aliapp
      if (aliasAdapterTarget["my"].indexOf(TARGET) >= 0) {
        if (state[ImportSpecifiersKey]) {
          const importSpecifiers = new Set(state[ImportSpecifiersKey])
          for (const sp of importSpecifiers) {
            // import {AdapterComponent} from 'xxx/xxx'
            importDeclarations.push(t.importSpecifier(t.identifier(sp), t.identifier(sp)))
          }
        }
      }

      if (importDeclarations.length === 0) {
        return
      }

      const importAst = t.importDeclaration(importDeclarations, t.stringLiteral(adapterLib))
      state.ast.isImported = true
      state.ast.program.body.unshift(importAst)
    },
    visitor: {
      Identifier(path) {
        if (this.file._ignoreTransform) return
        const hasScope = !!path.scope.bindings[SOURCE]
        // 局部重新定义该变量则忽略替换
        if (hasScope) return
        if (path.node.name === SOURCE) {
          const state = this.file
          state[ImportDefaultSpecifierKey] = true;
          path.replaceWith(t.identifier(TARGET))
        }
      },
      CallExpression(path) {
        // when wx2aliapp replace
        if (aliasAdapterTarget["my"].indexOf(TARGET) < 0) {
          return
        }
        // Component({}) => AdapterComponent({},Component)
        if (path.get("callee").node.name === 'Component') {
          path.node.callee.name = ADAPTER_COMPOENT;
          path.node.arguments.push(t.Identifier('Component'))
          const state = this.file;
          state[ImportSpecifiersKey] = safePush(state[ImportSpecifiersKey], ADAPTER_COMPOENT);
        }

        // Page({}) => AdapterPage({},Page) 
        if (path.get("callee").node.name === 'Page') {
          path.node.callee.name = ADAPTER_PAGE;
          path.node.arguments.push(t.Identifier('Page'))
          const state = this.file;
          state[ImportSpecifiersKey] = safePush(state[ImportSpecifiersKey], ADAPTER_PAGE);
        }

        // Behavior({}) => AdapterBehavior({})
        if (path.get("callee").node.name === 'Behavior') {
          path.node.callee.name = ADAPTER_BEHAVIOR;
          const state = this.file
          state[ImportSpecifiersKey] = safePush(state[ImportSpecifiersKey], ADAPTER_BEHAVIOR);
        }
      }
    }
  }
}

function safePush(arr, item) {
  arr = arr || [];
  arr.push(item)
  return arr;
}

let cachedAdapterRealPath = ''

function getAdapterRealPath(requireLib = DEFAULT_LIB) {
  if (SOURCE === TARGET) return
  if (cachedAdapterRealPath) return cachedAdapterRealPath
  let lib;
  try {
    lib = resolve.sync(requireLib, {
      basedir: process.cwd()
    })
  } catch (error) {
    console.log(error)
    return;
  }
  lib = require(lib);
  lib = lib.default || lib;
  if (requireLib === DEFAULT_LIB) {
    const requireAdapter = lib
    const adapterRealPath = requireAdapter(mappingAdapterLib[TARGET] || TARGET)
    if (adapterRealPath) return formatRequirePath(requireLib, adapterRealPath)
    return
  }

  cachedAdapterRealPath = formatRequirePath(requireLib, lib(TARGET))

  return cachedAdapterRealPath
}

function formatRequirePath(requireLib, adapterPath) {
  if (!path.isAbsolute(adapterPath)) {
    return adapterPath.replace(/\\/g, "/");
  }

  if (path.isAbsolute(requireLib)) {
    return adapterPath.replace(/\\/g, "/")
  }

  /**
   *  xxx/miniapp-adapter/index => miniapp-adapter/index
   */
  const [libName] = requireLib.split('/')
  const [, relativePath] = adapterPath.split(libName)
  return `${libName}${relativePath}`.replace(/\\/g, "/")
}
