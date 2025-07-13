"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 分类标签
      categories: ["全部", "室内", "室外", "街拍", "日常"],
      // 当前选中的分类
      activeCategory: 0,
      // 收藏的姿势数据
      favoriteItems: [
        {
          id: 1,
          image: "/static/girl-pose-01.png",
          title: "自然随性",
          likes: 2341,
          tags: ["女性", "微笑", "日常"]
        },
        {
          id: 2,
          image: "/static/girl-pose-02.png",
          title: "优雅气质",
          likes: 1892,
          tags: ["男性", "优雅", "商务"]
        },
        {
          id: 3,
          image: "/static/girl-pose-03.png",
          title: "街拍文艺",
          likes: 2156,
          tags: ["女性", "街拍", "文艺"]
        },
        {
          id: 4,
          image: "/static/girl-pose-01.png",
          title: "日常生活",
          likes: 1678,
          tags: ["男性", "日常", "休闲"]
        }
      ]
    };
  },
  methods: {
    // 查看详情
    viewDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`
      });
    },
    selectCategory(index) {
      this.activeCategory = index;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: $data.activeCategory === index ? 1 : "",
        d: common_vendor.o(($event) => $options.selectCategory(index), index)
      };
    }),
    b: common_vendor.f($data.favoriteItems, (item, index, i0) => {
      return {
        a: item.image,
        b: item.title,
        c: common_vendor.t(item.title),
        d: common_vendor.t(item.likes),
        e: index,
        f: common_vendor.o(($event) => $options.viewDetail(item), index)
      };
    }),
    c: common_assets._imports_0$3,
    d: $data.favoriteItems.length === 0
  }, $data.favoriteItems.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/favorites/favorites.js.map
