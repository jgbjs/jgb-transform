import { ProxyInvokePlatformApi, Extend } from "../../utils/index";
import AdapterComponent, { WrapComponent } from './component'
import AdapterBehavior from './behavior'
import AdapterPage, { WrapPage } from './page'

const api = {};
const _swan = typeof swan !== "undefined" && swan;

if (_swan) {
  Extend(api, _swan);
}

console.log('invoke baidu')

export default ProxyInvokePlatformApi(api)

export { AdapterComponent, AdapterBehavior, AdapterPage, WrapComponent, WrapPage }
