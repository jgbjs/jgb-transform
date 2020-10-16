import { ProxyInvokePlatformApi, Extend } from "../../utils/index";
import AdapterComponent, { WrapComponent } from "./component";
import AdapterBehavior from "./behavior";
import AdapterPage, { WrapPage } from "./page";
import AdapterApp, { WrapApp } from "./app";
import * as NetWork from "./network";
import * as Wxml from "./wxml";
import * as Interface from "./interface";
import * as Canvas from "./canvas";
import * as Media from "./media";
import * as File from "./file";
import * as Location from "./location";
import * as Device from "./device";
import * as Storage from "./storage";
import * as UI from "./ui";
import * as OpenApi from "./open-api";

console.log("invoke aliapp");
const api = {};
const _my = typeof my !== "undefined" && my;
if (_my) {
  Extend(api, _my);
}
Extend(api, Storage);
Extend(api, NetWork);
Extend(api, Wxml);
Extend(api, Interface);
Extend(api, Canvas);
Extend(api, Media);
Extend(api, File);
Extend(api, Location);
Extend(api, Device);
Extend(api, UI);
Extend(api, OpenApi);

export default ProxyInvokePlatformApi(api);

export {
  AdapterComponent,
  AdapterBehavior,
  AdapterPage,
  WrapComponent,
  WrapPage,
  AdapterApp,
  WrapApp
};
