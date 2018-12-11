import { ProxyInvokePlatformApi, Extend } from "../../utils/index";

const api = {};
const _swan = typeof swan !== "undefined" && swan;

if (_swan) {
  Extend(api, _swan);
}

console.log('invoke baidu')

export default ProxyInvokePlatformApi(api)