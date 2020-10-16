import { saveData } from "./innerData";

export default function AdapterApp(opts, ...otherOpts) {
  const { onLaunch, onShow } = opts;

  opts.onLaunch = function (...args) {
    saveData("LaunchOptions", args[0]);
    onLaunch && onLaunch.apply(this, args);
  };

  opts.onShow = function (...args) {
    saveData("EnterOptions", args[0]);
    onShow && onShow.apply(this, args);
  };

  // 取最后一个参数作为App
  const InjectApp = otherOpts.length
    ? otherOpts[otherOpts.length - 1] || App
    : App;

  InjectApp(opts);
}

export function WrapApp(InjectApp = App) {
  return (opts) => {
    AdapterApp(opts, InjectApp);
  };
}
