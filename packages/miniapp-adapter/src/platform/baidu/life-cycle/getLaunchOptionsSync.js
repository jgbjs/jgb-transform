import { hook } from "../../../utils/hook";

let launchOptions = {}

swan.onAppShow?.((res) => {
  launchOptions = res;
});

try {
  const oldApp = App;
  App = function (opts) {
    hook(opts, 'onLaunch', (options) => {
      launchOptions = options;
    });
    oldApp(opts)
  }
} catch (error) {

}

export function getLaunchOptionsSync() {
  return swan.getLaunchOptionsSync ? swan.getLaunchOptionsSync() : launchOptions
}
