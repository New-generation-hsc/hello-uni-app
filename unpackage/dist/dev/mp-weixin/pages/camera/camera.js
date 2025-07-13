"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const cameraContext = common_vendor.ref(null);
const _sfc_main = {
  data() {
    return {};
  },
  mounted() {
    cameraContext.value = common_vendor.index.createCameraContext();
  },
  methods: {
    saveCheckRecord(imagePath) {
      common_vendor.index.showToast({
        title: "打卡成功！",
        icon: "success",
        duration: 1500
      });
      setTimeout(() => {
        common_vendor.index.__f__("log", "at pages/camera/camera.vue:41", "show Toast");
        common_vendor.index.navigateBack();
      }, 1500);
    },
    capturePhoto() {
      const that = this;
      cameraContext.value.takePhoto({
        quality: "high",
        success: (res) => {
          common_vendor.index.previewImage({
            urls: [res.tempImagePath],
            success: () => {
              that.saveCheckRecord(res.tempImagePath);
            }
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.o((...args) => $options.capturePhoto && $options.capturePhoto(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/camera/camera.js.map
