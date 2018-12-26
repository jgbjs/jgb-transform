import { ProxyInvokePlatformApi, Extend } from "../../utils/index";
import AdapterComponent, { WrapComponent } from './component'
import AdapterBehavior from './behavior'
import AdapterPage, { WrapPage } from './page'
import * as NetWork from "./network";
import * as Wxml from './wxml'
console.log("invoke aliapp");
const api = {};
const _my = typeof my !== "undefined" && my;
if (_my) {
  Extend(api, _my);
}
Extend(api, NetWork);
Extend(api, Wxml)

export default ProxyInvokePlatformApi(api);

export { AdapterComponent, AdapterBehavior, AdapterPage, WrapComponent, WrapPage }
