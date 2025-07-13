"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const userInfo = {
  avatarUrl: "/static/profile.jpeg",
  // 默认无头像
  username: "金色天际线"
  // 默认用户名
};
const menuItems = [
  { name: "我的喜欢", icon: "/static/heart.png", path: "/pages/favorites/favorites" },
  { name: "我的打卡", icon: "/static/camera.png", path: "/pages/checkin/checkin" },
  { name: "任务中心", icon: "/static/menu.png", path: "/pages/tasks/tasks" }
];
const userStats = {
  points: "2,450",
  likes: "128",
  checkIns: "45"
};
const _sfc_main = {
  data() {
    return {
      userInfo,
      menuItems,
      userStats
    };
  },
  methods: {
    navigateTo(path) {
      if (path == "/pages/feedback/feedback") {
        common_vendor.index.__f__("log", "at pages/user/user.vue:77", "weixin-mp platform");
        common_vendor.wx$1.openFeedBackButton({
          type: "default"
        });
      } else {
        common_vendor.index.__f__("log", "at pages/user/user.vue:83", "current jump path: ", path);
        common_vendor.index.navigateTo({
          url: path
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatarUrl,
    b: common_vendor.t($data.userInfo.username),
    c: common_vendor.t($data.userStats.likes),
    d: common_vendor.t($data.userStats.checkIns),
    e: common_vendor.t($data.userStats.points),
    f: common_vendor.f($data.menuItems, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.navigateTo(item.path), index)
      };
    }),
    g: common_assets._imports_0$1,
    h: common_assets._imports_1,
    i: common_assets._imports_0$1
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
