import { PAGE_COMPONENTS } from "./pageComponents";
import { pathResolve } from "../utils/pathResolve";

/** 存放componet的relations的key */
export const COMPONENT_RELTATIONS = "$component_relations$";

const PARENT_TYPES = ["parent", "ancestor"];
const CHILD_TYPES = ["child", "descendant"];

/**
 * 模拟执行relations的流程
 * @ctx 当前组件的context
 * @lifetime 组件生命周期
 */
export function emulateExcuteRelations(ctx, lifetime) {
  const $page = ctx.$page;
  const components = $page[PAGE_COMPONENTS];
  if (!components) return;
  const currentPath = ctx.is;
  const currentRelations = ctx[COMPONENT_RELTATIONS] || {};
  const parentsPath = [];
  const childsPath = [];
  Object.keys(currentRelations).forEach((path) => {
    const relation = currentRelations[path];
    if (PARENT_TYPES.indexOf(relation.type) >= 0) {
      parentsPath.push(path);
    }
    if (CHILD_TYPES.indexOf(relation.type) >= 0) {
      childsPath.push(path);
    }
  });

  for (const component of components) {
    if (component === ctx) continue;
    const is = component.is;
    const relations = component[COMPONENT_RELTATIONS] || {};
    let target;

    // 作为子组件时 搜寻type: parent的组件
    if (parentsPath.indexOf(is) >= 0) {
      // 找到对应的子组件的relations
      if ((target = relations[currentPath])) {
        const { linked, unlinked, type } = target;
        if (CHILD_TYPES.indexOf(type) >= 0) {
          switch (lifetime) {
            case "attached":
              linked && linked.call(component, ctx);
              break;
            case "detached":
              unlinked && unlinked.call(component, ctx);
              break;
          }
        }
      }

      // 找到当前组件对应的 type:parent
      if ((target = currentRelations[is])) {
        const { linked, unlinked, type } = target;
        if (PARENT_TYPES.indexOf(type) >= 0) {
          switch (lifetime) {
            case "attached":
              linked && linked.call(ctx, component);
              break;
            case "detached":
              unlinked && unlinked.call(ctx, component);
              break;
          }
        }
      }
    }

    // // 作为父组件时 搜寻type: child的组件
    // if (childsPath.indexOf(is) >= 0) {
    //   // 找到当前组件对应的 type:child
    //   if (target = currentRelations[is]) {
    //     const { linked, unlinked, type } = target;
    //     if (CHILD_TYPES.indexOf(type) >= 0) {
    //       console.log(3)
    //       switch (lifetime) {
    //         case 'attached':
    //           linked && linked.call(ctx, component)
    //           break;
    //         case 'detached':
    //           unlinked && unlinked.call(ctx, component)
    //           break;
    //       }
    //     }
    //   }

    //   // 找到对应的父组件
    //   if (target = relations[currentPath]) {
    //     const { linked, unlinked, type } = target;
    //     if (PARENT_TYPES.indexOf(type) >= 0) {
    //       console.log(4)
    //       switch (lifetime) {
    //         case 'attached':
    //           linked && linked.call(component, ctx)
    //           break;
    //         case 'detached':
    //           unlinked && unlinked.call(component, ctx)
    //           break;
    //       }
    //     }
    //   }
    // }
  }
}

/** 收集relations */
export function collectRelations(ctx, relations = {}) {
  const currentPath = ctx.is;
  const r = {};

  Object.keys(relations).forEach((path) => {
    const relation = relations[path];
    const realPath = pathResolve(currentPath, path);
    r[realPath] = relation;
  });

  ctx[COMPONENT_RELTATIONS] = r;
}

/**
 * 获取相关联组件
 * 适配没有relation、getRelationNodes
 */
export function getRelationNodes(path, ctx) {
  const currentPath = ctx.is;
  const $page = ctx.$page;
  const realPath = pathResolve(currentPath, path);
  const components = $page[PAGE_COMPONENTS];
  if (!components) return [];
  return [...components].filter((c) => c.is === realPath);
}
