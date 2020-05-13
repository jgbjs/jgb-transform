export function getStorageSync(key) {
  const result = my.getStorageSync({ key });
  return result.data || ""
}
