<template>
	<view class="history-container">
		<!-- 历史姿势列表 -->
		<scroll-view scroll-y class="history-scroll">
			<!-- 动态渲染 -->
			<view v-for="(group, index) in historyGroups" :key="index" class="group-section">
				<view class="date-section" @click="toggleGroup(index)">
					<text class="date-title">{{ group.date }}</text>
				</view>

				<view class="pose-group" v-show="group.expanded">
					<view v-for="(item, itemIndex) in group.items" :key="itemIndex" class="pose-item">
						<view class="pose-grid">
							<image v-for="(img, imgIndex) in item.images" :key="imgIndex" :src="img" class="grid-image"
								@click="viewPhotoDetail" />
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				historyGroups: [{
						date: '2024/01/20',
						items: [{
							images: [
								'/static/girl-pose-01.png',
								'/static/girl-pose-02.png',
								'/static/girl-pose-03.png',
								'/static/girl-pose-01.png',
							]
						}],
						expanded: true
					},
					{
						date: '2024/01/19',
						items: [{
							images: [
								'/static/girl-pose-01.png',
								'/static/girl-pose-02.png',
								'/static/girl-pose-03.png',
								'/static/girl-pose-01.png',
							]
						}],
						expanded: true
					}
				]
			}
		},
		methods: {
			toggleGroup(index) {
				this.historyGroups[index].expanded = !this.historyGroups[index].expanded;
				this.$forceUpdate();
			},
			viewPhotoDetail() {
				uni.navigateTo({
					url: `/pages/detail/detail`
				});
			}
		}
	}
</script>

<style lang="scss">
	.history-container {
		background-color: #f7f9fc;
		min-height: 100vh;
	}

	/* 历史滚动区域 */
	.history-scroll {
		height: calc(100vh - 90rpx);
		padding: 0 20rpx 40rpx;
		width: 94%;
	}

	/* 日期分组 */
	.date-section {
		margin-top: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.date-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		padding-left: 20rpx;
		margin-bottom: 20rpx;
		display: block;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 8rpx;
			height: 30rpx;
			background-color: #07c160;
			border-radius: 4rpx;
		}
	}

	.pose-group {
		background-color: #ffffff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	/* 姿势项 */
	.pose-item {
		padding: 30rpx;
		border-bottom: 1rpx solid #f8f8f8;

		&:last-child {
			border-bottom: none;
		}
	}

	.pose-desc {
		font-size: 32rpx;
		color: #333;
		line-height: 1.5;
		margin-bottom: 25rpx;
		display: block;
	}

	.pose-series {
		font-size: 26rpx;
		color: #07c160;
		margin-left: 20rpx;
	}

	/* 姿势网格 */
	.pose-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15rpx;
	}

	.grid-image {
		width: 100%;
		height: 300rpx;
		border-radius: 8rpx;
		background-color: #f0f0f0;
		transition: transform 0.3s ease;
	}

	.grid-image:active {
		transform: scale(0.97);
	}
</style>