import { ProxyInvokePlatformApi, Extend } from "../../utils/index";
import AdapterComponent, { WrapComponent } from './component'
import AdapterBehavior from './behavior'
import AdapterPage, { WrapPage } from './page'
import * as Location from './location'

const api = {};
const _swan = typeof swan !== "undefined" && swan;

if (_swan) {
  Extend(api, _swan);
}
Extend(api, Location);

console.log('invoke baidu')

export default ProxyInvokePlatformApi(api)

export { AdapterComponent, AdapterBehavior, AdapterPage, WrapComponent, WrapPage }
