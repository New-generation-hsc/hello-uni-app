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
      tipTimer: null,
      // 提示框定时器,
      showSettingsModal: false,
      // 滚动相关
      scrollTop: 0,
      isScrolling: false,
      scrollTimer: null,
      // 设置相关
      settings: {
        opacity: 0.3,
        // 透明度
        countdownDuration: 3,
        // 倒计时时长（秒）
        displayMode: "background",
        // 显示模式: 'background' | 'float'
        vibration: true,
        // 震动反馈
        shutterSound: true,
        // 快门音效
        showGrid: false,
        // 当前选中的参考线类型
        selectedOption: "grid",
        // 所有参考线选项
        options: [
          {
            value: "grid",
            label: "九宫格参考线"
          },
          {
            value: "golden",
            label: "黄金分割线"
          },
          {
            value: "spiral",
            label: "黄金螺旋线"
          },
          {
            value: "diagonal",
            label: "对角线参考线"
          },
          {
            value: "thirds",
            label: "三分法参考线"
          }
        ]
      },
      // 倒计时选项
      countdownOptions: [0, 1, 3, 5, 10],
      // 浮窗拖拽相关
      floatPosition: {
        x: 50,
        y: 200
      },
      isDragging: false,
      dragStartPos: {
        x: 0,
        y: 0
      }
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
  computed: {
    isIOS() {
      const platform = common_vendor.index.getSystemInfoSync().platform;
      return platform === "ios" || platform === "mac";
    }
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
          common_vendor.index.navigateTo({
            url: "/pages/pose-preview/pose-preview?originalImage=" + this.capturedImage + "&referenceImage=/static/girl-pose-03.png"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/camera/camera.vue:314", "拍照失败:", err);
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
    },
    // 设置相关方法
    showSettings() {
      this.hidePoseTip();
      this.showSettingsModal = true;
    },
    closeSettings() {
      this.showSettingsModal = false;
    },
    // 透明度调整
    onOpacityChange(e) {
      this.settings.opacity = e.detail.value / 100;
    },
    // 倒计时时长设置
    setCountdownDuration(duration) {
      this.settings.countdownDuration = duration;
    },
    // 显示模式设置
    setDisplayMode(mode) {
      this.settings.displayMode = mode;
      if (mode === "float") {
        this.initFloatPosition();
      }
    },
    // 开关设置
    onVibrationChange(e) {
      this.settings.vibration = e.detail.value;
    },
    onShutterSoundChange(e) {
      this.settings.shutterSound = e.detail.value;
    },
    onAutoCaptureChange(e) {
      this.settings.autoCapture = e.detail.value;
    },
    // 重置设置
    resetSettings() {
      common_vendor.index.showModal({
        title: "确认重置",
        content: "是否恢复所有设置为默认值？",
        success: (res) => {
          if (res.confirm) {
            this.settings = {
              opacity: 0.3,
              countdownDuration: 3,
              displayMode: "background",
              vibration: true,
              shutterSound: true,
              autoCapture: false
            };
            common_vendor.index.showToast({
              title: "已恢复默认设置",
              icon: "success"
            });
          }
        }
      });
    },
    // 保存设置
    saveSettings() {
      common_vendor.index.showToast({
        title: "设置已保存",
        icon: "success"
      });
      this.closeSettings();
    },
    // 浮窗拖拽相关方法
    initFloatPosition() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.floatPosition = {
        x: systemInfo.windowWidth - 200,
        y: 200
      };
    },
    // 滚动相关方法 - 优化
    onScroll(e) {
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.isScrolling = true;
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false;
      }, 150);
      const newScrollTop = e.detail.scrollTop;
      if (Math.abs(newScrollTop - this.scrollTop) > 5) {
        this.scrollTop = newScrollTop;
      }
    },
    onScrollToUpper() {
      common_vendor.index.__f__("log", "at pages/camera/camera.vue:473", "滚动到顶部");
    },
    onScrollToLower() {
      common_vendor.index.__f__("log", "at pages/camera/camera.vue:478", "滚动到底部");
    },
    // 新增的设置方法
    onSaveOriginalChange(e) {
      this.settings.saveOriginal = e.detail.value;
    },
    onWatermarkChange(e) {
      this.settings.addWatermark = e.detail.value;
    },
    onGridChange(e) {
      this.settings.showGrid = e.detail.value;
      if (this.settings.showGrid && !this.settings.selectedOption) {
        this.settings.selectedOption = "grid";
      }
    },
    // 选择参考线类型
    selectOption(value) {
      if (!this.settings.showGrid)
        return;
      this.settings.selectedOption = value;
    }
  }
};
if (!Array) {
  const _component_transition = common_vendor.resolveComponent("transition");
  _component_transition();
}
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
    m: common_vendor.o((...args) => $options.showSettings && $options.showSettings(...args)),
    n: $data.isCapturing
  }, $data.isCapturing ? {} : {}, {
    o: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    p: common_assets._imports_2,
    q: common_vendor.o((...args) => $options.switchCamera && $options.switchCamera(...args)),
    r: $data.showSettingsModal
  }, $data.showSettingsModal ? common_vendor.e({
    s: common_vendor.o((...args) => $options.closeSettings && $options.closeSettings(...args)),
    t: common_vendor.t(Math.round($data.settings.opacity * 100)),
    v: $data.settings.opacity * 100,
    w: common_vendor.o((...args) => $options.onOpacityChange && $options.onOpacityChange(...args)),
    x: common_vendor.o((...args) => $options.onOpacityChange && $options.onOpacityChange(...args)),
    y: common_vendor.t($data.settings.countdownDuration),
    z: common_vendor.f($data.countdownOptions, (duration, k0, i0) => {
      return {
        a: common_vendor.t(duration),
        b: duration,
        c: $data.settings.countdownDuration === duration ? 1 : "",
        d: common_vendor.o(($event) => $options.setCountdownDuration(duration), duration)
      };
    }),
    A: $data.settings.displayMode === "background" ? "/static/background-active.png" : "/static/background.png",
    B: $data.settings.displayMode === "background" ? 1 : "",
    C: common_vendor.o(($event) => $options.setDisplayMode("background")),
    D: $data.settings.displayMode === "float" ? "/static/float-active.png" : "/static/float.png",
    E: $data.settings.displayMode === "float" ? 1 : "",
    F: common_vendor.o(($event) => $options.setDisplayMode("float")),
    G: $data.settings.vibration,
    H: common_vendor.o((...args) => $options.onVibrationChange && $options.onVibrationChange(...args)),
    I: $data.settings.shutterSound,
    J: common_vendor.o((...args) => $options.onShutterSoundChange && $options.onShutterSoundChange(...args)),
    K: $data.settings.showGrid,
    L: common_vendor.o((...args) => $options.onGridChange && $options.onGridChange(...args)),
    M: $data.settings.showGrid
  }, $data.settings.showGrid ? {
    N: common_vendor.f($data.settings.options, (option, index, i0) => {
      return {
        a: option.value,
        b: $data.settings.selectedOption === option.value,
        c: common_vendor.o(($event) => $options.selectOption(option.value), index),
        d: common_vendor.t(option.label),
        e: index
      };
    }),
    O: !$data.settings.showGrid
  } : {}, {
    P: common_vendor.p({
      name: "fade"
    }),
    Q: common_vendor.o((...args) => $options.resetSettings && $options.resetSettings(...args)),
    R: common_vendor.o((...args) => $options.saveSettings && $options.saveSettings(...args)),
    S: $data.scrollTop,
    T: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    U: common_vendor.o(() => {
    }),
    V: common_vendor.o((...args) => $options.closeSettings && $options.closeSettings(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b8d50ad"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/camera/camera.js.map
