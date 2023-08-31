<template>
	<view @click="clickHandle" class="lock-container">
		<view class="lock-content">
			<image class="lock-icon" src="../../static/images/through/lock.png" mode="aspectFit"></image>
		</view>
		<view class="starts">
			<view class="start-item">
				<image src="../../static/images/through/start1.png" mode="aspectFit"></image>
			</view>
			<view class="start-item">
				<image src="../../static/images/through/start1.png" mode="aspectFit"></image>
			</view>
			<view class="start-item">
				<image src="../../static/images/through/start1.png" mode="aspectFit"></image>
			</view>
		</view>
		<view v-if="isShowModal" class="modal">
			<view class="content">
				<image @click.stop="isShowModal = false" class="close" src="../../static/images/modal/close.png" mode="aspectFit"></image>
				<view class="title">提示</view>
				<view class="name">第{{data.levelName}}关</view>
				<view v-if="data.isLock == 2" class="text-container">
					<view class="text">你已闯关成功</view>
					<view class="text">不如去闯关其它关卡吧！</view>
				</view>
				<view v-else-if="data.isLock == 1" class="text-container">
					<view class="text">练习超过五次未成功</view>
					<view class="text">不如请教老师吧！</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				required: true
			}
		},
		data () {
			return {
				isShowModal: false
			}
		},
		methods: {
			clickHandle () {
				if (this.data.isLock == 1 || this.data.isLock == 2) {
					this.isShowModal = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		background-color: rgba(0, 0, 0, .6);
		display: flex;
		justify-content: center;
		align-items: center;
		.content {
			width: 562rpx;
			height: 455rpx;
			background-image: url(../../static/images/modal/bg.png);
			background-size: 100% 100%;
			position: relative;
			// overflow: hidden;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;
			.close {
				position: absolute;
				width: 80rpx;
				height: 80rpx;
				right: -20rpx;
				top: -20rpx;
			}
			.name {
				font-size: 26rpx;
				color: #886646;
				background-color: #FFEBB4;
				max-width: 100%;
				display: inline-block;
				height: 48rpx;
				line-height: 48rpx;
				border-radius: 24rpx;
				padding: 0 20rpx;
				margin: 130rpx 0 0;
			}
			.text-container {
				margin-top: 40rpx;
				text-align: center;
				color: #8F6E4D;
				font-size: 40rpx;
				line-height: 60rpx;
			}
			.title {
				width: 323rpx;
				height: 78rpx;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: -12rpx;
				background-image: url(../../static/images/modal/title_bg.png);
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #ffffff;
				font-size: 36rpx;
				letter-spacing: 10rpx;
			}
		}
	}
	.lock-container {
		width: 112rpx;
		height: 80rpx;
		background: #C0C0C0;
		box-shadow: 3rpx 3rpx 4rpx 0px rgba(198, 193, 199, 0.83);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		position: relative;
		.starts {
			position: absolute;
			display: flex;
			align-items: center;
			bottom: -14rpx;
			left: 50%;
			width: 100%;
			justify-content: space-between;
			transform: translateX(-50%);
			image {
				width: 46rpx;
				height: 46rpx;
			}
			.start-item {
				&:nth-child(2) {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: -10rpx;
				}
			}
		}
		.lock-content {
			width: 80rpx;
			height: 57rpx;
			background: #E1E1E1;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			.lock-icon {
				width: 36rpx;
				height: 36rpx;
			}
		}
	}
</style>
