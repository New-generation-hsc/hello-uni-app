<template>
	<view class="checkin-container">
		<!-- 打卡记录列表 - 使用数组动态渲染 -->
		<view class="record-list" :style="{ minHeight : dynamicHeight + 'px'}">
			<!-- 打卡信息卡片 -->
			<view class="checkin-card">
				<view class="checkin-info">
					<text class="checkin-label">连续打卡</text>
					<text class="checkin-days">{{ streakDays }}天</text>
				</view>

				<!-- 打卡进度条 -->
				<view class="progress-bar">
					<view v-for="day in 7" :key="day" class="progress-item" :class="{ completed: day <= streakDays }">
					</view>
				</view>
			</view>

			<!-- 打卡日历 -->
			<view class="calendar-container">
				<text class="section-title">打卡日历</text>
				<view class="calendar">
					<view class="weekdays">
						<text v-for="(day, index) in weekdays" :key="index" class="weekday">{{ day }}</text>
					</view>
					<view class="days-grid">
						<view v-for="(day, index) in calendarDays" :key="index" class="day-cell" :class="{ 
		              'current-month': day.inMonth,
		              'checked': day.checked,
		              'today': day.isToday
		            }">
							<text class="day-number">{{ day.day }}</text>
							<view v-if="day.checked" class="check-icon">✓</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 动态渲染打卡记录 -->
			<text class="section-title">打卡动态</text>
			<view v-for="(record, index) in checkinRecords" :key="index" class="record-item"
				@click="viewRecordDetail(record)">
				<text class="record-date">{{ record.date }}</text>
				<view class="record-content">
					<image :src="record.image" class="pose-image" mode="aspectFill" />
					<view class="record-details">
						<text class="pose-name">{{ record.poseName }}</text>
						<text class="record-time">{{ record.time }}</text>
						<text class="streak-days">已坚持{{ record.streakDays }}天</text>
					</view>
				</view>
			</view>

			<!-- 空状态提示 -->
			<view v-if="checkinRecords.length === 0" class="empty-tips">
				<text class="empty-text">暂无打卡记录</text>
				<button class="start-btn">开始第一次打卡</button>
			</view>
		</view>
	</view>
</template>

<script>
	const systemInfo = uni.getSystemInfoSync();

	export default {
		data() {
			return {
				dynamicHeight: systemInfo.windowHeight - 48,
				// 打卡记录数组
				checkinRecords: [{
						id: 1,
						date: "2024年2月8日",
						poseName: "站立前屈式",
						image: "/static/girl-pose-01.png",
						time: "08:30",
						streakDays: 30,
						details: "站立前屈式是哈他瑜伽中的常见体式，能有效拉伸腿部后侧肌肉"
					},
					{
						id: 2,
						date: "2024年2月7日",
						poseName: "战士二式",
						image: "/static/girl-pose-02.png",
						time: "09:15",
						streakDays: 29,
						details: "战士二式能够加强腿部力量，同时增强耐力和专注力"
					},
					{
						id: 3,
						date: "2024年2月6日",
						poseName: "树式",
						image: "/static/girl-pose-03.png",
						time: "08:45",
						streakDays: 28,
						details: "树式可以改善平衡能力，同时增强脚踝和大腿的力量"
					},
					{
						id: 4,
						date: "2024年2月5日",
						poseName: "下犬式",
						image: "/static/girl-pose-01.png",
						time: "07:55",
						streakDays: 27,
						details: "下犬式能拉伸全身，帮助缓解压力和焦虑"
					}
				],
				streakDays: 3, // 连续打卡天数
				weekdays: ['日', '一', '二', '三', '四', '五', '六'],
				calendarDays: []
			}
		},
		mounted() {
			this.generateCalendar();
		},
		methods: {
			viewRecordDetail(record) {
				console.log("width: ", systemInfo.windowHeight);
				console.log("content: ", this.dynamicHeight);
				uni.navigateTo({
					url: '/pages/detail/detail'
				});
			},
			// 生成日历数据
			generateCalendar() {
				const today = new Date();
				const year = today.getFullYear();
				const month = today.getMonth();

				// 获取当月第一天
				const firstDay = new Date(year, month, 1);
				// 获取当月最后一天
				const lastDay = new Date(year, month + 1, 0);
				// 获取当月第一天是星期几（0-6，0代表星期日）
				const firstDayOfWeek = firstDay.getDay();

				// 生成日历数组
				const days = [];

				// 添加上个月的天数
				const prevMonthDays = new Date(year, month, 0).getDate();
				for (let i = prevMonthDays - firstDayOfWeek + 1; i <= prevMonthDays; i++) {
					days.push({
						day: i,
						inMonth: false,
						checked: false
					});
				}

				// 添加当月的天数
				for (let i = 1; i <= lastDay.getDate(); i++) {
					const isToday = i === today.getDate() && month === today.getMonth();
					days.push({
						day: i,
						inMonth: true,
						checked: i <= today.getDate(), // 今天及之前的日期都标记为已打卡
						isToday: isToday
					});
				}

				// 添加下个月的天数（补齐42个格子）
				const nextMonthDays = 42 - days.length;
				for (let i = 1; i <= nextMonthDays; i++) {
					days.push({
						day: i,
						inMonth: false,
						checked: false
					});
				}

				this.calendarDays = days;
			}
		}
	}
