"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const FilterModal = () => "../../components/filter-modal.js";
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
  components: {
    FilterModal
  },
  data() {
    return {
      photoList,
      // 筛选条件
      filter: {
        people: "single",
        scene: "daily"
      }
    };
  },
  methods: {
    viewPhotoDetail(photo) {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail"
      });
    },
    // 处理筛选结果
    handleFilterApplied(filter) {
      this.filter = filter;
      common_vendor.index.__f__("log", "at pages/category/category.vue:140", "应用筛选条件:", filter);
      common_vendor.index.showToast({
        title: "筛选条件已应用",
        icon: "success"
      });
    },
    // 直接打开筛选弹窗（可选）
    openFilter() {
      this.$refs.filterModal.openModal();
    }
  }
};
if (!Array) {
  const _component_FilterModal = common_vendor.resolveComponent("FilterModal");
  _component_FilterModal();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.openFilter && $options.openFilter(...args)),
    c: common_vendor.f($data.photoList, (item, index, i0) => {
      return {
        a: item.url,
        b: common_vendor.t(item.likes),
        c: item.liked ? "/static/heart-outlined.png" : "/static/heart-filled.png",
        d: index,
        e: common_vendor.o(($event) => $options.viewPhotoDetail(item), index)
      };
    }),
    d: common_vendor.sr("filterModal", "684b07d6-0"),
    e: common_vendor.o($options.handleFilterApplied),
    f: common_vendor.p({
      initialPeople: $data.filter.people,
      initialScene: $data.filter.scene
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/category/category.js.map
