import getMapping from './mapping'

function initOptions(options) {
  options = options || {}
  options.source = 'wx'
  options.target = 's'
  return options
}

function transform(options) {
  options = initOptions(options)
  const {source, target} = options
  const mapping = getMapping(source, target)
  return (tree, callback) => {
    const sourceAttr = mapping.attr.source
    const targetAttr = mapping.attr.target
    const transfromAttrValue = mapping.attrValue

    tree.walk((node) => {
      const attrs = node.attrs
      if (!attrs) return node;
      Object.keys(attrs).forEach(key => {
        const idx = sourceAttr.findIndex((attr) => attr === key)
        if (idx >= 0) {
          const attr = targetAttr[idx]
          const value = attrs[key]
          // some empty attr in posthtml like [s-else] will be tranform to [s-else=""]
          // so we should avoid tramform
          attrs[attr] = value === '' ? true : value
          delete attrs[key]
        }
      })
      
      return transfromAttrValue(node)
    })
    callback(null, tree);
    return tree;
  }
}

transform.match = function(expression, callback) {
  return function(tree) {
    tree.match(expression, callback);
  }
};

transform.walk = function(callback) {
  return function(tree) {
    tree.walk(callback);
  }
};

module.exports = transform;
export default transform;
