"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      showCamera: true,
      cameraPosition: "back",
      flash: "off"
    };
  },
  methods: {
    switchCamera() {
      this.cameraPosition = this.cameraPosition === "back" ? "front" : "back";
    },
    takePhoto() {
    },
    goBack() {
      common_vendor.index.__f__("log", "at pages/camera/camera.vue:70", "goback");
      common_vendor.index.navigateBack();
    }
    // 其他方法...
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showCamera
  }, $data.showCamera ? {
    b: $data.cameraPosition,
    c: $data.flash
  } : {}, {
    d: common_assets._imports_0$3,
    e: common_assets._imports_1$2,
    f: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    g: common_assets._imports_0$3,
    h: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    i: common_assets._imports_2,
    j: common_vendor.o((...args) => $options.switchCamera && $options.switchCamera(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b8d50ad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/camera/camera.js.map
