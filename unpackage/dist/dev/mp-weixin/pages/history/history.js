"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      historyGroups: [
        {
          date: "2024/01/20",
          items: [
            {
              images: [
                "/static/girl-pose-01.png",
                "/static/girl-pose-02.png",
                "/static/girl-pose-03.png",
                "/static/girl-pose-01.png"
              ]
            }
          ],
          expanded: true
        },
        {
          date: "2024/01/19",
          items: [
            {
              images: [
                "/static/girl-pose-01.png",
                "/static/girl-pose-02.png",
                "/static/girl-pose-03.png",
                "/static/girl-pose-01.png"
              ]
            }
          ],
          expanded: true
        }
      ]
    };
  },
  methods: {
    toggleGroup(index) {
      this.historyGroups[index].expanded = !this.historyGroups[index].expanded;
      this.$forceUpdate();
    },
    viewPhotoDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.historyGroups, (group, index, i0) => {
      return {
        a: common_vendor.t(group.date),
        b: common_vendor.o(($event) => $options.toggleGroup(index), index),
        c: common_vendor.f(group.items, (item, itemIndex, i1) => {
          return {
            a: common_vendor.f(item.images, (img, imgIndex, i2) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o((...args) => $options.viewPhotoDetail && $options.viewPhotoDetail(...args), imgIndex)
              };
            }),
            b: itemIndex
          };
        }),
        d: group.expanded,
        e: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/history.js.map
