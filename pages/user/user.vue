<template>
	<view class="profile-container">
		<!-- 用户资料区域 -->
		<view class="profile">
			<image :src="userInfo.avatarUrl" class="avatar"></image>
			<text class="username">{{ userInfo.username }}</text>
		</view>

		<!-- 数据统计区域 -->
		<view class="stats">
			<view class="stat-item">
				<text class="stat-value">{{ userStats.likes }}</text>
				<text class="stat-label">喜欢姿势</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ userStats.checkIns }}</text>
				<text class="stat-label">打卡姿势</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ userStats.points }}</text>
				<text class="stat-label">任务积分</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" v-for="(item,index) in menuItems" :key="index" @click="navigateTo(item.path)">
				<view class="icon-container">
					<image :src="item.icon" class="icon"></image>
				</view>
				<text class="label">{{ item.name }}</text>
				<image src="/static/arrow-right.png" class="arrow-icon"></image>
			</view>
			<view class="feedback-container">
				<view class="icon-container">
					<image src="/static/pencil.png" class="icon"></image>
				</view>
				<button open-type="feedback" class="feedback-btn">意见反馈</button>
				<image src="/static/arrow-right.png" class="arrow-icon"></image>
			</view>

		</view>
	</view>
</template>

<script>
	const userInfo = {
		avatarUrl: '/static/profile.jpeg', // 默认无头像
		username: '金色天际线' // 默认用户名
	};

	const menuItems = [{
			name: '我的喜欢',
			icon: '/static/heart.png',
			path: '/pages/favorites/favorites'
		},
		{
			name: '我的打卡',
			icon: '/static/camera.png',
			path: '/pages/checkin/checkin'
		},
		{
			name: '任务中心',
			icon: '/static/menu.png',
			path: '/pages/tasks/tasks'
		}
	];

	// 用户统计数据
	const userStats = {
		points: "2,450",
		likes: "128",
		checkIns: "45"
	};

	export default {
		data() {
			return {
				userInfo: userInfo,
				menuItems: menuItems,
				userStats: userStats
			}
		},
		methods: {
			navigateTo(path) {
				if (path == '/pages/feedback/feedback') {
					// #ifdef MP-WEIXIN
					console.log("weixin-mp platform");
					wx.openFeedBackButton({
						type: 'default'
					});
					// #endif
				} else {
					console.log("current jump path: ", path);
					uni.navigateTo({
						url: path
					});
				}
			}
		}
	}
</script>

<style>
	.profile-container {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		position: relative;
	}

	/* 用户资料 */
	.profile {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 50rpx 30rpx 40rpx;
	}

	.avatar {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		background-color: #f5f5f5;
		margin-bottom: 20rpx;
		border: 2rpx solid #f0f0f0;
	}

	.username {
		font-size: 36rpx;
		font-weight: 500;
		color: #333333;
	}

	/* 菜单列表 */
	.menu-list {
		padding: 0 30rpx;
		margin-top: 20rpx;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx 0 30rpx 15rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.icon-container {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon {
		width: 48rpx;
		height: 48rpx;
	}

	.label {
		font-size: 34rpx;
		color: #333333;
		flex: 1;
		margin-left: 30rpx;
	}

	.arrow-icon {
		width: 35rpx;
		height: 35rpx;
		opacity: 0.5;
		/* 半透明效果 */
	}

	/* 数据统计区域 */
	.stats {
		display: flex;
		justify-content: space-around;
		margin: 0 30rpx 30rpx;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #f9f9f9;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		padding: 40rpx 30rpx;
	}

	.stat-value {
		font-size: 44rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 10rpx;
	}

	.stat-label {
		font-size: 30rpx;
		color: #666;
	}

	.feedback-container {
		display: flex;
		align-items: center;
		padding: 30rpx 0 30rpx 15rpx;
		border-bottom: 2rpx solid #f5f5f5;
	}

	.feedback-btn {
		border: none;
		background-color: transparent;
		padding: 0;
		margin: 0;
		display: inline-flex;
		vertical-align: middle;
		line-height: normal;
		font-size: 34rpx;
		color: #333333;
		flex: 1;
		margin-left: 30rpx;
	}

	.feedback-btn::after {
		border: none !important;
	}

	.feedback-btn.hover-effect {
		transition: all 0.2s ease;
	}

	.feedback-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		background-color: transparent !important;
	}

	.feedback-btn:active {
		transform: translateY(1px);
		background-color: transparent !important;
	}
</style>