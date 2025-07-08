<template>
	<view class="profile-container">
		<!-- 用户资料区域 -->
		<view class="profile">
			<image :src="userInfo.avatarUrl" class="avatar"></image>
			<text class="username">{{ userInfo.username }}</text>
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
		</view>
	</view>
</template>

<script>
	const userInfo = {
	  avatarUrl: '/static/profile.jpeg', // 默认无头像
	  username: '金色天际线' // 默认用户名
	};
	
	const menuItems = [
	  { name: '我的喜欢', icon: '/static/heart.png', path: '/pages/index/index' },
	  { name: '我的打卡', icon: '/static/camera.png', path: '/pages/index/index' },
	  { name: '任务中心', icon: '/static/menu.png', path: '/pages/index/index' },
	  { name: '意见反馈', icon: '/static/pencil.png', path: '/pages/index/index' }
	];
	
	export default {
		data() {
			return {
				userInfo: userInfo,
				menuItems: menuItems
			}
		},
		methods: {
			navigateTo(path) {
				console.log(path);
				uni.navigateTo({
					url: path
				});
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
  opacity: 0.5; /* 半透明效果 */
}
</style>
