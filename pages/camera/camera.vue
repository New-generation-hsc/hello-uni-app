<template>
  <view class="camera-page">
    <!-- 相机组件（全屏） -->
    <camera
      class="camera"
      :device-position="cameraPosition"
      :flash="flash"
      v-if="showCamera"
    ></camera>

    <!-- 姿势参考图（居中，半透明） -->
    <image
      src="/static/girl-pose-01.png"
      class="pose-reference"
      :style="{ opacity: 0.5 }"
    />

    <!-- 自定义顶部导航栏 -->
    <view class="custom-navbar">
      <!-- 返回按钮 -->
      <view class="nav-left" @click="goBack">
        <image src="/static/arrow_left.png" class="nav-icon" />
      </view>
    </view>

     <!-- 固定在底部的操作栏 -->
	<view class="fixed-action-bar">
	  <!-- 水平指示条 -->
	  <view class="indicator-bar"></view>
	  
	  <view class="action-items">
		<!-- 左侧：相册预览 -->
		<view class="action-item album-preview">
		  <image src="/static/girl-pose-01.png" class="preview-image" />
		</view>
		
		<!-- 中央：拍照按钮 -->
		<view class="action-item shutter-container" @click="takePhoto">
		  <view class="shutter-button">
			<view class="shutter-circle"></view>
		  </view>
		</view>
		
		<!-- 右侧：切换摄像头 -->
		<view class="action-item switch-camera" @click="switchCamera">
		  <image src="/static/switch_camera.png" class="switch-icon" />
		</view>
	  </view>
	</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showCamera: true,
      cameraPosition: 'back',
      flash: 'off'
    }
  },
  methods: {
    switchCamera() {
      this.cameraPosition = this.cameraPosition === 'back' ? 'front' : 'back';
    },
    takePhoto() {
      // 拍照逻辑
    },
	goBack() {
		console.log("goback");
		uni.navigateBack();
	}
    // 其他方法...
  }
}
</script>

<style lang="scss" scoped>
.camera-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
}

.camera {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.pose-reference {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 70%;
  z-index: 2;
}

.custom-navbar {
  position: absolute;
  top: var(--status-bar-height);
  left: 0;
  right: 0;
  height: 90rpx; /* 自定义导航栏高度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx;
  z-index: 3;
}

.nav-left, .nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50rpx;
}

.nav-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 固定在底部的操作栏 */
.fixed-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);
  padding: 40rpx 0;
}

/* 操作项容器 */
.action-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60rpx;
}

/* 每个操作项的通用样式 */
.action-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
}

/* 相册预览 */
.album-preview {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  overflow: hidden;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  
  .preview-image {
    width: 100%;
    height: 100%;
  }
}

/* 拍照按钮容器 */
.shutter-container {
  flex: 1;
  max-width: 200rpx;
}

/* 拍照按钮 */
.shutter-button {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
}

.shutter-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #ffffff;
  border: 4rpx solid rgba(255, 255, 255, 0.6);
  transition: all 0.1s ease;
  
  .shutter-button:active & {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

/* 切换摄像头按钮 */
.switch-camera {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
}

.switch-icon {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(200%);
}
</style>