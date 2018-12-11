import { AdapterComponent } from './component'

export default function AdapterAliappBehavior(opts) {
  opts = Object.assign({}, opts);
  return AdapterComponent(opts);
}