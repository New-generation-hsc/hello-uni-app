"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      point: {
        progressPercentage: 2580 / 3e3 * 100,
        // 根据积分计算进度百分比
        currentPoint: 2580,
        nextPoint: 420
      },
      activeTab: 0,
      // 默认选择每日任务
      tabs: [
        { id: 0, label: "每日任务", type: "daily" },
        { id: 1, label: "成长任务", type: "growth" },
        { id: 2, label: "限时任务", type: "time-limit" }
      ],
      // 每日任务数据
      dailyTasks: [
        {
          id: 1,
          name: "每日打卡",
          description: "完成今日拍照打卡",
          points: 10,
          completed: false,
          type: "daily"
        },
        {
          id: 2,
          name: "分享作品",
          description: "分享一张你的作品到社交媒体",
          points: 20,
          completed: true,
          type: "daily"
        },
        {
          id: 3,
          name: "浏览灵感",
          description: "浏览10张作品获取灵感",
          points: 15,
          completed: false,
          type: "daily"
        }
      ],
      // 成长任务数据
      growthTasks: [
        {
          id: 4,
          name: "连续签到",
          description: "连续签到7天解锁成就勋章",
          points: 50,
          completed: false,
          type: "growth"
        },
        {
          id: 5,
          name: "解锁姿势",
          description: "掌握10种不同拍照姿势",
          points: 100,
          completed: false,
          type: "growth"
        },
        {
          id: 6,
          name: "完美姿势",
          description: "获得5次10分评价的作品",
          points: 150,
          completed: false,
          type: "growth"
        }
      ],
      // 限时任务数据
      timeLimitTasks: [
        {
          id: 7,
          name: "夏日主题挑战",
          description: "拍摄夏日主题照片获得额外奖励",
          points: 100,
          deadline: "截止至2024/08/31",
          completed: false,
          type: "time-limit"
        },
        {
          id: 8,
          name: "好友邀请赛",
          description: "邀请3位好友加入并获得奖励",
          points: 150,
          deadline: "截止至2024/07/15",
          completed: false,
          type: "time-limit"
        },
        {
          id: 9,
          name: "节日限定任务",
          description: "创作中秋主题作品",
          points: 120,
          deadline: "截止至2024/09/10",
          completed: false,
          type: "time-limit"
        }
      ],
      tasks: [
        // 示例数据 - 实际应用中从API获取
        { id: 1, name: "连续打卡7天", completed: 5, total: 7, reward: 100 },
        { id: 2, name: "收藏50个姿势", completed: 28, total: 50, reward: 200 },
        // 可以添加更多任务
        { id: 3, name: "练习30个动作", completed: 18, total: 30, reward: 150 },
        { id: 4, name: "累计训练20小时", completed: 8, total: 20, reward: 300 }
      ]
    };
  },
  methods: {
    // 切换任务标签
    switchTab(index) {
      this.activeTab = index;
    },
    // 处理任务操作
    handleTaskAction(task) {
      if (task.completed)
        return;
      task.completed = true;
      this.showTaskCompleteEffect(task);
    },
    // 显示任务完成效果
    showTaskCompleteEffect(task) {
      common_vendor.index.showToast({
        title: `任务完成！+${task.points}积分`,
        icon: "success",
        duration: 1500
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.point.currentPoint),
    b: common_assets._imports_0$5,
    c: common_vendor.t($data.point.nextPoint),
    d: $data.point.progressPercentage + "%",
    e: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.label),
        b: common_vendor.n(`tab-${tab.type}`),
        c: index,
        d: $data.activeTab === index ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(index), index)
      };
    }),
    f: $data.activeTab === 0
  }, $data.activeTab === 0 ? {
    g: common_vendor.f($data.dailyTasks, (task, index, i0) => {
      return {
        a: common_vendor.t(task.name),
        b: common_vendor.t(task.description),
        c: common_vendor.t(task.points > 0 ? "+" : ""),
        d: common_vendor.t(task.points),
        e: common_vendor.t(task.completed ? "已完成" : "去完成"),
        f: task.completed ? 1 : "",
        g: common_vendor.o(($event) => $options.handleTaskAction(task), index),
        h: index
      };
    }),
    h: common_assets._imports_1$2
  } : {}, {
    i: $data.activeTab === 1
  }, $data.activeTab === 1 ? {
    j: common_vendor.f($data.tasks, (task, k0, i0) => {
      return {
        a: common_vendor.t(task.name),
        b: common_vendor.t(task.reward),
        c: task.completed / task.total * 100 + "%",
        d: common_vendor.t(task.completed),
        e: common_vendor.t(task.total),
        f: task.id
      };
    })
  } : {}, {
    k: $data.activeTab === 2
  }, $data.activeTab === 2 ? {
    l: common_vendor.f($data.timeLimitTasks, (task, index, i0) => {
      return {
        a: common_vendor.t(task.name),
        b: common_vendor.t(task.deadline),
        c: common_vendor.t(task.description),
        d: common_vendor.t(task.points > 0 ? "+" : ""),
        e: common_vendor.t(task.points),
        f: common_vendor.t(task.completed ? "已完成" : "立即参与"),
        g: task.completed ? 1 : "",
        h: common_vendor.o(($event) => $options.handleTaskAction(task), index),
        i: index
      };
    }),
    m: common_assets._imports_2
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-027feebf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/tasks/tasks.js.map
