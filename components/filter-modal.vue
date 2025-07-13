<!-- components/FilterModal.vue -->
<template>
    <!-- 筛选弹窗 -->
    <view class="filter-modal" v-if="isVisible" @click="closeModal">
      <view class="modal-content" @click.stop>
        <!-- 弹窗头部 -->
        <view class="modal-header">
          <text class="modal-title">筛选</text>
          <view class="close-button" @click="closeModal">
            <text class="close-icon">×</text>
          </view>
        </view>
        
        <!-- 拍摄人数筛选 -->
        <view class="filter-section">
          <text class="section-title">拍摄人数</text>
          <view class="filter-options">
            <view 
              v-for="(option, index) in peopleOptions" 
              :key="index"
              class="option-item"
              :class="{ 'selected': selectedPeople === option.value }"
              @click="selectPeople(option.value)"
            >
              {{ option.label }}
            </view>
          </view>
        </view>
        
        <!-- 拍摄场景筛选 -->
        <view class="filter-section">
          <text class="section-title">拍摄场景</text>
          <view class="filter-options">
            <view 
              v-for="(option, index) in sceneOptions" 
              :key="index"
              class="option-item"
              :class="{ 'selected': selectedScene === option.value }"
              @click="selectScene(option.value)"
            >
              {{ option.label }}
            </view>
          </view>
        </view>
        
        <!-- 确定按钮 -->
        <view class="confirm-button" @click="applyFilter">
          确定
        </view>
      </view>
    </view>
</template>

<script>
export default {
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
      // 发送筛选条件到父组件
      this.$emit("filter-applied", {
        people: this.selectedPeople,
        scene: this.selectedScene
      });
      
      // 关闭弹窗
      this.closeModal();
    }
  }
};
</script>

<style lang="scss" scoped>
/* 筛选按钮样式 */
.filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 10rpx 24rpx;
  font-size: 28rpx;
  color: #333;
  
  .filter-icon {
    width: 30rpx;
    height: 30rpx;
    margin-right: 10rpx;
  }
}

/* 筛选弹窗样式 */
.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 38rpx;
  font-weight: 600;
  color: #000;
}

.close-button {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .close-icon {
    font-size: 44rpx;
    color: #666;
    line-height: 1;
    margin-top: -8rpx;
  }
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 50rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
  display: block;
  margin-bottom: 25rpx;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.option-item {
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 16rpx 40rpx;
  font-size: 30rpx;
  color: #666;
  transition: all 0.2s ease;
  
  &.selected {
    background-color: #000;
    color: #fff;
  }
}

/* 确定按钮 */
.confirm-button {
  background-color: #000;
  color: #fff;
  height: 90rpx;
  border-radius: 45rpx;
  font-size: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
</style>