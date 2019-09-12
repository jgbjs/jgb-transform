export default function AdapterBaiduPage(opts, ...otherOpts) {
  // 取最后一个参数作为Page
  const InjectPage = otherOpts.length ? (otherOpts[otherOpts.length - 1] || Page) : Page;

  InjectPage(opts)
}

export function WrapPage(InjectPage = Page) {
  return (opts) => {
    AdapterBaiduPage(opts, InjectPage)
  }
}
