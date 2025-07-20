<template>
    <view class="photo-comparison">
        <!-- Tab 导航 -->
        <view class="tab-navigation">
            <view class="tab-item" v-for="(tab, index) in tabs" :key="tab.key"
                :class="{ active: currentTab === tab.key }" @click="switchTab(tab.key)">
                <text class="tab-text">{{ tab.name }}</text>
                <view class="tab-indicator" v-if="currentTab === tab.key"></view>
            </view>
        </view>

        <!-- 图片展示区域 -->
        <view class="image-display-area">
            <!-- 原图展示 -->
            <view class="original-display" v-if="currentTab === 'original'">
                <view class="image-container">
                    <image class="main-image" :src="originalImage" mode="aspectFit" @click="onImageClick"
                        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
                        :style="imageStyle" />
                </view>
            </view>

            <!-- 对比展示 -->
            <view class="comparison-display" v-if="currentTab === 'comparison'">
                <view class="split-container" :style="{ transform: `translateX(${splitOffset}px)` }">
                    <!-- 原图区域 -->
                    <view class="split-section left-section" :style="leftSectionStyle">
                        <image class="split-image" :src="originalImage" mode="aspectFit"
                            @touchstart="onImageTouchStart($event, 'left')"
                            @touchmove="onImageTouchMove($event, 'left')" @touchend="onImageTouchEnd($event, 'left')"
                            :style="leftImageStyle" />
                        <view class="image-label left-label">
                            <text>您的照片</text>
                        </view>
                    </view>

                    <!-- 参考图区域 -->
                    <view class="split-section right-section" :style="rightSectionStyle">
                        <image class="split-image" :src="referenceImage" mode="aspectFit"
                            @touchstart="onImageTouchStart($event, 'right')"
                            @touchmove="onImageTouchMove($event, 'right')" @touchend="onImageTouchEnd($event, 'right')"
                            :style="rightImageStyle" />
                        <view class="image-label right-label">
                            <text>标准示例</text>
                        </view>
                    </view>
                </view>

                <!-- 可拖动分割线 -->
                <view class="split-line" :style="{ left: splitPosition + 'px' }" @touchstart="onSplitTouchStart"
                    @touchmove="onSplitTouchMove" @touchend="onSplitTouchEnd">
                    <view class="split-handle">
                        <view class="handle-icon">⟷</view>
                    </view>
                </view>

                <!-- 图片标签 -->
                <view class="comparison-labels">
                    <text class="label-left" :style="{ opacity: leftLabelOpacity }">原图</text>
                    <text class="label-right" :style="{ opacity: rightLabelOpacity }">示例</text>
                </view>
            </view>

            <!-- 混合展示 -->
            <view class="blend-display" v-if="currentTab === 'blend'">
                <view class="blend-container">
                    <!-- 底层图片（参考图） -->
                    <image class="blend-image base-image" :src="referenceImage" mode="aspectFit"
                        :style="baseImageStyle" />

                    <!-- 顶层图片（原图） -->
                    <image class="blend-image overlay-image" :src="originalImage" mode="aspectFit"
                        :style="overlayImageStyle" />

                    <!-- 混合控制器 -->
                    <view class="blend-controls" v-if="showBlendControl">
                        <view class="control-item">
                            <text class="control-label">透明度</text>
                            <slider class="blend-slider" :value="blendOpacity * 100" min="0" max="100" step="1"
                                activeColor="#007AFF" backgroundColor="rgba(255,255,255,0.3)" block-size="20"
                                @changing="onOpacityChange" @change="onOpacityChange" />
                            <text class="control-value">{{ Math.round(blendOpacity * 100) }}%</text>
                        </view>

                        <view class="control-item">
                            <text class="control-label">混合模式</text>
                            <scroll-view class="blend-modes" scroll-x>
                                <view class="blend-mode-item" v-for="mode in blendModes" :key="mode.value"
                                    :class="{ active: currentBlendMode === mode.value }"
                                    @click="setBlendMode(mode.value)">
                                    <text class="mode-name">{{ mode.name }}</text>
                                </view>
                            </scroll-view>
                        </view>

                        <view class="control-item">
                            <text class="control-label">位置调整</text>
                            <view class="position-controls">
                                <button class="pos-btn" @click="adjustPosition('left')">←</button>
                                <button class="pos-btn" @click="adjustPosition('up')">↑</button>
                                <button class="pos-btn" @click="adjustPosition('down')">↓</button>
                                <button class="pos-btn" @click="adjustPosition('right')">→</button>
                                <button class="pos-btn reset" @click="resetPosition">重置</button>
                            </view>
                        </view>
                    </view>

                    <!-- 混合信息显示 -->
                    <view class="blend-info" v-if="showBlendInfo">
                        <text class="info-text">匹配度: {{ calculateMatchScore() }}%</text>
                        <text class="info-tip">调整参数以获得最佳对比效果</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-actions">
            <view v-if="currentTab === 'blend'" class="action-btn" @click="togglePhotoSetting">
                <view class="btn-icon">
                    <image src="/static/image-setting.png" class="btn-icon-img"></image>
                </view>
                <text class="btn-text">调整</text>
            </view>

            <view class="action-btn" @click="retakePhoto">
                <view class="btn-icon">
                    <image src="/static/retake.png" class="btn-icon-img"></image>
                </view>
                <text class="btn-text">重拍</text>
            </view>

            <view class="action-btn" @click="savePhoto">
                <view class="btn-icon">
                    <image src="/static/download-image.png" class="btn-icon-img"></image>
                </view>
                <text class="btn-text">保存</text>
            </view>

            <view class="action-btn" @click="sharePhoto">
                <view class="btn-icon">
                    <image src="/static/share_icon.png" class="btn-icon-img"></image>
                </view>
                <text class="btn-text">分享</text>
            </view>
        </view>

        <!-- 底部指示器 -->
        <view class="bottom-indicator"></view>

        <!-- 加载提示 -->
        <view class="loading-overlay" v-if="isLoading">
            <view class="loading-content">
                <view class="loading-spinner"></view>
                <text class="loading-text">{{ loadingText }}</text>
            </view>
        </view>

        <!-- 帮助提示 -->
        <view class="help-tips" v-if="showHelpTips">
            <view class="tip-content">
                <view class="tip-item" v-if="currentTab === 'comparison'">
                    <text class="tip-text">💡 拖动中间分割线可以调整对比区域</text>
                </view>
                <view class="tip-item" v-if="currentTab === 'blend'">
                    <text class="tip-text">💡 调整透明度和混合模式获得最佳对比效果</text>
                </view>
                <view class="tip-close" @click="hideHelpTips">
                    <text>✕</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                statusBarHeight: 0,
                currentTab: 'original',
                originalImage: '',
                referenceImage: '',
                isLoading: false,
                loadingText: '处理中...',
                showScore: true,
                scoreText: '姿势匹配程度完美！',
                showHelpTips: false,
                showBlendInfo: true,
                showBlendControl: false,

                // Tab配置
                tabs: [{
                        key: 'original',
                        name: '原图'
                    },
                    {
                        key: 'comparison',
                        name: '对比展示'
                    },
                    {
                        key: 'blend',
                        name: '混合展示'
                    }
                ],

                // 图片缩放和位置
                imageScale: 1,
                imageTranslateX: 0,
                imageTranslateY: 0,

                // 对比展示相关
                splitPosition: 0, // 分割线位置
                splitOffset: 0, // 分割偏移
                isDraggingSplit: false,
                screenWidth: 375,
                leftImageScale: 1,
                leftImageTranslateX: 0,
                leftImageTranslateY: 0,
                rightImageScale: 1,
                rightImageTranslateX: 0,
                rightImageTranslateY: 0,

                // 混合展示相关
                blendOpacity: 0.5,
                currentBlendMode: 'normal',
                overlayTranslateX: 0,
                overlayTranslateY: 0,
                overlayScale: 1,

                blendModes: [{
                        name: '正常',
                        value: 'normal'
                    },
                    {
                        name: '叠加',
                        value: 'overlay'
                    },
                    {
                        name: '柔光',
                        value: 'soft-light'
                    },
                    {
                        name: '强光',
                        value: 'hard-light'
                    },
                    {
                        name: '相乘',
                        value: 'multiply'
                    },
                    {
                        name: '滤色',
                        value: 'screen'
                    },
                    {
                        name: '差值',
                        value: 'difference'
                    }
                ],

                // 触摸相关
                touchStartX: 0,
                touchStartY: 0,
                lastTouchTime: 0,
                touchStartDistance: 0,
                touchStartScale: 1
            }
        },

        computed: {
            imageStyle() {
                return {
                    transform: `scale(${this.imageScale}) translate(${this.imageTranslateX}px, ${this.imageTranslateY}px)`,
                    transition: 'transform 0.3s ease'
                }
            },

            leftSectionStyle() {
                const width = this.splitPosition;
                return {
                    width: `${width}px`,
                    clipPath: `inset(0 0 0 0)`
                }
            },

            rightSectionStyle() {
                const leftWidth = this.splitPosition;
                const rightWidth = this.screenWidth - leftWidth;
                return {
                    width: `${rightWidth}px`,
                    left: `${leftWidth}px`
                }
            },

            leftImageStyle() {
                return {
                    transform: `scale(${this.leftImageScale}) translate(${this.leftImageTranslateX}px, ${this.leftImageTranslateY}px)`
                }
            },

            rightImageStyle() {
                return {
                    transform: `scale(${this.rightImageScale}) translate(${this.rightImageTranslateX}px, ${this.rightImageTranslateY}px)`
                }
            },

            leftLabelOpacity() {
                return Math.max(0.3, (this.screenWidth - this.splitPosition) / this.screenWidth);
            },

            rightLabelOpacity() {
                return Math.max(0.3, this.splitPosition / this.screenWidth);
            },

            baseImageStyle() {
                return {
                    transform: `scale(1) translate(0px, 0px)`
                }
            },

            overlayImageStyle() {
                return {
                    opacity: this.blendOpacity,
                    mixBlendMode: this.currentBlendMode,
                    transform: `scale(${this.overlayScale}) translate(${this.overlayTranslateX}px, ${this.overlayTranslateY}px)`
                }
            }
        },

        onLoad(options) {
            this.initPage(options);
        },

        onReady() {
            this.getSystemInfo();
            this.initSplitPosition();
            this.showInitialTips();
        },

        methods: {
            // 页面初始化
            initPage(options) {
                this.originalImage = options.originalImage || '/static/girl-pose-02.png';
                this.referenceImage = options.referenceImage || '/static/girl-pose-03.png';
                this.currentTab = options.tab || 'original';
            },

            // 获取系统信息
            getSystemInfo() {
                const systemInfo = uni.getSystemInfoSync();
                this.statusBarHeight = systemInfo.statusBarHeight;
                this.screenWidth = systemInfo.screenWidth;
            },

            // 初始化分割位置
            initSplitPosition() {
                this.splitPosition = this.screenWidth / 2;
            },

            // 显示初始提示
            showInitialTips() {
                if (this.currentTab !== 'original') {
                    this.showHelpTips = true;
                    setTimeout(() => {
                        this.showHelpTips = false;
                    }, 3000);
                }
            },

            // 切换Tab
            switchTab(tabKey) {
                if (this.currentTab !== tabKey) {
                    this.currentTab = tabKey;
                    this.resetImageStates();

                    // 显示对应的帮助提示
                    if (tabKey !== 'original') {
                        this.showHelpTips = true;
                        setTimeout(() => {
                            this.showHelpTips = false;
                        }, 2000);
                    }

                    // 震动反馈
                    uni.vibrateShort({
                        type: 'light'
                    });
                }
            },

            // 重置图片状态
            resetImageStates() {
                this.imageScale = 1;
                this.imageTranslateX = 0;
                this.imageTranslateY = 0;
                this.leftImageScale = 1;
                this.leftImageTranslateX = 0;
                this.leftImageTranslateY = 0;
                this.rightImageScale = 1;
                this.rightImageTranslateX = 0;
                this.rightImageTranslateY = 0;
                this.showBlendControl = false;
            },

            // 图片点击事件
            onImageClick() {
                this.showScore = !this.showScore;
            },

            // 普通图片触摸事件
            onTouchStart(e) {
                const touches = e.touches;
                this.touchStartX = touches[0].clientX;
                this.touchStartY = touches[0].clientY;

                if (touches.length === 2) {
                    this.touchStartDistance = this.getTouchDistance(touches);
                    this.touchStartScale = this.imageScale;
                }

                // 双击检测
                const currentTime = Date.now();
                if (currentTime - this.lastTouchTime < 300) {
                    this.onDoubleClick();
                }
                this.lastTouchTime = currentTime;
            },

            onTouchMove(e) {
                const touches = e.touches;

                if (touches.length === 2) {
                    // 双指缩放
                    const distance = this.getTouchDistance(touches);
                    const scale = (distance / this.touchStartDistance) * this.touchStartScale;
                    this.imageScale = Math.max(0.5, Math.min(3, scale));
                } else if (touches.length === 1 && this.imageScale > 1) {
                    // 单指拖拽
                    const deltaX = touches[0].clientX - this.touchStartX;
                    const deltaY = touches[0].clientY - this.touchStartY;
                    this.imageTranslateX += deltaX * 0.5;
                    this.imageTranslateY += deltaY * 0.5;
                    this.touchStartX = touches[0].clientX;
                    this.touchStartY = touches[0].clientY;
                }
            },

            onTouchEnd(e) {
                // 触摸结束处理
            },

            // 分割图片触摸事件
            onImageTouchStart(e, side) {
                const touches = e.touches;
                this.touchStartX = touches[0].clientX;
                this.touchStartY = touches[0].clientY;

                if (touches.length === 2) {
                    this.touchStartDistance = this.getTouchDistance(touches);
                    this.touchStartScale = side === 'left' ? this.leftImageScale : this.rightImageScale;
                }
            },

            onImageTouchMove(e, side) {
                const touches = e.touches;

                if (touches.length === 2) {
                    // 双指缩放
                    const distance = this.getTouchDistance(touches);
                    const scale = (distance / this.touchStartDistance) * this.touchStartScale;
                    const clampedScale = Math.max(0.5, Math.min(3, scale));

                    if (side === 'left') {
                        this.leftImageScale = clampedScale;
                    } else {
                        this.rightImageScale = clampedScale;
                    }
                } else if (touches.length === 1) {
                    // 单指拖拽
                    const currentScale = side === 'left' ? this.leftImageScale : this.rightImageScale;
                    if (currentScale > 1) {
                        const deltaX = touches[0].clientX - this.touchStartX;
                        const deltaY = touches[0].clientY - this.touchStartY;

                        if (side === 'left') {
                            this.leftImageTranslateX += deltaX * 0.5;
                            this.leftImageTranslateY += deltaY * 0.5;
                        } else {
                            this.rightImageTranslateX += deltaX * 0.5;
                            this.rightImageTranslateY += deltaY * 0.5;
                        }

                        this.touchStartX = touches[0].clientX;
                        this.touchStartY = touches[0].clientY;
                    }
                }
            },

            onImageTouchEnd(e, side) {
                // 触摸结束处理
            },

            // 分割线拖拽事件
            onSplitTouchStart(e) {
                this.isDraggingSplit = true;
                this.touchStartX = e.touches[0].clientX;

                // 触觉反馈
                uni.vibrateShort({
                    type: 'light'
                });
            },

            onSplitTouchMove(e) {
                if (!this.isDraggingSplit) return;

                const deltaX = e.touches[0].clientX - this.touchStartX;
                let newPosition = this.splitPosition + deltaX;

                // 限制分割线位置
                const minPosition = 50;
                const maxPosition = this.screenWidth - 50;
                newPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));

                this.splitPosition = newPosition;
                this.touchStartX = e.touches[0].clientX;
            },

            onSplitTouchEnd(e) {
                this.isDraggingSplit = false;

                // 触觉反馈
                uni.vibrateShort({
                    type: 'light'
                });
            },

            // 透明度调整
            onOpacityChange(e) {
                this.blendOpacity = e.detail.value / 100;
            },

            // 设置混合模式
            setBlendMode(mode) {
                this.currentBlendMode = mode;

                // 触觉反馈
                uni.vibrateShort({
                    type: 'light'
                });
            },

            // 位置调整
            adjustPosition(direction) {
                const step = 10;

                switch (direction) {
                    case 'left':
                        this.overlayTranslateX -= step;
                        break;
                    case 'right':
                        this.overlayTranslateX += step;
                        break;
                    case 'up':
                        this.overlayTranslateY -= step;
                        break;
                    case 'down':
                        this.overlayTranslateY += step;
                        break;
                }

                // 触觉反馈
                uni.vibrateShort({
                    type: 'light'
                });
            },

            // 重置位置
            resetPosition() {
                this.overlayTranslateX = 0;
                this.overlayTranslateY = 0;
                this.overlayScale = 1;
                this.blendOpacity = 0.5;
                this.currentBlendMode = 'normal';

                // 触觉反馈
                uni.vibrateShort({
                    type: 'medium'
                });
            },

            // 计算匹配分数
            calculateMatchScore() {
                // 根据透明度、位置等计算一个模拟的匹配分数
                const opacityScore = Math.abs(this.blendOpacity - 0.5) * 200;
                const positionScore = Math.abs(this.overlayTranslateX) + Math.abs(this.overlayTranslateY);
                const baseScore = 95;

                return Math.max(60, Math.min(100, baseScore - opacityScore - positionScore * 0.1));
            },

            // 双击事件
            onDoubleClick() {
                if (this.imageScale === 1) {
                    this.imageScale = 2;
                } else {
                    this.imageScale = 1;
                    this.imageTranslateX = 0;
                    this.imageTranslateY = 0;
                }
            },

            // 获取触摸距离
            getTouchDistance(touches) {
                const dx = touches[0].clientX - touches[1].clientX;
                const dy = touches[0].clientY - touches[1].clientY;
                return Math.sqrt(dx * dx + dy * dy);
            },

            // 隐藏帮助提示
            hideHelpTips() {
                this.showHelpTips = false;
            },

            // 切换设置
            toggleSettings() {
                // 实现设置功能
                console.log('打开设置');
            },

            // 操作方法
            goBack() {
                uni.navigateBack();
            },

            retakePhoto() {
                uni.navigateBack();
            },

            async savePhoto() {
                this.isLoading = true;
                this.loadingText = '保存中...';

                try {
                    let imagePath = this.originalImage;

                    // 根据当前Tab保存不同的图片
                    if (this.currentTab === 'comparison') {
                        imagePath = await this.generateComparisonImage();
                    } else if (this.currentTab === 'blend') {
                        imagePath = await this.generateBlendImage();
                    }

                    await uni.saveImageToPhotosAlbum({
                        filePath: imagePath
                    });

                    uni.showToast({
                        title: '保存成功',
                        icon: 'success'
                    });
                } catch (error) {
                    uni.showToast({
                        title: '保存失败',
                        icon: 'error'
                    });
                } finally {
                    this.isLoading = false;
                }
            },

            sharePhoto() {
                // 实现分享功能
                uni.showActionSheet({
                    itemList: ['微信好友', '朋友圈', '微博', '保存到相册'],
                    success: (res) => {
                        console.log('选择了：', res.tapIndex);
                    }
                });
            },

            // 生成对比图片
            async generateComparisonImage() {
                // 使用canvas生成对比图片
                return new Promise((resolve) => {
                    const canvas = uni.createCanvasContext('comparisonCanvas');
                    // 绘制对比图片逻辑
                    canvas.draw(false, () => {
                        uni.canvasToTempFilePath({
                            canvasId: 'comparisonCanvas',
                            success: (res) => {
                                resolve(res.tempFilePath);
                            }
                        });
                    });
                });
            },

            // 生成混合图片
            async generateBlendImage() {
                // 使用canvas生成混合图片
                return new Promise((resolve) => {
                    const canvas = uni.createCanvasContext('blendCanvas');
                    // 绘制混合图片逻辑
                    canvas.draw(false, () => {
                        uni.canvasToTempFilePath({
                            canvasId: 'blendCanvas',
                            success: (res) => {
                                resolve(res.tempFilePath);
                            }
                        });
                    });
                });
            },

            togglePhotoSetting() {
                this.showBlendControl = !this.showBlendControl;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .photo-comparison {
        width: 100vw;
        height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .status-bar {
            background: #000;
        }

        .header {
            height: 100rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 30rpx;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10rpx);

            .nav-left {
                .back-btn {
                    width: 60rpx;
                    height: 60rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 30rpx;
                    background: rgba(255, 255, 255, 0.2);

                    .back-icon {
                        color: white;
                        font-size: 48rpx;
                        font-weight: bold;
                    }
                }
            }

            .nav-right {
                .compare-btn {
                    display: flex;
                    align-items: center;
                    padding: 15rpx 25rpx;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 30rpx;
                    backdrop-filter: blur(10rpx);

                    .compare-icon {
                        margin-right: 10rpx;
                        font-size: 28rpx;
                    }

                    .compare-text {
                        color: white;
                        font-size: 28rpx;
                    }
                }
            }
        }

        .tab-navigation {
            height: 100rpx;
            display: flex;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10rpx);

            .tab-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s ease;

                .tab-text {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 28rpx;
                    transition: color 0.3s ease;
                }

                .tab-indicator {
                    position: absolute;
                    bottom: 0;
                    left: 20%;
                    right: 20%;
                    height: 4rpx;
                    background: #00D4FF;
                    border-radius: 2rpx;
                }

                &.active {
                    .tab-text {
                        color: white;
                        font-weight: 500;
                    }
                }
            }
        }

        .image-display-area {
            flex: 1;
            position: relative;
            overflow: hidden;
        }

        // 原图展示
        .original-display {
            width: 100%;
            height: 100%;

            .image-container {
                width: 100%;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;

                .main-image {
                    width: 100%;
                    height: 100%;
                    transition: transform 0.3s ease;
                }

                .score-overlay {
                    position: absolute;
                    bottom: 80rpx;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10rpx);
                    border-radius: 30rpx;
                    padding: 20rpx 40rpx;
                    transition: opacity 0.3s ease;

                    .score-content {
                        .score-text {
                            color: #FFD700;
                            font-size: 32rpx;
                            font-weight: bold;
                            text-align: center;
                        }
                    }
                }
            }
        }

        // 对比展示
        .comparison-display {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;

            .split-container {
                width: 100%;
                height: 100%;
                position: relative;
                transition: transform 0.1s ease-out;

                .split-section {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    overflow: hidden;

                    .split-image {
                        width: 100vw;
                        height: 100%;
                        object-fit: cover;
                    }

                    .image-label {
                        position: absolute;
                        bottom: 20rpx;
                        left: 20rpx;
                        right: 20rpx;
                        text-align: center;

                        text {
                            color: white;
                            font-size: 24rpx;
                            background: rgba(0, 0, 0, 0.5);
                            padding: 10rpx 20rpx;
                            border-radius: 15rpx;
                            backdrop-filter: blur(5rpx);
                        }
                    }

                    &.left-section {
                        left: 0;

                        .split-image {
                            object-position: left center;
                        }
                    }

                    &.right-section {
                        right: 0;

                        .split-image {
                            object-position: right center;
                            margin-left: calc(-100vw + 100%);
                        }
                    }
                }
            }

            .split-line {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 6rpx;
                background: rgba(255, 255, 255, 0.8);
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;

                &:active {
                    cursor: grabbing;
                }

                .split-handle {
                    width: 60rpx;
                    height: 60rpx;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 30rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10rpx);

                    .handle-icon {
                        color: #333;
                        font-size: 32rpx;
                        font-weight: bold;
                    }
                }
            }

            .comparison-labels {
                position: absolute;
                top: 40rpx;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                padding: 0 40rpx;
                pointer-events: none;

                .label-left,
                .label-right {
                    color: white;
                    font-size: 28rpx;
                    font-weight: bold;
                    background: rgba(0, 0, 0, 0.6);
                    padding: 15rpx 25rpx;
                    border-radius: 20rpx;
                    backdrop-filter: blur(10rpx);
                    transition: opacity 0.3s ease;
                }
            }
        }

        // 混合展示
        .blend-display {
            width: 100%;
            height: 100%;
            position: relative;

            .blend-container {
                width: 100%;
                height: 100%;
                position: relative;

                .blend-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;

                    &.base-image {
                        z-index: 1;
                    }

                    &.overlay-image {
                        z-index: 2;
                        transition: all 0.2s ease;
                    }
                }

                .blend-controls {
                    position: absolute;
                    bottom: 20rpx;
                    left: 20rpx;
                    right: 20rpx;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(15rpx);
                    border-radius: 25rpx;
                    padding: 30rpx;
                    z-index: 10;

                    .control-item {
                        margin-bottom: 30rpx;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .control-label {
                            color: white;
                            font-size: 26rpx;
                            display: block;
                            margin-bottom: 15rpx;
                        }

                        .blend-slider {
                            width: 100%;
                            margin-bottom: 10rpx;
                        }

                        .control-value {
                            color: #00D4FF;
                            font-size: 24rpx;
                            float: right;
                        }

                        .blend-modes {
                            white-space: nowrap;

                            .blend-mode-item {
                                display: inline-block;
                                padding: 15rpx 25rpx;
                                margin-right: 15rpx;
                                background: rgba(255, 255, 255, 0.1);
                                border-radius: 20rpx;
                                border: 2rpx solid transparent;
                                transition: all 0.3s ease;

                                .mode-name {
                                    color: white;
                                    font-size: 24rpx;
                                }

                                &.active {
                                    background: rgba(0, 212, 255, 0.3);
                                    border-color: #00D4FF;

                                    .mode-name {
                                        color: #00D4FF;
                                    }
                                }
                            }
                        }

                        .position-controls {
                            display: flex;
                            justify-content: center;
                            gap: 15rpx;

                            .pos-btn {
                                width: 60rpx;
                                height: 60rpx;
                                background: rgba(255, 255, 255, 0.2);
                                border: none;
                                border-radius: 30rpx;
                                color: white;
                                font-size: 24rpx;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.3s ease;

                                &:active {
                                    background: rgba(255, 255, 255, 0.3);
                                    transform: scale(0.9);
                                }

                                &.reset {
                                    width: 100rpx;
                                    font-size: 22rpx;
                                    background: rgba(255, 69, 0, 0.6);
                                }
                            }
                        }
                    }
                }

                .blend-info {
                    position: absolute;
                    top: 40rpx;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10rpx);
                    border-radius: 25rpx;
                    padding: 20rpx 30rpx;
                    text-align: center;
                    z-index: 5;

                    .info-text {
                        color: #00D4FF;
                        font-size: 28rpx;
                        font-weight: bold;
                        display: block;
                        margin-bottom: 5rpx;
                    }

                    .info-tip {
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 22rpx;
                    }
                }
            }
        }

        .bottom-actions {
            height: 180rpx;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 30rpx 60rpx;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(15rpx);

            .action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                transition: transform 0.2s ease;

                &:active {
                    transform: scale(0.9);
                }

                .btn-icon {
                    width: 80rpx;
                    height: 80rpx;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 40rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 15rpx;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10rpx);

                    .icon {
                        font-size: 36rpx;
                    }

                    &:active {
                        background: rgba(255, 255, 255, 0.25);
                    }

                    .btn-icon-img {
                        width: 40rpx;
                        height: 40rpx;
                    }
                }

                .btn-text {
                    color: white;
                    font-size: 24rpx;
                }
            }
        }

        .bottom-indicator {
            height: 8rpx;
            width: 200rpx;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4rpx;
            align-self: center;
            margin: 20rpx 0;
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;

            .loading-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 60rpx;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 30rpx;
                backdrop-filter: blur(15rpx);

                .loading-spinner {
                    width: 60rpx;
                    height: 60rpx;
                    border: 4rpx solid #f3f3f3;
                    border-top: 4rpx solid #00D4FF;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 30rpx;
                }

                .loading-text {
                    color: #333;
                    font-size: 28rpx;
                }
            }
        }

        .help-tips {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;

            .tip-content {
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(15rpx);
                border-radius: 25rpx;
                padding: 40rpx;
                max-width: 600rpx;
                position: relative;

                .tip-item {
                    margin-bottom: 20rpx;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .tip-text {
                        color: white;
                        font-size: 26rpx;
                        line-height: 1.5;
                    }
                }

                .tip-close {
                    position: absolute;
                    top: 15rpx;
                    right: 20rpx;
                    width: 40rpx;
                    height: 40rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 28rpx;
                }
            }
        }
    }

    // 动画效果
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    // 响应式适配
    @media screen and (orientation: landscape) {
        .photo-comparison {
            .tab-navigation {
                height: 80rpx;

                .tab-item {
                    .tab-text {
                        font-size: 24rpx;
                    }
                }
            }

            .blend-display {
                .blend-container {
                    .blend-controls {
                        bottom: 10rpx;
                        left: 10rpx;
                        right: 10rpx;
                        padding: 20rpx;

                        .control-item {
                            margin-bottom: 20rpx;

                            .control-label {
                                font-size: 22rpx;
                                margin-bottom: 10rpx;
                            }
                        }
                    }
                }
            }

            .bottom-actions {
                height: 120rpx;
                padding: 20rpx 40rpx;

                .action-btn {
                    .btn-icon {
                        width: 60rpx;
                        height: 60rpx;
                        margin-bottom: 10rpx;

                        .icon {
                            font-size: 28rpx;
                        }
                    }

                    .btn-text {
                        font-size: 20rpx;
                    }
                }
            }
        }
    }

    // 暗色主题适配
    @media (prefers-color-scheme: dark) {
        .photo-comparison {
            .help-tips {
                .tip-content {
                    background: rgba(28, 28, 30, 0.95);
                }
            }
        }
    }

    // 触摸反馈增强
    .photo-comparison {
        view {
            -webkit-tap-highlight-color: transparent;
        }

        .tab-item:active {
            background: rgba(255, 255, 255, 0.1);
        }

        .blend-mode-item:active {
            transform: scale(0.95);
        }

        .split-handle:active {
            transform: scale(1.1);
        }
    }
</style>