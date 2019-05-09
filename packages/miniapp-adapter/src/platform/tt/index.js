import { Extend, ProxyInvokePlatformApi } from "../../utils/index";

const api = {};
const _tt = typeof tt !== "undefined" && tt;

if (_tt) {
  Extend(api, _tt);
}

console.log('invoke tt')

export default ProxyInvokePlatformApi(api)
