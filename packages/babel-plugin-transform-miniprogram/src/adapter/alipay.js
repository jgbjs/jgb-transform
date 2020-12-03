import * as path from "path";
import * as fs from "fs";
import { isTargetAdapter } from "../platform";

export function traverse(t) {
  const json = getConfigExternalClass();
  return {
    visitor: {
      /**
       * 兼容支付宝组件不支持 externalClasses
       * 收集 externalClasses的值，放置项目根目录
       * @param {*} path
       */
      Property(path) {
        if (!isTargetAdapter("my", TARGET)) return;

        // 收集 externalClasses 的值
        // e.g: Component({ externalClasses: ['xxx'] })
        const key = path.get("key");
        const value = path.get("value");
        if (
          t.isIdentifier(key) &&
          key.node.name === "externalClasses" &&
          t.isArrayExpression(value)
        ) {
          const elements = value.node.elements;
          const externalClasses = elements
            .filter((el) => t.isLiteral(el))
            .map((el) => el.value);

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
    },
  };
}

export function getConfigExternalClass() {
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

export function setConfigExternalClass(data) {
  const filePath = path.join(process.cwd(), ".externalClasses");
  fs.writeFileSync(filePath, data, { encoding: "utf-8" });
}
