import { Extend, ProxyInvokePlatformApi } from "../../utils/index";
import AdapterPage, { WrapPage } from "./page";
import AdapterComponent, { WrapComponent } from "./component";
import AdapterApp, { WrapApp } from "./app";
import AdapterBehavior from "./behavior";
import * as nextTick from './nextTick'

const api = {};
const _tt = typeof tt !== "undefined" && tt;

if (_tt) {
  Extend(api, _tt);
}

Extend(api, nextTick);

console.log("invoke tt");

export default ProxyInvokePlatformApi(api);

export {
  AdapterComponent,
  AdapterPage,
  AdapterBehavior,
  WrapComponent,
  WrapPage,
  AdapterApp,
  WrapApp,
};
