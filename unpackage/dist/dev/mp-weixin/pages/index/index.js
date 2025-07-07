"use strict";
const common_vendor = require("../../common/vendor.js");
const photoList = [
  "/static/girl-pose-01.png",
  "/static/girl-pose-02.png",
  "/static/girl-pose-03.png"
];
const _sfc_main = {
  data() {
    return {
      currentPhoto: "/static/girl-pose-01.png",
      isFavorite: false,
      isHovered: false,
      remainCount: 10
    };
  },
  onLoad() {
  },
  methods: {
    changePhoto() {
      if (this.remainCount <= 0)
        return;
      const randomIndex = Math.floor(Math.random() * photoList.length);
      this.currentPhoto = photoList[randomIndex];
      this.isFavorite = false;
      this.remainCount--;
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    toggleHover(state) {
      this.isHovered = state;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.currentPhoto,
    b: $data.isFavorite ? "/static/heart-filled.png" : "/static/heart-outlined.png",
    c: $data.isHovered ? 1 : "",
    d: common_vendor.o(($event) => $options.toggleHover(true)),
    e: common_vendor.o(($event) => $options.toggleHover(false)),
    f: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args)),
    g: $data.remainCount <= 0,
    h: common_vendor.o((...args) => $options.changePhoto && $options.changePhoto(...args)),
    i: common_vendor.t($data.remainCount)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
