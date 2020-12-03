// 各平台的target以及其别名
export const mapping = extendMapping({
  wx: "wechat",
  swan: "baidu",
  my: ["aliapp", "alipay"],
  tt: "tt",
});

// 从mapping中获取合适的文件目录，用于读取adapter目录
export function getAdapterFile(target) {
  const arr = mapping[target];
  if (Array.isArray(arr)) {
    return arr[0];
  }
  return target;
}

function extendMapping(mapping) {
  return Object.keys(mapping).reduce((obj, key) => {
    const value = mapping[key];
    obj[key] = [].concat(value, key);
    return obj;
  }, {});
}

const cacheResult = new Map();

// 是否适配原生方法
export function shouldAdapterNativeFunction(target) {
  if (cacheResult.has(target)) {
    return cacheResult.get(target);
  }

  const result = isTargetAdapter(["my", "swan", "tt"], target);

  cacheResult.set(target, result);
  return result;
}

// 判断对应平台是否存在target
export function isTargetAdapter(platform, target) {
  return getMappingFlatArr(platform).includes(target);
}

// 将对应的mapping的value中的数组扁平化
export function getMappingFlatArr(keys) {
  if (Array.isArray(keys)) {
    return [].concat.apply(
      [],
      keys.map((key) => mapping[key])
    );
  }

  return [].concat(mapping[keys]);
}
