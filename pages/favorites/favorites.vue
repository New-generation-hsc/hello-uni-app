<template>
	<view class="favorites-container">
		<!-- 分类标签 -->
		<view class="categories">
			<scroll-view scroll-x class="categories-scroll" :show-scrollbar="false" scroll-with-animation>
				<view v-for="(item, index) in categories" :key="index" class="category"
					:class="{ active: activeCategory === index }" @click="selectCategory(index)">
					{{ item }}
				</view>
			</scroll-view>
		</view>

		<!-- 图片网格 - 使用数组渲染 -->
		<view class="photo-grid">
			<view v-for="(item, index) in favoriteItems" :key="index" class="photo-card" @click="viewDetail(item)">
				<image :src="item.image" class="photo-img" :alt="item.title" />
				<view class="photo-details">
					<text class="photo-caption">{{ item.title }}</text>
					<view class="photo-likes">
						<image src="/static/heart.png" class="heart-icon" />
						<text class="likes-count">{{ item.likes }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 显示提示信息（当数组为空时） -->
		<view v-if="favoriteItems.length === 0" class="empty-message">
			<text class="empty-text">你还没有喜欢的姿势</text>
			<button class="browse-btn">去发现</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 分类标签
				categories: ['全部', '室内', '室外', '街拍', '日常'],
				// 当前选中的分类
				activeCategory: 0,
				// 收藏的姿势数据
				favoriteItems: [{
						id: 1,
						image: "/static/girl-pose-01.png",
						title: "自然随性",
						likes: 2341,
						tags: ["女性", "微笑", "日常"]
					},
					{
						id: 2,
						image: "/static/girl-pose-02.png",
						title: "优雅气质",
						likes: 1892,
						tags: ["男性", "优雅", "商务"]
					},
					{
						id: 3,
						image: "/static/girl-pose-03.png",
						title: "街拍文艺",
						likes: 2156,
						tags: ["女性", "街拍", "文艺"]
					},
					{
						id: 4,
						image: "/static/girl-pose-01.png",
						title: "日常生活",
						likes: 1678,
						tags: ["男性", "日常", "休闲"]
					}
				]
			};
		},
		methods: {
			// 查看详情
			viewDetail(item) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${item.id}`
				});
			},
			selectCategory(index) {
				this.activeCategory = index;
			},
		}
	}
</script>

<style>
	/* 整体布局 */
	.favorites-container {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding-bottom: 20rpx;
		/* 底部留白 */
	}

	/* 分类标签 */
	.categories {
		padding: 15rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.categories-scroll {
		white-space: nowrap;
	}

	.category {
		display: inline-block;
		padding: 12rpx 30rpx;
		margin-right: 20rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #555555;
		background-color: #f5f5f5;
		transition: all 0.3s ease;
	}

	.category.active {
		background-color: #4B5563;
		color: white;
		font-weight: 500;
	}

	/* 图片网格布局 */
	.photo-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		padding: 30rpx;
	}

	.photo-card {
		border-radius: 20rpx;
		overflow: hidden;
		background-color: #ffffff;
		box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
	}

	.photo-card:active {
		transform: scale(0.97);
	}

	.photo-img {
		width: 100%;
		height: 300rpx;
	}

	.photo-details {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.photo-caption {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
		margin-bottom: 15rpx;
		display: block;
	}

	.photo-likes {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.heart-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.likes-count {
		font-size: 28rpx;
		color: #666666;
	}

	/* 空状态提示 */
	.empty-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 30rpx;
		margin-top: 50rpx;
	}

	.empty-text {
		font-size: 36rpx;
		color: #999;
		margin-bottom: 40rpx;
	}

	.browse-btn {
		background-color: #8e44ad;
		color: white;
		width: 60%;
		border-radius: 40rpx;
		font-size: 32rpx;
	}
</style>