import * as resolve from "resolve";
import * as path from "path";
import { getAdapterFile } from "../platform";

/**
 * 类似Vue的混入, 用来混入 traverse
 */
export function mixin(obj, ...args) {
  args.forEach((target) => innerMixin(obj, target));
  return obj;
}

/**
 * 类似Vue的混入, 用来混入 traverse
 */
function innerMixin(obj, target) {
  const keys = Object.keys(target);
  for (const key of keys) {
    const value = target[key];
    const oldValue = obj[key];

    // 没有就添加
    if (!oldValue) {
      obj[key] = value;
    }

    // function mixin
    if (typeof oldValue === "function") {
      obj[key] = function (...args) {
        oldValue.call(this, args);
        value.call(this, args);
      };
    }

    if (typeof oldValue === "object") {
      innerMixin(oldValue, value);
    }
  }
  return obj;
}

const cache = new Map();

const DEFAULT_LIB = "miniapp-adapter";

// 获取适配的文件路径
export function getAdapterRealPath(requireLib = DEFAULT_LIB, target) {
  const cacheKey = `${target}/${requireLib}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  const libPath = resolve.sync(requireLib, {
    basedir: process.cwd(),
  });

  const lib = getDefault(require(libPath));

  if (requireLib === DEFAULT_LIB) {
    const requireAdapter = lib;
    const adapterRealPath = requireAdapter(getAdapterFile(target));
    if (adapterRealPath) {
      const tpath = formatRequirePath(requireLib, adapterRealPath);
      cache.set(cacheKey, tpath);
      return tpath;
    }
  }

  tpath = formatRequirePath(requireLib, lib(target));

  cache.set(cacheKey, tpath);
  return tpath;
}

export function formatRequirePath(requireLib, adapterPath) {
  if (!path.isAbsolute(adapterPath)) {
    return normalizePath(adapterPath);
  }

  if (path.isAbsolute(requireLib)) {
    return normalizePath(adapterPath);
  }

  /**
   *  xxx/miniapp-adapter/index => miniapp-adapter/index
   */
  const [libName] = requireLib.split("/");
  const [, relativePath] = adapterPath.split(libName);
  return normalizePath(`${libName}${relativePath}`);
}

function getDefault(lib) {
  return lib.default || lib;
}

function normalizePath(path) {
  return `${path}`.replace(/\\/g, "/");
}
