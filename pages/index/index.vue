<template>
	<view class="container">
		<view class="content">
			<!-- 照片展示区域 -->
			<view class="photo-container">
				<image :src="currentPhoto" class="photo" mode="aspectFill" @click="viewPhotoDetail"></image>
				
				<!-- 收藏按钮 -->
				<view 
					class="favorite-btn" 
				    :class="{'hover-effect': isHovered}" 
				    @touchstart="toggleHover(true)"
				    @touchend="toggleHover(false)"
				    @click="toggleFavorite"
				>
					<image :src="isFavorite ? '/static/heart-filled.png' : '/static/heart-outlined.png'" class="heart-icon"></image>
				</view>	
			</view>	
		</view>
		
		<!-- 换一换按钮 -->
		<view class="change-container">
			<view class="change-btn" :disabled="remainCount <= 0" @click="changePhoto">换一个</view>
		</view>
		
		<!-- 剩余次数提示 -->
		<view class="hint-container">
			<image src="/static/ringing.png" mode="aspectFill" class="hint-icon"></image>
			<text class="hint-text">提示：当前剩余{{ remainCount }}次切换机会</text>
		</view>
	</view>
</template>

<script>
	const photoList = [
		"/static/girl-pose-01.png",
		"/static/girl-pose-02.png",
		"/static/girl-pose-03.png",
	]
	export default {
		data() {
			return {
				currentPhoto: "/static/girl-pose-01.png",
				isFavorite: false,
				isHovered: false,
				remainCount: 10
			}
		},
		onLoad() {

		},
		methods: {
			changePhoto() {
				if(this.remainCount <= 0) return;
				const randomIndex = Math.floor(Math.random() * photoList.length);
				this.currentPhoto = photoList[randomIndex];
				this.isFavorite = false;
				this.remainCount--;
			},
			
			toggleFavorite() {
				this.isFavorite = !this.isFavorite;
			},
			
			toggleHover(state) {
				this.isHovered = state;
			} ,
			
			viewPhotoDetail(photo) {
				uni.navigateTo({
					url: '/pages/detail/detail'
				});
			}
		}
	}
</script>

<style>
	.container {
	  display: flex;
	  flex-direction: column;
	  position: relative;
	}
	
	/* 页面标题 */
	.header {
	  padding: 25rpx 30rpx;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.title {
	  font-size: 40rpx;
	  font-weight: 600;
	  color: #333333;
	}
	
	.content {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 40rpx;
	}
	
	/* 照片容器 */
	.photo-container {
	  position: relative;
	  width: 500rpx;
	  height: 750rpx;
	  border-radius: 24rpx;
	  overflow: hidden;
	  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.1);
	  background: #fff;
	}
	
	.photo {
	  width: 100%;
	  height: 100%;
	}
	
	/* 收藏按钮 */
	.favorite-btn {
	  position: absolute;
	  right: 20rpx;
	  bottom: 20rpx;
	  width: 70rpx;
	  height: 70rpx;
	  background: transparent;
	  border-radius: 50%;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  transition: all 0.3s ease; /* 添加过渡效果 */
	}
	
	/* 悬停/点击效果 */
	.favorite-btn.hover-effect,
	.favorite-btn:active {
	  background: rgba(255,255,255,0.9); /* 背景变亮 */
	  box-shadow: 0 0 1rpx rgba(0,0,0,0.2); /* 添加阴影效果 */
	  transform: scale(1.05); /* 轻微放大 */
	}
	
	/* 更现代的波纹效果（可选） */
	.favorite-btn::after {
	  content: '';
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  border-radius: 50%;
	  background: rgba(0,0,0,0.1);
	  opacity: 0;
	  transform: scale(0.9);
	  transition: all 0.4s ease;
	  pointer-events: none;
	}
	
	.favorite-btn.hover-effect::after,
	.favorite-btn:active::after {
	  opacity: 1;
	  transform: scale(1.2);
	}
	
	.heart-icon {
	  width: 50rpx;
	  height: 50rpx;
	}
	
	.change-container {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	/* 换一换按钮 */
	.change-btn {
	  width: 300rpx;
	  height: 90rpx;
	  background: #6EBF7A;
	  color: white;
	  font-size: 36rpx;
	  border-radius: 60rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  margin-top: 30rpx;
	}
	
	.hint-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20rpx;
		margin-top: 30rpx;
	}
	
	.hint-icon {
		width: 30rpx;
		height: 30rpx;
	}
	
	/* 提示文本 */
	.hint-text {
	  font-size: 28rpx;
	  color: #999;
	}
</style>
