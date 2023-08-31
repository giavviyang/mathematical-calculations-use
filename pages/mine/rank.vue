<template>
	<view v-if="pageData.studentNickname" class="rank-container">
		<CustomerTopBar backgroundColor="linear-gradient(180deg, #FFCE19 0%, #FFC900 100%)" title="校园荣誉榜" />
		<view class="top-section">
			<image class="bg" src="../../static/images/mine/rank_bg.png" mode="widthFix"></image>
			<view class="top-content">
				<view class="main">
					<view class="avatar-container">
						<view class="avatar-content">
							<image class="rank-status" v-if="pageData.isList == 1" src="../../static/images/mine/rank_bg2.png" mode="aspectFit"></image>
							<image class="rank-status" v-else src="../../static/images/mine/rank_bg1.png" mode="aspectFit"></image>
							<view class="avatar">
								<image :src="pageData.studentPortrait" mode="aspectFill"></image>
							</view>
						</view>
					</view>
					<view class="user-info">
						<view class="user-name">{{pageData.studentNickname}}</view>
						<view class="grade">{{pageData.classRoom}}</view>
					</view>
					<view v-if="currentTab == 1 || currentTab == 2" class="score">
						<view class="label">总题数</view>
						<view class="num">{{pageData.correcNum || 0}}</view>
					</view>
					<view v-else-if="currentTab == 3" class="score">
						<view class="label">正确率提升</view>
						<view v-if="pageData.progressRate" class="num">{{(pageData.progressRate * 100).toFixed(0) + '%'}}</view>
						<view v-else class="num">0</view>
					</view>
					<view v-else-if="currentTab == 4" class="score">
						<view class="label">成功闯关数</view>
						<view v-if="pageData.levelNum" class="num">{{pageData.levelNum}}</view>
						<view v-else="pageData.levelNum" class="num">0</view>
					</view>
				</view>
				<view v-if="pageData.isList == 1" class="desc">恭喜你上榜啦！你是第{{pageData.ranking}}名哦</view>
				<view v-else class="desc">
					<text v-if="currentTab == 1 || currentTab == 2">目前距离上榜还差{{pageData.disparity}}题，多多练习吧</text>
					<text v-else-if="currentTab == 3">正确率提升{{(pageData.disparity).toFixed(0) + '%'}}就可以上榜啦</text>
					<text v-else>再闯{{pageData.disparity}}关就可以上榜啦</text>
				</view>
			</view>
			
		</view>
		<view class="tab-container">
			<view class="tab-box">
				<view @click="tabHandle(1)" :class="[currentTab == 1 ? 'active' : '', 'tab-item']">周勤奋榜</view>
				<view @click="tabHandle(2)" :class="[currentTab == 2 ? 'active' : '', 'tab-item']">总勤奋榜</view>
				<view @click="tabHandle(3)" :class="[currentTab == 3 ? 'active' : '', 'tab-item']">进步榜</view>
				<view @click="tabHandle(4)" :class="[currentTab == 4 ? 'active' : '', 'tab-item']">闯关榜</view>
			</view>
		</view>
		<view class="top3">
			<view class="top-item">
				<view class="avatar-box">
					<image class="icon" src="../../static/images/mine/second.png" mode="aspectFill"></image>
					<view class="avatar">
						<image v-if="pageData.list[1]" :src="pageData.list[1].studentPortrait" mode="aspectFill"></image>
						<image else src="../../static/images/avatar.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="user-name">{{pageData.list[1] ? pageData.list[1].studentNickname : '---'}}</view>
				<view class="grade">{{pageData.list[1] ? pageData.list[1].classRoom : '-----'}}</view>
				<view class="right-num">
					<view class="label">{{currentTab == 1 || currentTab == 2 ? '总题数' : currentTab == 3 ? '正确率提升' : '成功闯关数'}}</view>
					<view v-if="currentTab == 1 || currentTab == 2" class="num">{{pageData.list[1] ? pageData.list[1].correcNum : 0}}</view>
					<view v-if="currentTab == 3" class="num">{{pageData.list[1] ? (pageData.list[1].progressRate * 100).toFixed(0) + '%' : '0%'}}</view>
					<view v-if="currentTab == 4" class="num">{{pageData.list[1] ? pageData.list[1].levelNum : 0}}</view>
				</view>
			</view>
			<view class="top-item first">
				<view class="avatar-box">
					<image class="icon" src="../../static/images/mine/first.png" mode="aspectFill"></image>
					<view class="avatar">
						<image v-if="pageData.list[0]" :src="pageData.list[0].studentPortrait" mode="aspectFill"></image>
						<image else src="../../static/images/avatar.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="user-name">{{pageData.list[0] ? pageData.list[0].studentNickname : '---'}}</view>
				<view class="grade">{{pageData.list[0] ? pageData.list[0].classRoom : '-----'}}</view>
				<view class="right-num">
					<view class="label">{{currentTab == 1 || currentTab == 2 ? '总题数' : currentTab == 3 ? '正确率提升' : '成功闯关数'}}</view>
					<view v-if="currentTab == 1 || currentTab == 2" class="num">{{pageData.list[0] ? pageData.list[0].correcNum : 0}}</view>
					<view v-if="currentTab == 3" class="num">{{pageData.list[0] ? (pageData.list[0].progressRate * 100).toFixed(0) + '%' : '0%'}}</view>
					<view v-if="currentTab == 4" class="num">{{pageData.list[0] ? pageData.list[0].levelNum : 0}}</view>
				</view>
			</view>
			<view class="top-item">
				<view class="avatar-box">
					<image class="icon" src="../../static/images/mine/third.png" mode="aspectFill"></image>
					<view class="avatar">
						<image v-if="pageData.list[2]" :src="pageData.list[2].studentPortrait" mode="aspectFill"></image>
						<image else src="../../static/images/avatar.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="user-name">{{pageData.list[2] ? pageData.list[2].studentNickname : '---'}}</view>
				<view class="grade">{{pageData.list[2] ? pageData.list[2].classRoom : '-----'}}</view>
				<view class="right-num">
					<view class="label">{{currentTab == 1 || currentTab == 2 ? '总题数' : currentTab == 3 ? '正确率提升' : '成功闯关数'}}</view>
					<view v-if="currentTab == 1 || currentTab == 2" class="num">{{pageData.list[2] ? pageData.list[2].correcNum : 0}}</view>
					<view v-if="currentTab == 3" class="num">{{pageData.list[2] ? (pageData.list[2].progressRate * 100).toFixed(0) + '%' : '0%'}}</view>
					<view v-if="currentTab == 4" class="num">{{pageData.list[2] ? pageData.list[2].levelNum : 0}}</view>
				</view>
			</view>
		</view>
		<view class="list-container">
			<view v-if="pageData.list.length >= 4" class="list">
				<view v-for="(item, index) in pageData.list.slice(3,pageData.list.length)" :key="index" class="list-item">
					<view class="sort">{{index + 4}}</view>
					<view class="user-info">
						<view class="avatar-container">
							<view class="avatar-content">
								<view class="avatar">
									<image :src="item.studentPortrait" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<view class="info">
							<view class="user-name">{{item.studentNickname}}</view>
							<view class="grade">{{item.classRoom}}</view>
						</view>
					</view>
					<view class="right-num">
						<view class="label">{{currentTab == 1 || currentTab == 2 ? '总题数' : currentTab == 3 ? '正确率提升' : '成功闯关数'}}</view>
						<view v-if="currentTab == 1 || currentTab == 2" class="num">{{item.correcNum}}</view>
						<view v-else-if="currentTab == 3" class="num">{{(item.progressRate * 100).toFixed(0) + '%'}}</view>
						<view v-else class="num">{{item.levelNum}}</view>
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
				currentTab: 1,
				pageData: {}
			}
		},
		onLoad () {
			this.getPageData()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			tabHandle (type) {
				this.currentTab = type
				this.getPageData()
			},
			async getPageData () {
				uni.showLoading({
					title: '加载中'
				})
				if (this.currentTab == 1) {
					const res = await this.$http.post('/applet/rankingList/weekDiligenceRanking', {})
					console.log(res)
					this.pageData = res.data
				} else if (this.currentTab == 2) {
					const res = await this.$http.post('/applet/rankingList/totalDiligenceRanking', {})
					console.log(res)
					this.pageData = res.data
				} else if (this.currentTab == 3) {
					const res = await this.$http.post('/applet/rankingList/progressRanking', {})
					console.log(res)
					this.pageData = res.data
				} else if (this.currentTab == 4) {
					const res = await this.$http.post('/applet/rankingList/levelRanking', {})
					console.log(res)
					this.pageData = res.data
				}
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rank-container {
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #F5F5F5;
		padding-bottom: 30rpx;
		.list-container {
			box-sizing: border-box;
			padding: 0 30rpx;
			margin-top: -80rpx;
			.list {
				background-color: #ffffff;
				box-sizing: border-box;
				padding: 120rpx 20rpx 0;
				border-radius: 10rpx;
				.list-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 25rpx 0;
					.sort {
						width: 60rpx;
						height: 62rpx;
						background-image: url(../../static/images/mine/star_bg.png);
						background-size: 100% 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #ffffff;
						font-size: 28rpx;
					}
					.user-info {
						display: flex;
						align-items: center;
						flex: 1;
						margin-left: 35rpx;
						.avatar-container {
							.avatar-content {
								.avatar {
									width: 95rpx;
									height: 95rpx;
									overflow: hidden;
									border-radius: 50%;
									image {
										width: 100%;
										height: 100%;
									}
								}
							}
						}
						.info {
							margin-left: 20rpx;
							.user-name {
								font-size: 30rpx;
							}
							.grade {
								margin-top: 10rpx;
								font-size: 24rpx;
								color: #666666;
							}
						}
					}
					.right-num {
						display: flex;
						align-items: center;
						.label {
							font-size: 24rpx;
							color: #666666;
						}
						.num {
							font-size: 30rpx;
							color: #FF0000;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
		.top3 {
			display: flex;
			padding: 0 40rpx;
			margin-top: 53rpx;
			.top-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				flex: 1;
				background-color: #ffffff;
				border-radius: 30rpx;
				padding: 40rpx 0 30rpx;
				&:nth-child(1), &:nth-child(3) {
					box-shadow:  0px 4rpx 13rpx 0px rgba(0, 0, 0, 0.1);
					// overflow: hidden;
				}
				&.first {
					box-shadow: 0px 3rpx 15rpx 0px #FFC707;
					z-index: 10;
					transform: scale(1.05);
					.avatar-box {
						.icon {
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							width: 127rpx;
							height: 100rpx;
							top: -70rpx;
						}
					}
				}
				.avatar-box {
					position: relative;
					.icon {
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						width: 114rpx;
						height: 93rpx;
						top: -55rpx;
					}
					.avatar {
						width: 83rpx;
						height: 83rpx;
						overflow: hidden;
						border-radius: 50%;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
				.user-name {
					font-size: 28rpx;
					margin-top: 15rpx;
					padding: 0 15rpx;
					text-align: center;
				}
				.grade {
					font-size: 20rpx;
					margin-top: 15rpx;
				}
				.right-num {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 90%;
					height: 40rpx;
					background-image: url(../../static/images/mine/right_bg.png);
					background-size: 100% 100%;
					margin-top: 20rpx;
					.label {
						font-size: 20rpx;
						margin-right: 20rpx;
					}
					.num {
						font-size: 28rpx;
						color: #FF0000;
					}
				}
			}
		}
		.tab-container {
			box-sizing: border-box;
			padding: 0 30rpx;
			margin-top: -60rpx;
			position: relative;
			z-index: 10;
			.tab-box {
				display: flex;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 18rpx 0px rgba(255, 122, 0, 0.43);
				border-radius: 45rpx;
				overflow: hidden;
				.tab-item {
					display: flex;
					justify-content: center;
					align-items: center;
					flex: 1;
					height: 90rpx;
					font-size: 28rpx;
					position: relative;
					&.active {
						color: #FF7A00;
					}
					&::after {
						content: "";
						display: block;
						width: 1rpx;
						height: 50rpx;
						background-color: rgba(0, 0, 0, 0.1);
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
					}
					&:last-child {
						&::after {
							display: none;
						}
					}
				}
			}
		}
		.top-section {
			height: auto;
			.bg {
				width: 100%;
			}
			position: relative;
			.top-content {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				box-sizing: border-box;
				top: 250rpx;
				.desc {
					text-align: center;
					color: #ffffff;
					font-size: 38rpx;
					text-shadow: 0px 2rpx 0px #F48400;
					margin-top: 30rpx;
				}
				.main {
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					padding: 0 30rpx;
					.avatar-container {
						.avatar-content {
							position: relative;
							.rank-status {
								position: absolute;
								width: 101rpx;
								height: 54rpx;
								right: -45rpx;
								top: -30rpx;
							}
							.avatar {
								width: 136rpx;
								height: 136rpx;
								border-radius: 50%;
								overflow: hidden;
								image {
									width: 100%;
									height: 100%;
								}
							}
						}						
					}
					.user-info {
						flex: 1;
						margin-left: 40rpx;
						.user-name {
							font-size: 42rpx;
							color: #ffffff;
							text-shadow: 0px 2rpx 0px #F48400;
						}
						.grade {
							font-size: 28rpx;
							color: #ffffff;
							margin-top: 10rpx;
							text-shadow: 0px 2rpx 0px #F48400;
						}
					}
					.score {
						display: flex;
						flex-direction: column;
						align-items: center;
						.label {
							font-size: 32rpx;
							color: #ffffff;
							text-shadow: 0px 2rpx 0px #F48400;
						}
						.num {
							font-size: 66rpx;
							color: #ffffff;
							text-shadow: 0px 2rpx 0px #F48400;
						}
					}
				}
			}
		}
	}
</style>
