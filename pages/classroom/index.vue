<template>
	<view class="container" :style="{paddingTop: statusBarHeight + 45 + 'px'}">
		<CustomerTopBar backgroundColor="#F5F5F5" title="课堂测试" />
		<view class="list">
			<view @click="jumpAnswer(item)" v-for="(item, index) in listData" :key="index" class="list-item">
				<view class="left line-1">{{item.testName}}</view>
				<view class="right">
					<view v-if="!item.score && item.score != 0" class="btn answer">开始答题</view>
					<view v-else :class="['btn', item.score < 60 ? 'score1' : item.score == 100 ? 'score2' : 'score3']">{{item.score}}分</view>
					<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import app from '../../App.vue'
	import CustomerTopBar from '../../component/customer-top-bar/index.vue'
	import RestModal from '../../component/restmodal.vue'
	export default {
		components:{
			CustomerTopBar,
			RestModal
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				listData: []
			}
		},
		onShow () {
			this.getList()
		},
		methods: {
			jumpAnswer (item) {
				uni.navigateTo({
					url: `/pages/index/answer?id=${item.id}&type=3`
				})
			},
			async getList () {
				uni.showLoading({
					title: '加载中',
					icon: 'loading'
				})
				const res = await this.$http.get('/applet/classRoomTest/queryTestList', {})
				this.listData = res.data
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background-color: #F5F5F5;
		box-sizing: border-box;
		.list {
			padding: 20rpx 30rpx;
			.list-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 120rpx;
				background-color: #ffffff;
				border-radius: 30rpx;
				margin-bottom: 20rpx;
				padding: 0 24rpx;
				&:last-child {
					margin-bottom: 0;
				}
				.left {
					font-size: 36rpx;
					// font-weight: bold;
				}
				.right {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					.btn {
						&.answer {
							color: #24A9FF;
						}
						&.score1 {
							color: #00B907;
						}
						&.score2 {
							color: #FF0000;
						}
						&.score3 {
							color: #FF772B;
						}
					}
					image {
						width: 15rpx;
						margin-left: 16rpx;
					}
				}
			}
		}
	}
</style>
