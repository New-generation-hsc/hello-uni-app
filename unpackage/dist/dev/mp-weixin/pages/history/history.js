"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      historyPoses: [
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
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.historyPoses, (item, index, i0) => {
      return {
        a: item.image,
        b: item.title,
        c: common_vendor.t(item.title),
        d: common_vendor.t(item.likes),
        e: index,
        f: common_vendor.o(($event) => _ctx.viewDetail(item), index)
      };
    }),
    b: common_assets._imports_0$4
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
