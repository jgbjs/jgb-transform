const map = new Map();

export function saveData(key, value) {
  map.set(key, value);
}

export function getData(key) {
  return map.get(key)
}
