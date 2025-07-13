<template>
	<view class="history-container">
	    <!-- 图片网格 - 使用数组渲染 -->
	    <view class="photo-grid">
	      <view 
	    	v-for="(item, index) in historyPoses" 
	    	:key="index" 
	    	class="photo-card"
	    	@click="viewDetail(item)"
	      >
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
	  </view>
</template>

<script>
	export default {
		data() {
			return {
				historyPoses: [
				  {
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
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	
.history-container {
  background-color: #f7f9fc;
  min-height: 100vh;
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
</style>