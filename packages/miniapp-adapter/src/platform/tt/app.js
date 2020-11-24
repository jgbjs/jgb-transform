/**
 * 适配微信小程序Component参数的组件方法
 * @param {*} opts
 */
export default function AdapterApp(opts, InjectApp = App) {
  InjectApp(opts)
}

export function WrapApp(InjectApp = App) {
  return (opts) => {
    AdapterApp(opts, InjectApp);
  };
}
