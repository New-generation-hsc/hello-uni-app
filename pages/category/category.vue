<template>
	<view class="category-container">
		<!-- 标题栏 -->
		<view class="header">
		<text class="title">热门图鉴</text>
			<view class="filter-btn">
				<image src="/static/filter.png" class="filter-icon"></image>
				<text class="filter-text" @click="openFilter">筛选</text>
			</view>
		</view>
		
		<!-- 热门图片网格 -->
		<view class="gallery">
			<view v-for="(item,index) in photoList" :key="index" class="photo-card" @click="viewPhotoDetail(item)">
				<image :src="item.url" class="photo" mode="aspectFill"></image>
				<view class="photo-info">
					<text class="like-count">{{ item.likes }}</text>
					<image :src="item.liked ? '/static/heart-outlined.png' : '/static/heart-filled.png'" class="like-icon"></image>
				</view>
			</view>
		</view>
		
		<!-- 使用筛选组件 -->
		  <FilterModal
			:initialPeople="filter.people"
			:initialScene="filter.scene"
			@filter-applied="handleFilterApplied"
		  />
	</view>
</template>

<script>
	import FilterModal from "@/components/filter-modal.vue";
	
	const photoList = [
	  { 
	    id: 1, 
	    url: '/static/girl-pose-01.png', 
	    likes: 243, 
	    liked: false,
	    title: "夏日清风",
	    description: "阳光下的白衣少女"
	  },
	  { 
	    id: 2, 
	    url: '/static/girl-pose-02.png', 
	    likes: 198, 
	    liked: true,
	    title: "俏皮眨眼",
	    description: "黑色长发微风吹拂"
	  },
	  { 
	    id: 3, 
	    url: '/static/girl-pose-03.png', 
	    likes: 312, 
	    liked: false,
	    title: "侧颜浅笑",
	    description: "阳光下温暖微笑"
	  },
	  { 
	    id: 4, 
	    url: '/static/girl-pose-01.png',
	    likes: 176, 
	    liked: false,
	    title: "双手比心",
	    description: "可爱手势送温暖"
	  },
	  { 
	    id: 5, 
	    url: '/static/girl-pose-02.png',
	    likes: 289, 
	    liked: false,
	    title: "回眸一笑",
	    description: "长发飘飘回望镜头"
	  },
	  { 
	    id: 6, 
	    url: '/static/girl-pose-03.png',
	    likes: 224, 
	    liked: false,
	    title: "活泼跳跃",
	    description: "动感青春活力四射"
	  },
	  {
	    id: 7, 
	    url: '/static/girl-pose-02.png',
	    likes: 289, 
	    liked: false,
	    title: "回眸一笑",
	    description: "长发飘飘回望镜头"
	  },
	  { 
	    id: 8, 
	    url: '/static/girl-pose-03.png',
	    likes: 224, 
	    liked: false,
	    title: "活泼跳跃",
	    description: "动感青春活力四射"
	  },
	  {
	    id: 5, 
	    url: '/static/girl-pose-02.png',
	    likes: 289, 
	    liked: false,
	    title: "回眸一笑",
	    description: "长发飘飘回望镜头"
	  },
	  { 
	    id: 6, 
	    url: '/static/girl-pose-03.png',
	    likes: 224, 
	    liked: false,
	    title: "活泼跳跃",
	    description: "动感青春活力四射"
	  }
	];
	
	export default {
		components: {
		    FilterModal
		},
		data() {
			return {
				photoList : photoList,
				// 筛选条件
				  filter: {
					people: "single",
					scene: "daily"
				  }
			}
		},
		methods: {
			viewPhotoDetail(photo) {
				uni.navigateTo({
					url: '/pages/detail/detail'
				});
			},
			
			// 处理筛选结果
			handleFilterApplied(filter) {
			  this.filter = filter;
			  // 在这里执行实际的筛选逻辑
			  console.log("应用筛选条件:", filter);
			  
			  uni.showToast({
				title: "筛选条件已应用",
				icon: "success"
			  });
			},
			
			// 直接打开筛选弹窗（可选）
			openFilter() {
			  this.$refs.filterModal.openModal();
			}
		}
	}
</script>

<style>
/* 整体布局 */
.category-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5; /* 浅灰色背景 */
  position: relative;
}

/* 标题栏 */
.header {
  padding: 25rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff; /* 标题栏白色背景 */
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333333;
}

.filter-btn {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #f3f7f7;
  border-radius: 30rpx;
}

.filter-icon {
  width: 34rpx;
  height: 34rpx;
  margin-right: 8rpx;
}

.filter-text {
  font-size: 30rpx;
  color: #666;
}

/* 图片网格布局 */
.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 30rpx;
  flex: 1;
}

.photo-card {
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.photo-card:active {
  transform: scale(0.97);
}

.photo {
  width: 100%;
  height: 405rpx;
}

.photo-info {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10rpx 15rpx;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 30rpx 0 0 0;
}

.like-count {
  font-size: 26rpx;
  color: #fff;
  margin-right: 8rpx;
}

.like-icon {
  width: 34rpx;
  height: 34rpx;
}
</style>
