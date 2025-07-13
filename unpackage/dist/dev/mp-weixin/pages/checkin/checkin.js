"use strict";
const common_vendor = require("../../common/vendor.js");
const systemInfo = common_vendor.index.getSystemInfoSync();
const _sfc_main = {
  data() {
    return {
      dynamicHeight: systemInfo.windowHeight - 48,
      // 打卡记录数组
      checkinRecords: [
        {
          id: 1,
          date: "2024年2月8日",
          poseName: "站立前屈式",
          image: "/static/girl-pose-01.png",
          time: "08:30",
          streakDays: 30,
          details: "站立前屈式是哈他瑜伽中的常见体式，能有效拉伸腿部后侧肌肉"
        },
        {
          id: 2,
          date: "2024年2月7日",
          poseName: "战士二式",
          image: "/static/girl-pose-02.png",
          time: "09:15",
          streakDays: 29,
          details: "战士二式能够加强腿部力量，同时增强耐力和专注力"
        },
        {
          id: 3,
          date: "2024年2月6日",
          poseName: "树式",
          image: "/static/girl-pose-03.png",
          time: "08:45",
          streakDays: 28,
          details: "树式可以改善平衡能力，同时增强脚踝和大腿的力量"
        },
        {
          id: 4,
          date: "2024年2月5日",
          poseName: "下犬式",
          image: "/static/girl-pose-01.png",
          time: "07:55",
          streakDays: 27,
          details: "下犬式能拉伸全身，帮助缓解压力和焦虑"
        }
      ],
      streakDays: 3,
      // 连续打卡天数
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      calendarDays: []
    };
  },
  mounted() {
    this.generateCalendar();
  },
  methods: {
    viewRecordDetail(record) {
      common_vendor.index.__f__("log", "at pages/checkin/checkin.vue:134", "width: ", systemInfo.windowHeight);
      common_vendor.index.__f__("log", "at pages/checkin/checkin.vue:135", "content: ", this.dynamicHeight);
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail"
      });
    },
    // 生成日历数据
    generateCalendar() {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDay.getDay();
      const days = [];
      const prevMonthDays = new Date(year, month, 0).getDate();
      for (let i = prevMonthDays - firstDayOfWeek + 1; i <= prevMonthDays; i++) {
        days.push({
          day: i,
          inMonth: false,
          checked: false
        });
      }
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const isToday = i === today.getDate() && month === today.getMonth();
        days.push({
          day: i,
          inMonth: true,
          checked: i <= today.getDate(),
          // 今天及之前的日期都标记为已打卡
          isToday
        });
      }
      const nextMonthDays = 42 - days.length;
      for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
          day: i,
          inMonth: false,
          checked: false
        });
      }
      this.calendarDays = days;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.streakDays),
    b: common_vendor.f(7, (day, k0, i0) => {
      return {
        a: day,
        b: day <= $data.streakDays ? 1 : ""
      };
    }),
    c: common_vendor.f($data.weekdays, (day, index, i0) => {
      return {
        a: common_vendor.t(day),
        b: index
      };
    }),
    d: common_vendor.f($data.calendarDays, (day, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.day),
        b: day.checked
      }, day.checked ? {} : {}, {
        c: index,
        d: day.inMonth ? 1 : "",
        e: day.checked ? 1 : "",
        f: day.isToday ? 1 : ""
      });
    }),
    e: common_vendor.f($data.checkinRecords, (record, index, i0) => {
      return {
        a: common_vendor.t(record.date),
        b: record.image,
        c: common_vendor.t(record.poseName),
        d: common_vendor.t(record.time),
        e: common_vendor.t(record.streakDays),
        f: index,
        g: common_vendor.o(($event) => $options.viewRecordDetail(record), index)
      };
    }),
    f: $data.checkinRecords.length === 0
  }, $data.checkinRecords.length === 0 ? {} : {}, {
    g: $data.dynamicHeight + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/checkin/checkin.js.map
