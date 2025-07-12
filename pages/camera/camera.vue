<template>
	<view class="camera-container">
	    <!-- 相机预览 -->
	    <camera class="camera-preview" device-position="front"></camera>
	    
	    <!-- 姿势参考图 -->
	    <image class="pose-reference" src="@/static/girl-pose-01.png" />
	    
	    <!-- 拍照按钮 -->
	    <view class="capture-btn" @click="capturePhoto">
	      <view class="capture-icon"></view>
	    </view>
	</view>
</template>

<script>
	import { ref } from 'vue';
	
	const cameraContext = ref(null);
	
	export default {
		data() {
			return {
				
			}
		},
		mounted(){
			// 创建相机上下文
			cameraContext.value = uni.createCameraContext();
		},
		methods: {
			saveCheckRecord(imagePath) {
			  uni.showToast({
			    title: '打卡成功！',
			    icon: 'success',
			    duration: 1500
			  });
			  
			  // 实际项目中这里保存到服务器
			  setTimeout(() => {
				  console.log("show Toast");
			    uni.navigateBack();
			  }, 1500);
			},
			
			capturePhoto() {
			  const that = this;
			  cameraContext.value.takePhoto({
			    quality: 'high',
			    success: (res) => {
			      uni.previewImage({
			        urls: [res.tempImagePath],
			        success: () => {
			          // 保存打卡记录
			          that.saveCheckRecord(res.tempImagePath);
			        }
			      });
			    }
			  });
			}
		}
	}
</script>

<style>
.camera-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.camera-preview {
  width: 100%;
  height: 100%;
}

.pose-reference {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 200rpx;
  height: 300rpx;
  border-radius: 20rpx;
  border: 2rpx solid #fff;
  box-shadow: 0 0 20rpx rgba(0,0,0,0.2);
}

.capture-btn {
  position: absolute;
  bottom: 100rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-icon {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  background: #f44;
}
</style>
