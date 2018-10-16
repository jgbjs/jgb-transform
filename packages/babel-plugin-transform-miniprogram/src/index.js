/**
 * 将 wx 转换成 swan
 * wx.xxx => swan.xxx
 * wx['xxx'] => swan['xxx']
 * var t = wx; => var t = swan; 
 * export default wx => export default swan
 */

const resolve = require('resolve');
const path = require('path')

let SOURCE = 'wx'
let TARGET = 'swan'
/* 适配库包名 */
let adapterLib = '';
const DEFAULT_LIB = 'miniapp-adapter';

const updateVisitor = {
  Identifier(path) {
    if (path.node.name === SOURCE) {
      const state = this.ctx.file
      state._isUsedTransform = true;
      path.node.name = TARGET;
    }
  }
}

const mappingAdapterLib = {
  wx: 'wechat',
  swan: 'baidu',
  my: 'aliapp'
}

export default function ({types:t}) {
  return {
    pre(state) {
      const [plugin] = state.opts.plugins
      const [, opts={}] = plugin
      if (opts.source) {
        SOURCE = opts.source
      }

      if (opts.target) {
        TARGET = opts.target
      }

      adapterLib = getAdapterRealPath(opts.lib || DEFAULT_LIB)
    },
    post(state) {
      if (SOURCE === TARGET) return
      if (state.ast.isImported) return
      if (!state._isUsedTransform) return
      if (!adapterLib) return
      const importAst = t.importDeclaration([t.importDefaultSpecifier(t.identifier(TARGET))], t.stringLiteral(adapterLib))
      state.ast.isImported = true
      state.ast.program.body.unshift(importAst)
    },
    visitor: {
      MemberExpression(path) {
        if (!path.node.object) return
        if (path.node.object.name === SOURCE) {
          path.traverse(updateVisitor, {
            ctx: this
          })
        }
      },
      VariableDeclarator(path) {
        if (!path.node.init) return
        if (path.node.init.name === SOURCE) {
          path.traverse(updateVisitor, {
            ctx: this
          })
        }
      },
      ExportDefaultDeclaration(path) {
        if (!path.node.declaration) return
        if (path.node.declaration.name === SOURCE) {
          path.traverse(updateVisitor, {
            ctx: this
          })
        }
      },
      AssignmentExpression(path) {
        if (path.node.right.name === SOURCE) {
          path.traverse(updateVisitor, {
            ctx: this
          })
        }
      }
    }
  }
}

function getAdapterRealPath(requireLib) {
  if (SOURCE === TARGET) return
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
  return formatRequirePath(requireLib, lib(TARGET))
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
