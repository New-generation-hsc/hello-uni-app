<template>
    <view class="container">
        <!-- 上下滑动容器 -->
        <swiper class="main-swiper" :vertical="true" :indicator-dots="false" :current="currentPage"
            @change="onPageChange" :duration="300">
            <!-- 主页面 - 姿势推荐 -->
            <swiper-item class="page main-page">
                <view class="recommend-container">
                    <view class="content">
                        <!-- 照片展示区域 -->
                        <view class="photo-container">
                            <image :src="currentPose.image" class="photo" mode="aspectFill" @click="viewPhotoDetail">
                            </image>
                            <!-- 收藏按钮 -->
                            <view class="favorite-btn" :class="{'hover-effect': isHovered}"
                                @touchstart="toggleHover(true)" @touchend="toggleHover(false)" @click="toggleFavorite">
                                <image
                                    :src="currentPose.isFavorite ? '/static/heart-filled.png' : '/static/heart-outlined.png'"
                                    class="heart-icon"></image>
                            </view>
                        </view>
                    </view>

                    <!-- 换一换按钮 -->
                    <view class="change-container">
                        <view class="change-btn" :class="{ active : remainCount > 0}" @click="changePhoto">换一个</view>
                    </view>

                    <!-- 剩余次数提示 -->
                    <view class="hint-container">
                        <image src="/static/ringing.png" mode="aspectFill" class="hint-icon"></image>
                        <text class="hint-text">提示：当前剩余{{ remainCount }}次切换机会</text>
                    </view>

                    <!-- 在姿势卡片后面添加 -->
                    <view v-if="showSwipeHint" class="swipe-hint" :style="{ bottom: swipeHintHeight + 'rpx'}">
                        <image src="/static/arrow-up.png" class="arrow-icon" />
                        <text class="hint-text">滑动查看历史推荐姿势</text>
                    </view>
                </view>
            </swiper-item>

            <!-- 历史页面 -->
            <swiper-item class="page history-page">
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
                                        <image v-for="(img, imgIndex) in item.images" :key="imgIndex" :src="img"
                                            class="grid-image" @click="viewPhotoDetail" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </swiper-item>
        </swiper>

        <!-- 加载状态 -->
        <view class="loading-overlay" v-if="isLoading">
            <view class="loading-content">
                <view class="loading-spinner"></view>
                <text class="loading-text">正在加载新姿势...</text>
            </view>
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
                isHovered: false,
                remainCount: 10,
                lastIndex: 0,

                // 页面状态
                currentPage: 0, // 0: 主页面, 1: 历史页面

                // 当前姿势数据
                currentPose: {
                    pose_id: "",
                    image: '/static/girl-pose-01.png',
                    isFavorite: false,
                    timestamp: Date.now()
                },

                isChanging: false,
                isLoading: false,
                showSwipeHint: true,
                swipeHintHeight: 80,

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

        onLoad() {
            this.initPage()
        },

        onShow() {
            // 页面显示时隐藏滑动提示
            setTimeout(() => {
                this.showSwipeHint = false
            }, 3000);
        },

        onReady() {},

        methods: {
            // 初始化页面
            initPage() {
                // 获取系统信息
                const systemInfo = uni.getSystemInfoSync()
                this.screenHeight = systemInfo.screenHeight
            },

            // 页面切换事件
            onPageChange(e) {
                this.currentPage = e.detail.current
                this.vibrate('light')

                const HISTORY_PAGE = 1;
                if (this.currentPage == HISTORY_PAGE) {
                    this.showSwipeHint = false;
                    uni.setNavigationBarTitle({
                        title: "历史推荐姿势"
                    });
                } else {
                    uni.setNavigationBarTitle({
                        title: ""
                    });
                }
            },

            // 振动反馈
            vibrate(type = 'light') {
                try {
                    uni.vibrateShort({
                        type
                    })
                } catch (error) {
                    console.log('振动反馈不支持')
                }
            },

            changePhoto() {
                if (this.remainCount <= 0) {
                    uni.showToast({
                        title: '今日切换次数已用完',
                        icon: 'none'
                    });
                    return;
                }

                let randomIndex = Math.floor(Math.random() * photoList.length);
                if (randomIndex == this.lastIndex) {
                    randomIndex = (randomIndex + 1) % photoList.length;
                }
                this.currentPose.image = photoList[randomIndex];
                this.currentPose.isFavorite = false;

                this.lastIndex = randomIndex;
                this.remainCount--;
            },

            toggleFavorite() {
                this.currentPose.isFavorite = !this.currentPose.isFavorite;
            },

            toggleHover(state) {
                this.isHovered = state;
            },

            viewPhotoDetail(photo) {
                uni.navigateTo({
                    url: '/pages/detail/detail'
                });
            },

            goToHistory() {
                uni.navigateTo({
                    url: '/pages/history/history',
                    animationType: 'slide-in-bottom'
                });
            },

            toggleGroup(index) {
                this.historyGroups[index].expanded = !this.historyGroups[index].expanded;
                this.$forceUpdate();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        width: 100vw;
        height: 100vh;
        // background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    // 主swiper容器
    .main-swiper {
        flex: 1;

        .page {
            height: 100%;
            position: relative;
        }
    }

    // 加载状态
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;

        .loading-content {
            background: white;
            border-radius: 20rpx;
            padding: 60rpx;
            display: flex;
            flex-direction: column;
            align-items: center;

            .loading-spinner {
                width: 60rpx;
                height: 60rpx;
                border: 4rpx solid #f3f3f3;
                border-top: 4rpx solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20rpx;
            }

            .loading-text {
                color: #666;
                font-size: 24rpx;
            }
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    // 响应式适配
    @media screen and (max-width: 375px) {
        .main-page .pose-display {
            padding: 20rpx;
        }

        .history-grid {
            grid-template-columns: 1fr;
        }
    }

    // 安全区域适配
    @supports (bottom: env(safe-area-inset-bottom)) {
        .main-page .content-container {
            padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
        }

        .history-page .history-container {
            padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
        }
    }

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
        box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
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
        transition: all 0.3s ease;
        /* 添加过渡效果 */
    }

    /* 悬停/点击效果 */
    .favorite-btn.hover-effect,
    .favorite-btn:active {
        background: rgba(255, 255, 255, 0.9);
        /* 背景变亮 */
        box-shadow: 0 0 1rpx rgba(0, 0, 0, 0.2);
        /* 添加阴影效果 */
        transform: scale(1.05);
        /* 轻微放大 */
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
        background: rgba(0, 0, 0, 0.1);
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
        background: #ccc;
        color: white;
        font-size: 36rpx;
        border-radius: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30rpx;
    }

    .change-btn.active {
        background: #6EBF7A;
        color: white;
    }

    .change-btn.active:active {
        transform: scale(0.97);
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

    .swipe-hint {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        left: 31%;

        .arrow-icon {
            width: 30rpx;
            height: 30rpx;
            margin-bottom: 10rpx;
            animation: floatUp 2s infinite ease-in-out;
        }

        .hint-text {
            font-size: 28rpx;
            color: #999;
        }
    }

    @keyframes floatUp {

        0%,
        100% {
            transform: translateY(0);
            opacity: 0.8;
        }

        50% {
            transform: translateY(-10rpx);
            opacity: 1;
        }
    }

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