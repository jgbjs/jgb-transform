export function getBluetoothDevices(opts) {
  const {success} = opts;
  my.getBluetoothDevices({
    ...opts,
    success(res) {
      const {devices} = res
      success && success({
        devices: formatDevicesToWechat(devices)
      })
    }
  })
}

export function getConnectedBluetoothDevices(opts) {
  const {success} = opts;
  my.getBluetoothDevices({
    ...opts,
    success(res) {
      const {devices} = res
      success && success({
        devices: formatDevicesToWechat(devices)
      })
    }
  })
}

function formatDevicesToWechat(devices = []) {
  return devices.map((d) => {
    return {
      ...d,
      name: d.name || d.deviceName,

    }
  })
}
