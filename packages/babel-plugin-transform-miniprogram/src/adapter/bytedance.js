import { isTargetAdapter } from "../platform";

export function traverse(t) {
  return {
    visitor: {
      /**
       * 字节跳动
       * const c = this.selectComponent('selector');
       * =>
       * const c = await this.selectComponentAsync('selector');
       * */
      MemberExpression(path) {
        if (isTargetAdapter("tt", TARGET)) {
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
