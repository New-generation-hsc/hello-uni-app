"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "FilterModal",
  props: {
    // 初始筛选条件
    initialPeople: {
      type: String,
      default: "single"
    },
    initialScene: {
      type: String,
      default: "daily"
    }
  },
  data() {
    return {
      isVisible: false,
      selectedPeople: this.initialPeople,
      selectedScene: this.initialScene,
      // 拍摄人数选项
      peopleOptions: [
        { label: "单人写真", value: "single" },
        { label: "双人写真", value: "double" },
        { label: "多人合影", value: "group" }
      ],
      // 拍摄场景选项
      sceneOptions: [
        { label: "日常随拍", value: "daily" },
        { label: "毕业写真", value: "graduation" },
        { label: "闺蜜写真", value: "friends" },
        { label: "生日派对", value: "birthday" },
        { label: "旅拍写真", value: "travel" },
        { label: "形象照", value: "profile" }
      ]
    };
  },
  methods: {
    // 打开弹窗
    openModal() {
      this.isVisible = true;
    },
    // 关闭弹窗
    closeModal() {
      this.isVisible = false;
    },
    // 选择拍摄人数
    selectPeople(value) {
      this.selectedPeople = value;
    },
    // 选择拍摄场景
    selectScene(value) {
      this.selectedScene = value;
    },
    // 应用筛选条件
    applyFilter() {
      this.$emit("filter-applied", {
        people: this.selectedPeople,
        scene: this.selectedScene
      });
      this.closeModal();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isVisible
  }, $data.isVisible ? {
    b: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args)),
    c: common_vendor.f($data.peopleOptions, (option, index, i0) => {
      return {
        a: common_vendor.t(option.label),
        b: index,
        c: $data.selectedPeople === option.value ? 1 : "",
        d: common_vendor.o(($event) => $options.selectPeople(option.value), index)
      };
    }),
    d: common_vendor.f($data.sceneOptions, (option, index, i0) => {
      return {
        a: common_vendor.t(option.label),
        b: index,
        c: $data.selectedScene === option.value ? 1 : "",
        d: common_vendor.o(($event) => $options.selectScene(option.value), index)
      };
    }),
    e: common_vendor.o((...args) => $options.applyFilter && $options.applyFilter(...args)),
    f: common_vendor.o(() => {
    }),
    g: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c4fad269"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/filter-modal.js.map
