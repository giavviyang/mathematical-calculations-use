<template>
	<view class="point-mall">
		<view :style="{ height: statusBarHeight + 45 + 'px', paddingTop: statusBarHeight + 'px'}" class="header">
			<image @click="navigateBack" src="../../static/images/Snipaste_2021-12-24_10-25-34.png" mode="widthFix"></image>
			<view class="title">金币商城</view>
		</view>
		<view class="top">
			<image src="../../static/images/mine/point_bg.png" class="bg" mode="widthFix"></image>
			<view class="my-point">
				<image src="../../static/images/mine/point.png" mode="widthFix"></image>
				<view class="info">
					<view class="label">我的金币</view>
					<view class="num">{{userInfo.goldNumber}}</view>
				</view>
			</view>
		</view>
		<view class="list-box">
			<view class="list">
				<view @click="toExchange(item)" v-for="(item, index) in listData" :key="index" class="list-item">
					<view v-if="item.purchaseStatus == 1" class="purchased">已购买</view>
					<view class="img">
						<image :src="item.goodsImge" mode="widthFix"></image>
					</view>
					<view class="name">{{item.goodsName}}</view>
					<view class="desc">{{item.goodsDescribe}}</view>
					<view class="points">
						<image v-if="item.purchaseStatus == 0" src="../../static/images/mine/coin.png" mode=""></image>
						<image v-else src="../../static/images/mine/coin1.png" mode=""></image>
						<view class="num">{{item.goodsCoins}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="exchangeModal" class="exchange-modal">
			<view class="content">
				<view class="title">使用 <image src="../../static/images/mine/point.png" mode="widthFix"></image>{{currentGood.goodsCoins}} 兑换该商品</view>
				<view class="desc">商品一经兑换不可退换</view>
				<view class="actions">
					<view @click="exchangeModal = false" class="action-item">取消</view>
					<view @click="exchangeHandle" class="action-item">确定</view>
				</view>
			</view>
		</view>
		<RestModal ref="rest" />
	</view>
</template>

<script>
	import app from '../../App.vue'
	import RestModal from '../../component/restmodal.vue'
	export default {
		components: {
			RestModal
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				listData: [],
				exchangeModal: false,
				currentGood: {},
				userInfo: {}
			}
		},
		onLoad (options) {
			console.log(options)
			this.goldNumber = options.goldNumber
		},
		onShow () {
			this.getData()
			this.getUserInfo()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			async getUserInfo () {
				const res = await this.$http.post('/applet/getStudentsInfo', {})
				console.log(res.data, 111234)
				this.userInfo = res.data
			},
			async exchangeHandle () {
				console.log(this.currentGood)
				const res = await this.$http.post('/applet/goods/purchaseGoods', {goodsId: this.currentGood.goodsId})
				this.exchangeModal = false
				uni.navigateTo({
					url: '/pages/mine/exchangeSuccessed'
				})
			},
			toExchange (item) {
				console.log(item)
				if (item.purchaseStatus == 1) {
					uni.showToast({
						title: '已兑换',
						icon: 'none',
						duration: 1000
					})
					return false
				}
				if (item.goodsCoins <= this.userInfo.goldNumber) {
					this.currentGood = item
					this.exchangeModal = true
				}
			},
			async getData () {
				const res = await this.$http.post('/applet/goods/queryGoods', {})
				console.log(res)
				this.listData = res.data
			},
			navigateBack () {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.exchange-modal {
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
			width: 543rpx;
			height: 280rpx;
			background-color: #ffffff;
			border-radius: 30rpx;
			padding-top: 40rpx;
			box-sizing: border-box;
			.title {
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				image {
					width: 29rpx;
					height: 29rpx;
					margin-left: 10rpx;
				}
			}
			.desc {
				font-size: 28rpx;
				color: #666666;
				text-align: center;
				margin-top: 20rpx;
			}
			.actions {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 30rpx;
				.action-item {
					width: 216rpx;
					height: 68rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 34rpx;
					border: 1rpx solid #FAA716;
					color: #FAA716;
					font-size: 28rpx;
					&:last-child {
						color: #ffffff;
						background-color: #FAA716;
						margin-left: 30rpx;
					}
				}
			}
		}
	}
	.point-mall {
		box-sizing: border-box;
		background-color: #ECF8FF;
		min-height: 100vh;
		.list-box {
			box-sizing: border-box;
			padding: 0 30rpx;
			.list {
				background-color: #ffffff;
				border-radius: 40rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				box-sizing: border-box;
				padding: 25rpx 25rpx;
				.list-item {
					width: 309rpx;
					height: 455rpx;
					box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.11);
					box-sizing: border-box;
					padding: 36rpx 20rpx 0;
					border-radius: 30rpx;
					margin-top: 25rpx;
					&:nth-child(-n + 2) {
						margin-top: 0;
					}
					position: relative;
					.purchased {
						position: absolute;
						left: 0;
						top: 0;
						width: 102rpx;
						height: 38rpx;
						color: #ffffff;
						font-size: 24rpx;
						text-align: center;
						background: linear-gradient(180deg, #FFA23F 0%, #FF653E 100%);
						border-bottom: 2px solid #F34C35;
						border-right: 2px solid #F34C35;
						border-radius: 30rpx 19rpx 19rpx 0;
					}
					.img {
						width: 200rpx;
						height: 200rpx;
						display: block;
						margin: 0 auto;
						overflow: hidden;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.name {
						font-size: 28rpx;
						margin-top: 20rpx;
					}
					.desc {
						font-size: 24rpx;
						line-height: 30rpx;
						height: 60rpx;
						color: #999999;
						margin-top: 5rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.points {
						display: flex;
						align-items: center;
						margin-top: 10rpx;
						image {
							width: 36rpx;
							height: 36rpx;
						}
						.num {
							font-size: 32rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
		.top {
			.bg {
				width: 100%;
			}
			position: relative;
			.my-point {
				position: absolute;
				display: flex;
				align-items: center;
				position: absolute;
				left: 30rpx;
				bottom: 60rpx;
				image {
					width: 100rpx;
				}
				.info {
					margin-left: 20rpx;
					.label {
						font-size: 28rpx;
					}
					.num {
						font-size: 36rpx;
					}
				}
			}
		}
	}
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9999;
		box-sizing: border-box;
		width: 100vw;
		padding-right: 30rpx;
		padding-left: 30rpx;
		background-color: rgba(0, 0, 0, 0);
		.title {
			padding-right: 55rpx;
			flex: 1;
			text-align: center;
		}
		image {
			width: 55rpx;
			height: 55rpx;
			top: var(--status-bar-height);
		}
	}
</style>
