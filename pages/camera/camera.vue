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
				<view class="action-item album-preview">
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
				tipTimer: null, // 提示框定时器
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
</style>