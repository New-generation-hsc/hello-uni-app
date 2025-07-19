<template>
    <view class="camera-page">
        <!-- 相机组件（全屏） -->
        <camera class="camera" :device-position="cameraPosition" :flash="flash" v-if="showCamera">
            <!-- 倒计时 -->
            <cover-view class="countdown" v-if="countdown > 0">
                <cover-view class="countdown-number">{{ countdown }}</cover-view>
            </cover-view>
        </camera>

        <!-- 姿势参考图（居中，半透明） -->
        <image src="/static/girl-pose-01.png" class="pose-reference" :style="{ opacity: 0.5 }" />

        <!-- 自定义顶部导航栏 -->
        <view class="custom-navbar">
            <!-- 返回按钮 -->
            <view class="nav-left" @click="goBack">
                <image src="/static/arrow_left.png" class="nav-icon" />
            </view>
        </view>

        <!-- 固定在底部的操作栏 -->
        <view class="fixed-action-bar">
            <!-- 姿势选择提示框 -->
            <view class="pose-tip" v-if="showPoseTip" :class="{ 'fade-out': isTipFading }" @click="hidePoseTip">
                <view class="tip-content">
                    <text class="tip-icon">👇</text>
                    <text class="tip-text">调整参数</text>
                </view>
                <view class="tip-arrow"></view>
            </view>
            <view class="action-items">
                <!-- 左侧：相册预览 -->
                <view class="action-item album-preview" @click="showSettings">
                    <image src="/static/girl-pose-01.png" class="preview-image" />
                </view>

                <!-- 中央：拍照按钮 -->
                <view class="action-item shutter-container" @click="takePhoto">
                    <view class="shutter-button">
                        <view class="shutter-circle">
                            <view class="loading" v-if="isCapturing"></view>
                        </view>
                    </view>
                </view>

                <!-- 右侧：切换摄像头 -->
                <view class="action-item switch-camera" @click="switchCamera">
                    <image src="/static/switch_camera.png" class="switch-icon" />
                </view>
            </view>
        </view>
    </view>

    <!-- 设置弹窗 -->
    <view class="settings-modal" v-if="showSettingsModal" @click="closeSettings">
        <view class="settings-content" @click.stop>
            <view class="settings-header">
                <text class="settings-title">拍照设置</text>
                <text class="close-btn" @click="closeSettings">✕</text>
            </view>

            <!-- 修改这里：给 scroll-view 添加明确的样式类 -->
            <scroll-view class="settings-body" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
                <!-- 透明度设置 -->
                <view class="setting-item">
                    <view class="setting-label">
                        <text class="label-text">参考图透明度</text>
                        <text class="label-value">{{ Math.round(settings.opacity * 100) }}%</text>
                    </view>
                    <view class="slider-container">
                        <slider class="opacity-slider" :value="settings.opacity * 100" min="10" max="90" step="5"
                            activeColor="#007AFF" backgroundColor="#E5E5E5" block-size="20" @changing="onOpacityChange"
                            @change="onOpacityChange" />
                    </view>
                </view>

                <!-- 倒计时设置 -->
                <view class="setting-item">
                    <view class="setting-label">
                        <text class="label-text">倒计时时长</text>
                        <text class="label-value">{{ settings.countdownDuration }}秒</text>
                    </view>
                    <view class="countdown-options">
                        <view class="countdown-option" v-for="duration in countdownOptions" :key="duration"
                            :class="{ active: settings.countdownDuration === duration }"
                            @click="setCountdownDuration(duration)">
                            {{ duration }}秒
                        </view>
                    </view>
                </view>

                <!-- 显示模式设置 -->
                <view class="setting-item">
                    <view class="setting-label">
                        <text class="label-text">参考图显示模式</text>
                    </view>
                    <view class="display-modes">
                        <view class="display-mode" :class="{ active: settings.displayMode === 'background' }"
                            @click="setDisplayMode('background')">
                            <view class="mode-info">
                                <view class="mode-icon">🖼️</view>
                                <text class="mode-title">背景图模式</text>
                            </view>
                            <text class="mode-desc">固定在屏幕中央作为背景</text>
                        </view>

                        <view class="display-mode" :class="{ active: settings.displayMode === 'float' }"
                            @click="setDisplayMode('float')">
                            <view class="mode-info">
                                <view class="mode-icon">📱</view>
                                <text class="mode-title">浮窗模式</text>
                            </view>
                            <text class="mode-desc">可拖动调整位置的浮窗</text>
                        </view>
                    </view>
                </view>

                <!-- 其他设置 -->
                <view class="setting-item">
                    <view class="setting-label">
                        <text class="label-text">其他选项</text>
                    </view>
                    <view class="switch-options">
                        <view class="switch-option">
                            <text class="switch-label">震动反馈</text>
                            <switch :checked="settings.vibration" color="#007AFF" @change="onVibrationChange" />
                        </view>
                        <view class="switch-option">
                            <text class="switch-label">快门音效</text>
                            <switch :checked="settings.shutterSound" color="#007AFF" @change="onShutterSoundChange" />
                        </view>
                        <view class="switch-option">
                            <text class="switch-label">网格辅助线</text>
                            <switch :checked="settings.showGrid" color="#007AFF" @change="onGridChange" />
                        </view>
                    </view>
                </view>

                <view class="setting-item">
                    <view class="settings-footer">
                        <view class="reset-btn" @click="resetSettings">
                            <text>恢复默认</text>
                        </view>
                        <view class="save-btn" @click="saveSettings"><text>保存设置</text></view>
                    </view>
                </view>

                <!-- 添加底部间距，确保最后一项可以完全显示 -->
                <view class="scroll-bottom-padding"></view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                showCamera: true,
                cameraPosition: 'back',
                flash: 'off',
                isCapturing: false,
                countdown: 0,
                showPoseTip: false, // 控制提示框显示
                isTipFading: false, // 控制淡出动画
                tipTimer: null, // 提示框定时器,
                showSettingsModal: false,
                scrollTop: 0,

                // 设置相关
                settings: {
                    opacity: 0.3, // 透明度
                    countdownDuration: 3, // 倒计时时长（秒）
                    displayMode: 'background', // 显示模式: 'background' | 'float'
                    vibration: true, // 震动反馈
                    shutterSound: true, // 快门音效
                    autoCapture: false, // 自动拍照
                    // 新增设置项
                    saveOriginal: true,
                    addWatermark: false,
                    showGrid: false,
                    imageQuality: 'high'
                },

                // 倒计时选项
                countdownOptions: [0, 1, 3, 5, 10],

                // 浮窗拖拽相关
                floatPosition: {
                    x: 50,
                    y: 200
                },
                isDragging: false,
                dragStartPos: {
                    x: 0,
                    y: 0
                },
                // 图片质量选项
                imageQualityOptions: [{
                        value: 'low',
                        label: '低质量',
                        desc: '文件小，适合分享'
                    },
                    {
                        value: 'normal',
                        label: '标准质量',
                        desc: '平衡文件大小和质量'
                    },
                    {
                        value: 'high',
                        label: '高质量',
                        desc: '文件大，质量最佳'
                    }
                ],
            }
        },
        // 添加 onReady 生命周期
        onReady() {
            // 页面渲染完成后显示提示
            this.showPoseSelectionTip();
        },

        // 在 onHide 中清理定时器
        onHide() {
            this.clearTipTimer();
        },

        // 在 onUnload 中清理定时器
        onUnload() {
            this.clearTipTimer();
        },
        methods: {
            switchCamera() {
                this.cameraPosition = this.cameraPosition === 'back' ? 'front' : 'back';
            },
            takePhoto() {
                // 拍照逻辑
                if (this.isCapturing) return;
                this.isCapturing = true;
                this.startCountdown();
            },
            goBack() {
                uni.navigateBack();
            },
            // 倒计时
            startCountdown() {
                this.countdown = 3;
                const timer = setInterval(() => {
                    this.countdown--;

                    if (this.countdown <= 0) {
                        // 震动反馈
                        uni.vibrateShort();
                        clearInterval(timer);
                        this.capturePhoto();
                    }
                }, 1000);
            },
            // 执行拍照
            capturePhoto() {
                const ctx = uni.createCameraContext();

                ctx.takePhoto({
                    quality: 'high',
                    success: (res) => {
                        this.capturedImage = res.tempImagePath;
                        this.isCapturing = false;

                        // 播放拍照音效
                        this.playShutterSound();
                    },
                    fail: (err) => {
                        console.log('拍照失败:', err);
                        this.isCapturing = false;
                        uni.showToast({
                            title: '拍照失败',
                            icon: 'none'
                        });
                    }
                });
            },

            // 播放快门音效
            playShutterSound() {
                const audioContext = uni.createInnerAudioContext();
                audioContext.src = '/static/audio/shutter.mp3';
                audioContext.play();
            },

            // 显示姿势选择提示
            showPoseSelectionTip() {
                // 延迟500ms显示，确保页面完全加载
                setTimeout(() => {
                    this.showPoseTip = true;

                    // 2秒后开始淡出动画
                    this.tipTimer = setTimeout(() => {
                        this.startTipFadeOut();
                    }, 2000);
                }, 500);
            },

            // 开始淡出动画
            startTipFadeOut() {
                this.isTipFading = true;

                // 动画完成后隐藏提示框
                setTimeout(() => {
                    this.showPoseTip = false;
                    this.isTipFading = false;
                }, 300); // 300ms 动画时间
            },

            // 清理定时器
            clearTipTimer() {
                if (this.tipTimer) {
                    clearTimeout(this.tipTimer);
                    this.tipTimer = null;
                }
            },

            // 手动隐藏提示框（可选，用户点击提示框时）
            hidePoseTip() {
                this.clearTipTimer();
                this.startTipFadeOut();
            },

            // 设置相关方法
            showSettings() {
                this.hidePoseTip();
                this.showSettingsModal = true;
            },

            closeSettings() {
                this.showSettingsModal = false;
            },

            // 透明度调整
            onOpacityChange(e) {
                this.settings.opacity = e.detail.value / 100;
            },

            // 倒计时时长设置
            setCountdownDuration(duration) {
                this.settings.countdownDuration = duration;
            },

            // 显示模式设置
            setDisplayMode(mode) {
                this.settings.displayMode = mode;
                if (mode === 'float') {
                    this.initFloatPosition();
                }
            },

            // 开关设置
            onVibrationChange(e) {
                this.settings.vibration = e.detail.value;
            },

            onShutterSoundChange(e) {
                this.settings.shutterSound = e.detail.value;
            },

            onAutoCaptureChange(e) {
                this.settings.autoCapture = e.detail.value;
            },

            // 重置设置
            resetSettings() {
                uni.showModal({
                    title: '确认重置',
                    content: '是否恢复所有设置为默认值？',
                    success: (res) => {
                        if (res.confirm) {
                            this.settings = {
                                opacity: 0.3,
                                countdownDuration: 3,
                                displayMode: 'background',
                                vibration: true,
                                shutterSound: true,
                                autoCapture: false
                            };
                            uni.showToast({
                                title: '已恢复默认设置',
                                icon: 'success'
                            });
                        }
                    }
                });
            },

            // 保存设置
            saveSettings() {
                uni.showToast({
                    title: '设置已保存',
                    icon: 'success'
                });
                this.closeSettings();
            },

            // 浮窗拖拽相关方法
            initFloatPosition() {
                const systemInfo = uni.getSystemInfoSync();
                this.floatPosition = {
                    x: systemInfo.windowWidth - 200,
                    y: 200
                };
            },

            // 滚动事件
            onScroll(e) {
                this.scrollTop = e.detail.scrollTop;
            },

            // 新增的设置方法
            onSaveOriginalChange(e) {
                this.settings.saveOriginal = e.detail.value;
            },

            onWatermarkChange(e) {
                this.settings.addWatermark = e.detail.value;
            },

            onGridChange(e) {
                this.settings.showGrid = e.detail.value;
            },

            setImageQuality(quality) {
                this.settings.imageQuality = quality;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .camera-page {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: #000;
    }

    .camera {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .countdown {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .countdown-number {
            color: white;
            font-size: 120rpx;
            font-weight: bold;
            text-shadow: 0 0 20rpx rgba(0, 0, 0, 0.8);
            animation: countdownPulse 1s ease-in-out;
        }
    }

    @keyframes countdownPulse {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }

        50% {
            transform: scale(1.2);
            opacity: 1;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .pose-reference {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 70%;
        z-index: 2;
    }

    .custom-navbar {
        position: absolute;
        top: var(--status-bar-height);
        left: 0;
        right: 0;
        height: 90rpx;
        /* 自定义导航栏高度 */
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10rpx;
        z-index: 3;
    }

    .nav-left,
    .nav-right {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 50rpx;
    }

    .nav-icon {
        width: 40rpx;
        height: 40rpx;
    }

    /* 固定在底部的操作栏 */
    .fixed-action-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        width: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        border-top: 1rpx solid rgba(255, 255, 255, 0.1);
        padding: 40rpx 0;
    }

    // 姿势选择提示框
    .pose-tip {
        position: absolute;
        bottom: 150rpx;
        left: 80rpx;
        z-index: 200;
        animation: tipFadeIn 0.3s ease-out;

        &.fade-out {
            animation: tipFadeOut 0.3s ease-out;
        }

        .tip-content {
            background: white;
            color: black;
            padding: 10rpx 15rpx;
            border-radius: 10rpx;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            gap: 10rpx;
            backdrop-filter: blur(10rpx);
            border: 1rpx solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);

            .tip-icon {
                font-size: 24rpx;
                animation: pointDown 1s ease-in-out infinite;
            }

            .tip-text {
                white-space: nowrap;
            }
        }

        // 箭头指向姿势预览
        .tip-arrow {
            width: 0;
            height: 0;
            border-left: 15rpx solid transparent;
            border-right: 15rpx solid transparent;
            border-top: 20rpx solid rgba(0, 0, 0, 0.8);
            margin: 0 auto;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: -22rpx;
                left: -16rpx;
                width: 0;
                height: 0;
                border-left: 16rpx solid transparent;
                border-right: 16rpx solid transparent;
                border-top: 22rpx solid rgba(255, 255, 255, 1);
            }
        }
    }

    // 提示框动画
    @keyframes tipFadeIn {
        0% {
            opacity: 0;
            transform: translateY(20rpx);
        }

        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes tipFadeOut {
        0% {
            opacity: 1;
            transform: translateY(0);
        }

        100% {
            opacity: 0;
            transform: translateY(-20rpx);
        }
    }

    // 手指指向动画
    @keyframes pointDown {
        0% {
            transform: translateY(-5px);
        }

        50% {
            transform: translateY(5rpx);
        }

        100% {
            transform: translateY(-5px);
        }
    }

    /* 操作项容器 */
    .action-items {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 60rpx;
        gap: 70rpx;
    }

    /* 每个操作项的通用样式 */
    .action-item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100rpx;
    }

    /* 相册预览 */
    .album-preview {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        overflow: hidden;
        border: 3rpx solid rgba(255, 255, 255, 0.8);

        .preview-image {
            width: 100%;
            height: 100%;
        }
    }

    /* 拍照按钮容器 */
    .shutter-container {
        flex: 1;
        max-width: 200rpx;
    }

    /* 拍照按钮 */
    .shutter-button {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
    }

    .shutter-circle {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: #ffffff;
        border: 4rpx solid rgba(255, 255, 255, 0.6);
        transition: all 0.1s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        .shutter-button:active & {
            transform: scale(0.95);
            opacity: 0.8;
        }

        .loading {
            width: 40rpx;
            height: 40rpx;
            border: 4rpx solid #ccc;
            border-top: 4rpx solid #333;
            border-radius: 50%;
            animation: spin 1s linear infinite;
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

    /* 切换摄像头按钮 */
    .switch-camera {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
    }

    .switch-icon {
        width: 40rpx;
        height: 40rpx;
        filter: brightness(200%);
    }

    // 设置弹窗样式修改
    .settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        align-items: flex-end;
        animation: modalFadeIn 0.3s ease-out;

        .settings-content {
            background: white;
            border-radius: 40rpx 40rpx 0 0;
            width: 100%;
            /* 修改：使用具体的高度而不是max-height */
            height: 80vh;
            display: flex;
            flex-direction: column;
            animation: modalSlideUp 0.3s ease-out;
            /* 确保不会超出屏幕 */
            overflow: hidden;

            .settings-header {
                /* 固定高度 */
                height: 120rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 30rpx;
                border-bottom: 1rpx solid #f0f0f0;
                /* 防止收缩 */
                flex-shrink: 0;

                .settings-title {
                    font-size: 36rpx;
                    font-weight: bold;
                    color: #333;
                }

                .close-btn {
                    font-size: 40rpx;
                    color: #999;
                    padding: 10rpx;
                    width: 60rpx;
                    height: 60rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            .settings-body {
                /* 关键修改：明确设置高度和滚动属性 */
                flex: 1;
                height: 0;
                /* 重要：让 flex 子元素正确计算高度 */
                padding: 0;
                /* 确保滚动区域的样式 */
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                /* iOS 平滑滚动 */

                .setting-item {
                    padding: 40rpx 30rpx;
                    border-bottom: 1rpx solid #f5f5f5;

                    &:last-child {
                        border-bottom: none;
                    }

                    .setting-label {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 30rpx;

                        .label-text {
                            font-size: 32rpx;
                            color: #333;
                            font-weight: 500;
                        }

                        .label-value {
                            font-size: 28rpx;
                            color: #007AFF;
                            font-weight: bold;
                        }
                    }

                    // 滑块容器
                    .slider-container {
                        padding: 3rpx 0;

                        .opacity-slider {
                            width: 90%;
                        }
                    }

                    // 倒计时选项
                    .countdown-options {
                        display: flex;
                        gap: 20rpx;
                        justify-content: space-between;

                        .countdown-option {
                            padding: 10rpx 30rpx;
                            background: #f8f9fa;
                            border-radius: 15rpx;
                            font-size: 28rpx;
                            color: #666;
                            border: 2rpx solid transparent;
                            transition: all 0.3s ease;

                            &.active {
                                background: #007AFF;
                                color: white;
                                border-color: #007AFF;
                            }

                            &:active {
                                transform: scale(0.95);
                            }
                        }
                    }

                    // 显示模式选项
                    .display-modes {
                        display: flex;
                        justify-content: space-between;
                        gap: 10rpx;

                        .display-mode {
                            display: flex;
                            flex-direction: column;
                            justify-content: start;
                            padding: 30rpx;
                            background: #f8f9fa;
                            border-radius: 20rpx;
                            margin-bottom: 20rpx;
                            border: 2rpx solid transparent;
                            transition: all 0.3s ease;

                            &.active {
                                background: #e3f2fd;
                                border-color: #007AFF;
                            }

                            &:active {
                                transform: scale(0.98);
                            }

                            .mode-icon {
                                font-size: 40rpx;
                                margin-right: 20rpx;
                            }

                            .mode-info {
                                flex: 1;
                                display: flex;
                                flex-direction: row;
                                align-items: baseline;

                                .mode-title {
                                    display: block;
                                    font-size: 28rpx;
                                    color: #333;
                                    font-weight: 500;
                                    margin-bottom: 10rpx;
                                }
                            }

                            .mode-desc {
                                font-size: 24rpx;
                                color: #666;
                                line-height: 1.4;
                            }
                        }
                    }

                    // 开关选项
                    .switch-options {
                        .switch-option {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 25rpx 0;

                            &:not(:last-child) {
                                border-bottom: 1rpx solid #f0f0f0;
                            }

                            .switch-label {
                                font-size: 30rpx;
                                color: #333;
                            }
                        }
                    }
                }
            }

            .settings-footer {
                /* 固定高度 */
                display: flex;
                gap: 20rpx;
                padding: 0 30rpx;
                /* 防止收缩 */
                flex-shrink: 0;
                background: white;
                text-align: center;

                .reset-btn,
                .save-btn {
                    flex: 1;
                    height: 80rpx;
                    border-radius: 40rpx;
                    font-size: 32rpx;
                    border: none;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:active {
                        transform: scale(0.98);
                    }
                }

                .reset-btn {
                    background: #f5f5f5;
                    color: #666;
                }

                .save-btn {
                    background: #007AFF;
                    color: white;
                }
            }
        }
    }

    /* 添加滚动条样式（仅在支持的浏览器中生效） */
    .settings-body::-webkit-scrollbar {
        width: 6rpx;
    }

    .settings-body::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3rpx;
    }

    .settings-body::-webkit-scrollbar-track {
        background-color: transparent;
    }

    // 底部填充空间
    .scroll-bottom-padding {
        height: 40rpx;
    }
</style>