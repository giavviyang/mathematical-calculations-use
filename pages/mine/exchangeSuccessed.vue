<template>
	<view :style="{paddingTop: statusBarHeight + 45 + 'px'}" class="exchange-success">
		<view :style="{ height: statusBarHeight + 45 + 'px', paddingTop: statusBarHeight + 'px'}" class="header">
			<image @click="navigateBack" src="../../static/images/Snipaste_2021-12-24_10-25-34.png" mode="widthFix"></image>
			<view class="title">兑换详情</view>
		</view>
		<view class="page-content">
			<view class="success-section">
				<image src="../../static/images/mine/success.png" class="success" mode="widthFix"></image>
				<view class="text">兑换成功</view>
				<view @click="jumpHandle('/pages/mine/setAvatar')" class="btn">设置头像框</view>
			</view>
			<view class="list-container">
				<view class="title">更多推荐</view>
				<view class="list">
					<view v-for="(item, index) in goodsList" :key="index" class="list-item">
						<view v-if="item.purchaseStatus == 1" class="purchased">已购买</view>
						<view class="img">
							<image :src="item.goodsImge" mode="widthFix"></image>
						</view>
						<view class="name">{{item.goodsName}}</view>
						<view class="desc">{{item.goodsDescribe}}</view>
						<view class="points">
							<image src="../../static/images/mine/point.png" mode=""></image>
							<view class="num">200</view>
						</view>
					</view>
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
				goodsList: []
			}
		},
		onLoad () {
			this.getGoods()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			async getGoods () {
				const res = await this.$http.post('/applet/goods/queryGoods', {})
				console.log(res)
				this.goodsList = res.data
			},
			jumpHandle (path) {
				uni.navigateTo({
					url: path
				})
			},
			navigateBack () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.exchange-success {
		box-sizing: border-box;
		background-color: #ECF8FF;
		min-height: 100vh;
		.page-content {
			padding: 0 30rpx;
			overflow: hidden;
			.list-container {
				background-color: #ffffff;
				.title {
					padding: 0 30rpx;
				}
				.list {					
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
							height: auto;
							overflow: hidden;
							display: block;
							margin: 0 auto;
							max-height: 200rpx;
							image {
								width: 100%;
							}
						}
						.name {
							font-size: 28rpx;
							margin-top: 20rpx;
						}
						.desc {
							font-size: 24rpx;
							color: #999999;
							margin-top: 5rpx;
							margin-top: 5rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							line-height: 30rpx;
							height: 60rpx;
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
			.success-section {
				background-color: #ffffff;
				border-radius: 40rpx 40rpx 0 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 80rpx 0;
				.success {
					width: 120rpx;
					height: 120rpx;
				}
				.text {
					font-size: 32rpx;
					margin-top: 15rpx;
				}
				.btn {
					width: 216rpx;
					height: 70rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #ffffff;
					background-color: #24A9FF;
					border-radius: 35rpx;
					font-size: 26rpx;
					margin-top: 80rpx;
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
		background-color: #ECF8FF;
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
