"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const photoList = [
  {
    id: 1,
    url: "/static/girl-pose-01.png",
    likes: 243,
    liked: false,
    title: "夏日清风",
    description: "阳光下的白衣少女"
  },
  {
    id: 2,
    url: "/static/girl-pose-02.png",
    likes: 198,
    liked: true,
    title: "俏皮眨眼",
    description: "黑色长发微风吹拂"
  },
  {
    id: 3,
    url: "/static/girl-pose-03.png",
    likes: 312,
    liked: false,
    title: "侧颜浅笑",
    description: "阳光下温暖微笑"
  },
  {
    id: 4,
    url: "/static/girl-pose-01.png",
    likes: 176,
    liked: false,
    title: "双手比心",
    description: "可爱手势送温暖"
  },
  {
    id: 5,
    url: "/static/girl-pose-02.png",
    likes: 289,
    liked: false,
    title: "回眸一笑",
    description: "长发飘飘回望镜头"
  },
  {
    id: 6,
    url: "/static/girl-pose-03.png",
    likes: 224,
    liked: false,
    title: "活泼跳跃",
    description: "动感青春活力四射"
  },
  {
    id: 7,
    url: "/static/girl-pose-02.png",
    likes: 289,
    liked: false,
    title: "回眸一笑",
    description: "长发飘飘回望镜头"
  },
  {
    id: 8,
    url: "/static/girl-pose-03.png",
    likes: 224,
    liked: false,
    title: "活泼跳跃",
    description: "动感青春活力四射"
  },
  {
    id: 5,
    url: "/static/girl-pose-02.png",
    likes: 289,
    liked: false,
    title: "回眸一笑",
    description: "长发飘飘回望镜头"
  },
  {
    id: 6,
    url: "/static/girl-pose-03.png",
    likes: 224,
    liked: false,
    title: "活泼跳跃",
    description: "动感青春活力四射"
  }
];
const _sfc_main = {
  data() {
    return {
      photoList
    };
  },
  methods: {
    viewPhotoDetail(photo) {
      common_vendor.index.navigateTo({
        url: "pages/photo-detail?id=${photo.id}"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.f($data.photoList, (item, index, i0) => {
      return {
        a: item.url,
        b: common_vendor.t(item.likes),
        c: item.liked ? "/static/heart-outlined.png" : "/static/heart-filled.png",
        d: index,
        e: common_vendor.o(($event) => $options.viewPhotoDetail(item), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/category/category.js.map
