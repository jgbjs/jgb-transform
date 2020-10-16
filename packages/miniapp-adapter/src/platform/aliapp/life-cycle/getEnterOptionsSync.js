import { getData } from "../innerData";

export function getEnterOptionsSync() {
  return getData("EnterOptions") || my.getLaunchOptionsSync();
}
