import { ProxyInvokePlatformApi, Extend } from "../../utils/index";
import AdapterComponent, { WrapComponent } from './component'
import AdapterBehavior from './behavior'
import AdapterPage, { WrapPage } from './page'
import * as Location from './location'
import * as Device from './device'
import * as Wxml from './wxml'
import * as LifeCycle from './life-cycle'

const api = {};
const _swan = typeof swan !== "undefined" && swan;

if (_swan) {
  Extend(api, _swan);
}
Extend(api, Location);
Extend(api, Device);
Extend(api, LifeCycle);
Extend(api, Wxml);
console.log('invoke baidu')

export default ProxyInvokePlatformApi(api)

export { AdapterComponent, AdapterBehavior, AdapterPage, WrapComponent, WrapPage }
