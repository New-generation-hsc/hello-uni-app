"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      showCamera: true,
      cameraPosition: "back",
      flash: "off",
      isCapturing: false,
      countdown: 0,
      showPoseTip: false,
      // 控制提示框显示
      isTipFading: false,
      // 控制淡出动画
      tipTimer: null
      // 提示框定时器
    };
  },
  // 添加 onReady 生命周期
  onReady() {
    this.showPoseSelectionTip();
  },
  // 在 onHide 中清理定时器
  onHide() {
    this.clearTipTimer();
  },
  // 在 onUnload 中清理定时器
  onUnload() {
    this.clearTipTimer();
  },
  methods: {
    switchCamera() {
      this.cameraPosition = this.cameraPosition === "back" ? "front" : "back";
    },
    takePhoto() {
      if (this.isCapturing)
        return;
      this.isCapturing = true;
      this.startCountdown();
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 倒计时
    startCountdown() {
      this.countdown = 3;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          common_vendor.index.vibrateShort();
          clearInterval(timer);
          this.capturePhoto();
        }
      }, 1e3);
    },
    // 执行拍照
    capturePhoto() {
      const ctx = common_vendor.index.createCameraContext();
      ctx.takePhoto({
        quality: "high",
        success: (res) => {
          this.capturedImage = res.tempImagePath;
          this.isCapturing = false;
          this.playShutterSound();
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/camera/camera.vue:126", "拍照失败:", err);
          this.isCapturing = false;
          common_vendor.index.showToast({
            title: "拍照失败",
            icon: "none"
          });
        }
      });
    },
    // 播放快门音效
    playShutterSound() {
      const audioContext = common_vendor.index.createInnerAudioContext();
      audioContext.src = "/static/audio/shutter.mp3";
      audioContext.play();
    },
    // 显示姿势选择提示
    showPoseSelectionTip() {
      setTimeout(() => {
        this.showPoseTip = true;
        this.tipTimer = setTimeout(() => {
          this.startTipFadeOut();
        }, 2e3);
      }, 500);
    },
    // 开始淡出动画
    startTipFadeOut() {
      this.isTipFading = true;
      setTimeout(() => {
        this.showPoseTip = false;
        this.isTipFading = false;
      }, 300);
    },
    // 清理定时器
    clearTipTimer() {
      if (this.tipTimer) {
        clearTimeout(this.tipTimer);
        this.tipTimer = null;
      }
    },
    // 手动隐藏提示框（可选，用户点击提示框时）
    hidePoseTip() {
      this.clearTipTimer();
      this.startTipFadeOut();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showCamera
  }, $data.showCamera ? common_vendor.e({
    b: $data.countdown > 0
  }, $data.countdown > 0 ? {
    c: common_vendor.t($data.countdown)
  } : {}, {
    d: $data.cameraPosition,
    e: $data.flash
  }) : {}, {
    f: common_assets._imports_0$3,
    g: common_assets._imports_1$2,
    h: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    i: $data.showPoseTip
  }, $data.showPoseTip ? {
    j: $data.isTipFading ? 1 : "",
    k: common_vendor.o((...args) => $options.hidePoseTip && $options.hidePoseTip(...args))
  } : {}, {
    l: common_assets._imports_0$3,
    m: $data.isCapturing
  }, $data.isCapturing ? {} : {}, {
    n: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    o: common_assets._imports_2,
    p: common_vendor.o((...args) => $options.switchCamera && $options.switchCamera(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b8d50ad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/camera/camera.js.map
