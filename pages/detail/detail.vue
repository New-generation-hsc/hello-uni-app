<template>
	<view class="detail-container">

		<!-- 主图轮播区域 -->
		<view class="swiper-container">
			<swiper :current="currentSwipeIndex" @change="onSwiperChange" class="pose-swiper" :duration="300">
				<swiper-item v-for="(photo,index) in currentPose.photos" :key="index">
					<image :src="photo" class="model-photo" mode="aspectFill"></image>
				</swiper-item>
			</swiper>

			<!-- 轮播指示器 -->
			<view class="swiper-indicators">
				<view v-for="(_,index) in currentPose.photos" :key="index" class="indicator"
					:class="{ active: index == currentSwipeIndex}"></view>
			</view>
		</view>

		<!-- 姿势详情 -->
		<view class="pose-detail">
			<text class="pose-title">{{ currentPose.title }}</text>
			<text class="pose-description">{{ currentPose.description }}</text>

			<!-- 标签区域 -->
			<view class="tags-container">
				<text class="section-title">姿势标签</text>
				<view class="tags">
					<text class="tag" v-for="(tag,idx) in currentPose.tags" :key="idx">{{ tag }}</text>
				</view>
			</view>
		</view>

		<!-- 用户打卡区域 -->
		<view class="user-checks">
			<view class="header">
				<text class="section-title">用户打卡</text>
			</view>

			<!-- 打卡图片网络 -->
			<view class="check-grid">
				<view v-for="(item,index) in checkPhotos" :key="index" class="check-item">
					<image :src="item.photo" class="check-photo" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<!-- 底部打卡按钮 -->
		<view class="check-btn-container">
			<button class="check-btn" @click="startCheck">打卡</button>
		</view>
	</view>
</template>

<script>
	const currentPose = {
		photos: [
			"/static/girl-pose-01.png",
			"/static/girl-pose-02.png",
			"/static/girl-pose-03.png"
		],
		title: "俏皮星芒比耶姿",
		description: "右手上举比耶，食指和小指伸出，左手摸头发，左腿抬起，呈俏皮姿势。",
		tags: ["女性", "比耶", "可爱", "日常"]
	};

	// 用户打卡图片数据
	const checkPhotos = [{
			id: 1,
			photo: "/static/girl-pose-01.png"
		},
		{
			id: 2,
			photo: "/static/girl-pose-02.png"
		},
		{
			id: 3,
			photo: "/static/girl-pose-03.png"
		},
		{
			id: 4,
			photo: "/static/girl-pose-01.png"
		},
		{
			id: 5,
			photo: "/static/girl-pose-02.png"
		}
	];

	export default {
		data() {
			return {
				currentPose: currentPose,
				checkPhotos: checkPhotos,
				currentSwipeIndex: 0
			}
		},
		methods: {
			startCheck() {
				uni.navigateTo({
					url: '/pages/camera/camera'
				});
			},
			onSwiperChange(e) {
				this.currentSwipeIndex = e.detail.current;
			}
		}
	}
</script>

<style>
	/* 整体布局 */
	.detail-container {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		min-height: 100vh;
		position: relative;
		padding-bottom: 60rpx;
	}

	/* 轮播图容器 (新增) */
	.swiper-container {
		height: 550rpx;
		position: relative;
	}

	.pose-swiper {
		height: 100%;
		width: 100%;
	}

	.model-photo {
		width: 100%;
		height: 100%;
	}

	/* 轮播指示器 (三个点) */
	.swiper-indicators {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16rpx;
	}

	.indicator {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.7);
	}

	.indicator.active {
		background-color: #333;
		transform: scale(1.2);
	}

	/* 姿势详情 */
	.pose-detail {
		padding: 30rpx;
	}

	.pose-title {
		display: block;
		font-size: 42rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.pose-description {
		display: block;
		font-size: 34rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 40rpx;
	}

	/* 标签区域 */
	.tags-container {
		margin-bottom: 50rpx;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 25rpx;
		display: block;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.tag {
		background-color: #f0f0f0;
		border-radius: 40rpx;
		padding: 12rpx 30rpx;
		font-size: 30rpx;
		color: #555;
	}

	/* 用户打卡区域 */
	.user-checks {
		padding: 0 30rpx;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
	}

	/* 打卡网格 */
	.check-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 25rpx;
		padding-bottom: 150rpx;
	}

	.check-item {
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.08);
	}

	.check-photo {
		width: 100%;
		height: 220rpx;
	}

	/* 底部打卡按钮 */
	.check-btn-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 40rpx;
		background-color: #fff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	}

	.check-btn {
		background-color: #07c160;
		color: #fff;
		height: 90rpx;
		border-radius: 45rpx;
		font-size: 36rpx;
		line-height: 90rpx;
		text-align: center;
	}
</style>