</script>

<style>
	/* 整体布局 */
	.checkin-container {
		display: flex;
		flex-direction: column;
		background-color: #f8f8f8;
		/* 浅灰色背景 */
	}

	/* 打卡记录列表 */
	.record-list {
		margin-bottom: 20rpx;
		/* 避免被底部导航遮挡 */
		padding: 0 30rpx;
	}

	.record-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-top: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.record-item:active {
		background-color: #f9f9f9;
		transform: scale(0.97);
	}

	.record-date {
		font-size: 30rpx;
		color: #666;
		margin-bottom: 20rpx;
		display: block;
	}

	.record-content {
		display: flex;
		align-items: center;
	}

	.pose-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		margin-right: 30rpx;
	}

	.record-details {
		flex: 1;
	}

	.pose-name {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
		display: block;
		margin-bottom: 10rpx;
	}

	.record-time {
		font-size: 32rpx;
		color: #666;
		display: block;
		margin-bottom: 10rpx;
	}

	.streak-days {
		font-size: 28rpx;
		color: #4a90e2;
		background-color: rgba(74, 144, 226, 0.1);
		border-radius: 20rpx;
		padding: 6rpx 15rpx;
		display: inline-block;
	}

	/* 空状态提示 */
	.empty-tips {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.empty-text {
		font-size: 34rpx;
		color: #999;
		margin-bottom: 40rpx;
	}

	.start-btn {
		background-color: #07c160;
		color: #fff;
		width: 70%;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 32rpx;
		line-height: 80rpx;
	}

	/* 打卡信息卡片 */
	.checkin-card {
		background-color: #f0e6ff;
		/* 淡紫色背景 */
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		margin-top: 30rpx;
	}

	.checkin-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.checkin-label {
		font-size: 28rpx;
		color: #333;
	}

	.checkin-days {
		font-size: 30rpx;
		font-weight: bold;
		color: #8e44ad;
		/* 紫色 */
	}

	/* 打卡进度条 */
	.progress-bar {
		display: flex;
		justify-content: space-between;
	}

	.progress-item {
		width: 70rpx;
		height: 30rpx;
		border-radius: 8rpx;
		background-color: #e0e0e0;
		/* 灰色未打卡 */


	}

	.progress-item.completed {
		background-color: #8e44ad;
		/* 紫色已打卡 */
	}

	/* 日历区域 */
	.calendar-container {
		margin: 30rpx 0;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 25rpx;
		display: block;
	}

	.calendar {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.weekdays {
		display: flex;
		justify-content: space-around;
		margin-bottom: 20rpx;
	}

	.weekday {
		font-size: 32rpx;
		color: #666;
		width: 14.28%;
		/* 100% / 7 */
		text-align: center;
	}

	.days-grid {
		display: flex;
		flex-wrap: wrap;
	}

	.day-cell {
		width: 14.28%;
		/* 100% / 7 */
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.day-number {
		font-size: 32rpx;
		color: #333;
	}

	.day-cell:not(.current-month) .day-number {
		color: #ccc;
	}

	.day-cell.checked .day-number {
		color: #8e44ad;
		font-weight: bold;
	}

	.day-cell.checked::after {
		content: '';
		position: absolute;
		bottom: 5rpx;
		width: 10rpx;
		height: 10rpx;
		background-color: #8e44ad;
		border-radius: 50%;
	}

	.day-cell.today .day-number {
		color: #fff;
		background-color: #8e44ad;
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>