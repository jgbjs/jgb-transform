export const SUPPORT_PLATFORMS = ["wechat", "aliapp", "baidu", "h5", "tt"];

const configRequireConfig = SUPPORT_PLATFORMS.map(name => {
  return {
    [`${name}`]: require.resolve(`./platform/${name.toLowerCase()}`)
  };
}).reduce((obj, nobj) => Object.assign(obj, nobj), {});

export const extendSupportPlatform = (name, requirePath) => {
  SUPPORT_PLATFORMS.push(name);
  configRequireConfig[name] = requirePath;
};

export default function requireAdapter(adpaterName) {
  const name = adpaterName || "wechat";
  const adapterPath = require.resolve(`${configRequireConfig[name]}`);
  if (!adapterPath)
    throw new Error(
      `can not load adapter [${name}]. filePath:${configRequireConfig[name]}`
    );
  return adapterPath;
}
