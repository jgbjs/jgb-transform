const miniappAdapter = require("../lib");
const requireAdapterPath = miniappAdapter.default;
const extendSupportPlatform = miniappAdapter.extendSupportPlatform;

const adapterPath = requireAdapterPath("aliapp");
const wx = require(adapterPath).default;

global.my = {
  httpRequest({ success }) {
    success("success");
  }
};

describe("request", () => {
  test("success", () => {
    wx.request({
      url: "",
      success(result) {
        expect(result).toBe("success");
      }
    });
  });
});
