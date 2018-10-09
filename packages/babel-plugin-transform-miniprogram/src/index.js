/**
 * 将 wx 转换成 swan
 * wx.xxx => swan.xxx
 * wx['xxx'] => swan['xxx']
 * var t = wx; => var t = swan; 
 * export default wx => export default swan
 */

let SOURCE = 'wx'
let TARGET = 'swan'

export default function ({types:t}) {
  return {
    pre(state) {
      const [plugin] = state.opts.plugins
      const [, opts={}] = plugin
      if (opts.SOURCE) {
        SOURCE = opts.SOURCE
      }

      if (opts.TARGET) {
        TARGET = opts.TARGET
      }
    },
    visitor: {
      MemberExpression(path) {
        if(!path.node.object) return
        if (path.node.object.name === SOURCE) {
          path.traverse(updateVisitor)
        }
      },
      VariableDeclarator(path) {
        if (!path.node.init) return
        if (path.node.init.name === SOURCE) {
          path.traverse(updateVisitor)
        }
      },
      ExportDefaultDeclaration(path) {
        if(!path.node.declaration) return
        if (path.node.declaration.name === SOURCE) {
          path.traverse(updateVisitor)
        }
      },
      AssignmentExpression(path) {
        if (path.node.right.name === SOURCE) {
          path.traverse(updateVisitor)
        }
      }
    }
  }
}

const updateVisitor = {
  Identifier(path) {
    if (path.node.name === SOURCE) {
      path.node.name = TARGET;
    }
  }
}
