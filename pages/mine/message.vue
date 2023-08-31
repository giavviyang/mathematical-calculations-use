<template>
	<view :style="{paddingTop: statusBarHeight + 45 + 'px'}" class="message-container">
		<CustomerTopBar color="#ffffff" title="通知" />
		<view class="page-content">
			<view class="list">
				<view v-for="(item, key) in listData" :key="key" class="list-item">
					<view class="time">{{item.noticeTime}}</view>
					<view class="content">
						<image class="icon" src="../../static/images/mine/arrow.png" mode="scaleToFill"></image>
						<image class="avatar" :src="item.noticePortrait" mode="aspectFill"></image>
						<view class="message">{{item.noticeContent}}</view>
					</view>
				</view>
			</view>
		</view>
		<RestModal ref="rest" />
	</view>
</template>

<script>
	import app from '../../App.vue'
	import CustomerTopBar from '../../component/customer-top-bar/index.vue'
	import RestModal from '../../component/restmodal.vue'
	export default {
		components: {
			CustomerTopBar,
			RestModal
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				listData: []
			}
		},
		onLoad () {
			this.getListData()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			async getListData () {
				uni.showLoading({
					mask: true
				})
				const res = await this.$http.post('/applet/queryNewsNotice', {})
				uni.hideLoading()
				this.listData = res.data
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message-container {
		width: 100vw;
		height: 100vh;
		background-color: #23a8ff;
		box-sizing: border-box;
		.page-content {
			background-color: #ffffff;
			width: 100%;
			height: 100%;
			background-color: #ffffff;
			border-radius: 30rpx 30rpx 0 0;
			overflow: auto;
			.list {
				box-sizing: border-box;
				padding: 40rpx 30rpx;
				.list-item {
					margin-bottom: 40rpx;
					&:last-child {
						margin-bottom: 0;
					}
					.time {
						font-size: 28rpx;
						color: #666666;
						text-align: center;
					}
					.content {
						margin-top: 20rpx;
						display: flex;
						position: relative;
						.icon {
							position: absolute;
							width: 50rpx;
							height: 70rpx;
							left: 125rpx;
							top: 20rpx;
						}
						.avatar {
							width: 108rpx;
							height: 108rpx;
							border-radius: 50%;
						}
						.message {
							position: relative;
							z-index: 10;
							min-height: 108rpx;
							flex: 1;
							background-color: #F2F3F7;
							font-size: 28rpx;
							box-sizing: border-box;
							padding: 20rpx;
							text-align: justify;
							border-radius: 20rpx;
							margin-left: 35rpx;
						}
					}
				}
			}
		}
	}
</style>
