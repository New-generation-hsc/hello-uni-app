<template>
	<view class="task-container">
		<!-- 积分区域 -->
		<view class="points-card">
			<view class="points-top">
				<view class="points-text">
					<view class="points-header">
						<text class="points-label">当前积分</text>
					</view>
					<text class="points-value">{{ point.currentPoint }}</text>
				</view>
				<image src="/static/crown.png" class="crown-icon" />
			</view>

			<!-- 积分进度条 -->
			<view class="progress-container">
				<text class="level-info">距离下一等级还需{{ point.nextPoint }}积分</text>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: point.progressPercentage + '%' }"></view>
				</view>
			</view>
		</view>

		<!-- 任务分类标签 -->
		<view class="task-tabs">
			<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }"
				@click="switchTab(index)">
				<view class="tab-content" :class="`tab-${tab.type}`">
					{{ tab.label }}
				</view>
			</view>
		</view>

		<!-- 任务列表 -->
		<view class="task-list">
			<!-- 每日任务样式 -->
			<template v-if="activeTab === 0">
				<view v-for="(task, index) in dailyTasks" :key="index" class="task-item">
					<view class="task-left">
						<view class="daily-icon">
							<image src="/static/sun.png" class="task-type-icon" />
						</view>
					</view>
					<view class="task-info">
						<view class="task-header">
							<text class="task-name">{{ task.name }}</text>
						</view>
						<text class="task-desc">{{ task.description }}</text>
					</view>

					<view class="task-right">
						<text class="task-points">{{ task.points > 0 ? '+' : '' }}{{ task.points }}</text>
						<view class="task-action daily-action" :class="{ completed: task.completed }"
							@click="handleTaskAction(task)">
							{{ task.completed ? '已完成' : '去完成' }}
						</view>
					</view>
				</view>
			</template>

			<!-- 成长任务样式 -->
			<template v-if="activeTab === 1">
				<view class="progress-task-list">
					<view v-for="task in tasks" :key="task.id" class="progress-task-item">
						<view class="progress-task-info">
							<text class="progress-task-name">{{ task.name }}</text>
							<text class="progress-reward-amount">+{{ task.reward }}</text>
						</view>
						<view class="progress-section">
							<view class="progress-bar">
								<view class="progress-fill" :style="{ width: (task.completed/task.total)*100 + '%' }">
								</view>
							</view>
							<text class="progress-text">{{ task.completed }}/{{ task.total }}</text>
						</view>
					</view>
				</view>
			</template>

			<!-- 限时任务样式 -->
			<template v-if="activeTab === 2">
				<view v-for="(task, index) in timeLimitTasks" :key="index" class="task-item time-limit">
					<view class="task-info">
						<view class="task-header">
							<view class="time-icon">
								<image src="/static/clock.png" class="task-type-icon" />
							</view>
							<text class="task-name">{{ task.name }}</text>
							<text class="deadline">{{ task.deadline }}</text>
						</view>
						<text class="task-desc">{{ task.description }}</text>
					</view>

					<view class="task-right">
						<text class="task-points time-points">{{ task.points > 0 ? '+' : '' }}{{ task.points }}</text>
						<button class="task-action time-action" :class="{ completed: task.completed }"
							@click="handleTaskAction(task)">
							{{ task.completed ? '已完成' : '立即参与' }}
						</button>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				point: {
					progressPercentage: (2580 / 3000) * 100, // 根据积分计算进度百分比
					currentPoint: 2580,
					nextPoint: 420
				},
				activeTab: 0, // 默认选择每日任务
				tabs: [{
						id: 0,
						label: '每日任务',
						type: 'daily'
					},
					{
						id: 1,
						label: '成长任务',
						type: 'growth'
					},
					{
						id: 2,
						label: '限时任务',
						type: 'time-limit'
					}
				],
				// 每日任务数据
				dailyTasks: [{
						id: 1,
						name: '每日打卡',
						description: '完成今日拍照打卡',
						points: 10,
						completed: false,
						type: 'daily'
					},
					{
						id: 2,
						name: '分享作品',
						description: '分享一张你的作品到社交媒体',
						points: 20,
						completed: true,
						type: 'daily'
					},
					{
						id: 3,
						name: '浏览灵感',
						description: '浏览10张作品获取灵感',
						points: 15,
						completed: false,
						type: 'daily'
					}
				],
				// 成长任务数据
				growthTasks: [{
						id: 4,
						name: '连续签到',
						description: '连续签到7天解锁成就勋章',
						points: 50,
						completed: false,
						type: 'growth'
					},
					{
						id: 5,
						name: '解锁姿势',
						description: '掌握10种不同拍照姿势',
						points: 100,
						completed: false,
						type: 'growth'
					},
					{
						id: 6,
						name: '完美姿势',
						description: '获得5次10分评价的作品',
						points: 150,
						completed: false,
						type: 'growth'
					}
				],
				// 限时任务数据
				timeLimitTasks: [{
						id: 7,
						name: '夏日主题挑战',
						description: '拍摄夏日主题照片获得额外奖励',
						points: 100,
						deadline: '截止至2024/08/31',
						completed: false,
						type: 'time-limit'
					},
					{
						id: 8,
						name: '好友邀请赛',
						description: '邀请3位好友加入并获得奖励',
						points: 150,
						deadline: '截止至2024/07/15',
						completed: false,
						type: 'time-limit'
					},
					{
						id: 9,
						name: '节日限定任务',
						description: '创作中秋主题作品',
						points: 120,
						deadline: '截止至2024/09/10',
						completed: false,
						type: 'time-limit'
					}
				],
				tasks: [
					// 示例数据 - 实际应用中从API获取
					{
						id: 1,
						name: "连续打卡7天",
						completed: 5,
						total: 7,
						reward: 100
					},
					{
						id: 2,
						name: "收藏50个姿势",
						completed: 28,
						total: 50,
						reward: 200
					},
					// 可以添加更多任务
					{
						id: 3,
						name: "练习30个动作",
						completed: 18,
						total: 30,
						reward: 150
					},
					{
						id: 4,
						name: "累计训练20小时",
						completed: 8,
						total: 20,
						reward: 300
					}
				]
			}
		},
		methods: {
			// 切换任务标签
			switchTab(index) {
				this.activeTab = index;
			},
			// 处理任务操作
			handleTaskAction(task) {
				if (task.completed) return;

				task.completed = true;

				// 显示任务完成动画效果
				this.showTaskCompleteEffect(task);

				// 在实际应用中这里会更新积分
			},

			// 显示任务完成效果
			showTaskCompleteEffect(task) {
				const styleMap = {
					daily: 'daily-action',
					growth: 'growth-action',
					'time-limit': 'time-action'
				};

				uni.showToast({
					title: `任务完成！+${task.points}积分`,
					icon: 'success',
					duration: 1500
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 整体布局 */
	.task-container {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		min-height: 100vh;
		padding-bottom: 120rpx;
		/* 为底部导航栏留空间 */
	}

	/* 积分卡片 */
	.points-card {
		background: linear-gradient(135deg, #A855F7, #EC4899);
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 30rpx;
		box-shadow: 0 8rpx 24rpx rgba(255, 154, 158, 0.3);
	}

	.points-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.points-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.points-label {
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
	}

	.crown-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.points-value {
		font-size: 60rpx;
		font-weight: 700;
		color: #fff;
		display: block;
	}

	/* 进度条区域 */
	.progress-container {
		border-radius: 20rpx;
		padding: 20rpx;
	}

	.level-info {
		font-size: 28rpx;
		color: #fff;
		display: block;
		margin-bottom: 15rpx;
	}

	.progress-bar {
		height: 16rpx;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #fff;
		border-radius: 10rpx;
		transition: width 0.5s ease;
	}

	/* 任务标签 */
	.task-tabs {
		display: flex;
		padding: 0 30rpx;
		background-color: #fff;
		margin-top: 30rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		position: relative;

		padding: 12rpx 0;
		margin-right: 20rpx;
		border-radius: 40rpx;
		color: #555555;
		background-color: #f5f5f5;

		&.active {
			background-color: #9333EA;

			.tab-daily,
			.tab-growth,
			.tab-time-limit {
				font-weight: 600;
				color: #fff;
			}
		}
	}

	.tab-content {
		font-size: 28rpx;
		color: #999;
		position: relative;
		display: inline-block;
		padding: 5rpx 0;

		&.tab-daily {
			color: #999;

			.active &.tab-daily {
				color: #fff;
			}
		}
	}

	/* 任务列表 */
	.task-list {
		height: calc(100vh - 700rpx);
		padding: 0 30rpx;
		margin-top: 20rpx;
	}

	.task-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f0f0f0;

		&.growth {
			background-color: rgba(111, 207, 151, 0.07);
			border-radius: 16rpx;
			margin: 15rpx 0;
			padding: 25rpx 20rpx;
		}

		&.time-limit {
			background-color: rgba(255, 184, 140, 0.1);
			border-radius: 16rpx;
			margin: 15rpx 0;
			padding: 25rpx 20rpx;
			border-left: 6rpx solid #ff8c1a;
		}
	}

	.task-info {
		flex: 1;
		padding-left: 20rpx;
	}

	.task-header {
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.daily-icon,
	.growth-icon,
	.time-icon {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
	}

	.growth-icon {
		background-color: #d1f1e1;
	}

	.time-icon {
		background-color: #ffecd0;
	}

	.task-type-icon {
		width: 55rpx;
		height: 55rpx;
	}

	.task-name {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		margin-right: 15rpx;
	}

	.task-desc {
		font-size: 28rpx;
		color: #666;
		display: block;
	}

	.deadline {
		font-size: 24rpx;
		color: #ff8c1a;
		background-color: rgba(255, 140, 26, 0.1);
		padding: 4rpx 10rpx;
		border-radius: 6rpx;
	}

	.task-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.task-points {
		font-size: 36rpx;
		font-weight: bold;
		color: #9333EA;
		margin-bottom: 10rpx;

		&.growth-points {
			color: #27ae60;
		}

		&.time-points {
			color: #ff8c1a;
		}
	}

	.task-action {
		min-width: 100rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 30rpx;
		font-size: 28rpx;
		padding: 0 20rpx;
		background-color: #9333EA;
		color: white;
		text-align: center;

		&.completed {
			background-color: #e0e0e0;
			color: #999;
		}

		// 每日任务样式
		&.daily-action {
			background-color: #9333EA;

			&.completed {
				background-color: #F3F4F6;
			}
		}

		// 成长任务样式
		&.growth-action {
			background-color: #27ae60;

			&.completed {
				background-color: #e0e0e0;
			}
		}

		// 限时任务样式
		&.time-action {
			background-color: #ff8c1a;

			&.completed {
				background-color: #e0e0e0;
			}
		}
	}

	.progress-task-list {
		padding: 20rpx 0;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.progress-task-item {
		padding: 24rpx 32rpx;
		box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;

		.progress-task-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.progress-task-name {
				font-size: 32rpx;
				color: #333333;
				font-weight: 500;
			}

			.progress-reward-amount {
				font-size: 32rpx;
				color: #9333EA;
				font-weight: 600;
			}
		}

		.progress-section {
			display: flex;
			flex-direction: column;
			gap: 16rpx;

			.progress-text {
				display: flex;
				justify-content: flex-end;
				font-size: 28rpx;
				color: #666666;
			}

			.progress-bar {
				width: 100%;
				height: 16rpx;
				background-color: #f0f0f0;
				border-radius: 10rpx;
				overflow: hidden;

				.progress-fill {
					height: 100%;
					background-color: #8e44ad; // 紫色进度条
					border-radius: 10rpx;
					transition: width 0.3s ease;
				}
			}
		}
	}
</style>