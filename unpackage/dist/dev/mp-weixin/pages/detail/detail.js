"use strict";
const common_vendor = require("../../common/vendor.js");
const currentPose = {
  photos: [
    "/static/girl-pose-01.png",
    "/static/girl-pose-02.png",
    "/static/girl-pose-03.png"
  ],
  title: "俏皮星芒比耶姿",
  description: "右手上举比耶，食指和小指伸出，左手摸头发，左腿抬起，呈俏皮姿势。",
  tags: ["女性", "比耶", "可爱", "日常"]
};
const checkPhotos = [
  { id: 1, photo: "/static/girl-pose-01.png" },
  { id: 2, photo: "/static/girl-pose-02.png" },
  { id: 3, photo: "/static/girl-pose-03.png" },
  { id: 4, photo: "/static/girl-pose-01.png" },
  { id: 5, photo: "/static/girl-pose-02.png" }
];
const _sfc_main = {
  data() {
    return {
      currentPose,
      checkPhotos,
      currentSwipeIndex: 0
    };
  },
  methods: {
    startCheck() {
      common_vendor.index.navigateTo({
        url: "/pages/camera/camera"
      });
    },
    onSwiperChange(e) {
      this.currentSwipeIndex = e.detail.current;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.currentPose.photos, (photo, index, i0) => {
      return {
        a: photo,
        b: index
      };
    }),
    b: $data.currentSwipeIndex,
    c: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    d: common_vendor.f($data.currentPose.photos, (_, index, i0) => {
      return {
        a: index,
        b: index == $data.currentSwipeIndex ? 1 : ""
      };
    }),
    e: common_vendor.t($data.currentPose.title),
    f: common_vendor.t($data.currentPose.description),
    g: common_vendor.f($data.currentPose.tags, (tag, idx, i0) => {
      return {
        a: common_vendor.t(tag),
        b: idx
      };
    }),
    h: common_vendor.f($data.checkPhotos, (item, index, i0) => {
      return {
        a: item.photo,
        b: index
      };
    }),
    i: common_vendor.o((...args) => $options.startCheck && $options.startCheck(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
