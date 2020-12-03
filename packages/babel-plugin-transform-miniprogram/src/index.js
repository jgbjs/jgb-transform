import traverse from "./adapter";

export default function ({ types: t }) {
  return traverse(t);
}
