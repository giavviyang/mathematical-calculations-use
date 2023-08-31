<template>
	<view class="index-container">
		<view class="top-section">
			<image class="bg" src="../../static/images/index/bg.png" mode="widthFix"></image>
		</view>
		<view class="page-content">
			<view class="tab-box">
				<view
					v-for="(item, index) in pageData" :key="index"
					@click="tanHandle(index)"
					:class="[currentTab === index ? 'active' : '', 'tab-item']">{{item.name}}</view>
			</view>
			<block v-for="(sec, sec_index) in pageData[currentTab].list">
				<view :key="sec_index" :class="['section', sec.name == '加法' ? 'section-1' : sec.name == '减法' ? 'section-2' : sec.name == '乘法' ? 'section-3' : 'section-4'] ">
					<view class="section-header">
						<view class="title">
							<image v-if="sec.name == '加法'" src="../../static/images/index/addition.png" mode="aspectFill"></image>
							<image v-else-if="sec.name == '减法'" src="../../static/images/index/subtraction.png" mode="aspectFill"></image>
							<image v-else-if="sec.name == '乘法'" src="../../static/images/index/multiplication.png" mode="aspectFill"></image>
							<image v-else-if="sec.name == '除法'" src="../../static/images/index/division.png" mode="aspectFill"></image>
							<view>{{sec.name}}</view>
						</view>
						<view class="cat-box">
							<view
							v-for="(cat, cat_index) in sec.list" :key="cat_index"
							@click="catHandle(sec, cat_index)"
							:class="['cat-item', sec.currentIndex == cat_index ? 'active' : '']">{{cat.name}}</view>
						</view>
					</view>
					<view class="list">
						<view
							v-for="(item, index) in sec.list[sec.currentIndex].list" :key="index"
							@click="itemHandle(item, index)"
							:class="['list-item', item.list && item.list.length > 0 ? 'active' : '']">
							<view class="list-item-header">
								<view v-if="item.lockType != 0" class="lock">
									<image v-if="sec.name == '加法'" src="../../static/images/index/lock1.png" mode=""></image>
									<image v-else-if="sec.name == '减法'" src="../../static/images/index/lock2.png" mode=""></image>
									<image v-else-if="sec.name == '乘法'" src="../../static/images/index/lock3.png" mode=""></image>
									<image v-else-if="sec.name == '除法'" src="../../static/images/index/lock4.png" mode=""></image>
								</view>
								<view class="list-item-name">{{item.name}}</view>
								<view v-if="item.list.length <= 0" class="more"></view>
								<view v-if="item.grade" :class="['score', item.grade < 60 ? 'score1' : item.grade == 100 ? 'score2' : 'score3']">{{item.grade}}</view>
							</view>
							<view class="item-detail">
								<view @click.stop="tipsHandle(val)" v-for="(val, key) in item.list" :key="key" class="detail-item">
									<view v-if="val.lockType != 0" class="lock">
										<image v-if="sec.name == '加法'" src="../../static/images/index/lock1.png" mode=""></image>
										<image v-else-if="sec.name == '减法'" src="../../static/images/index/lock2.png" mode=""></image>
										<image v-else-if="sec.name == '乘法'" src="../../static/images/index/lock3.png" mode=""></image>
										<image v-else-if="sec.name == '除法'" src="../../static/images/index/lock4.png" mode=""></image>
									</view>
									<view class="detail-item-name">
										<view class="text">{{val.name}}</view>
										<view v-if="val.grade" :class="['score', val.grade < 60 ? 'score1' : val.grade == 100 ? 'score2' : 'score3']">{{val.grade}}</view>
									</view>
									<view class="more"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view v-if="isShowModal" class="modal">
			<view class="content-container">
				<image class="bg" src="../../static/images/modal/bg1.png" mode="widthFix"></image>
				<view class="content">
					<image @click.stop="isShowModal = false" class="close" src="../../static/images/modal/close.png" mode="aspectFill"></image>
					<view class="title">{{tipsData.title}}</view>
					<view class="list">
						<view v-for="(item, index) in tipsData.list" :key="key" class="list-item">
							<view class="tips-content">{{item.content}}</view>
							<view class="examples">
								<view class="label">例：</view>
								<view class="example-list">
									<view v-if="item.formulaOne" class="example-item">
										<block v-for="(val, key) in item.formulaOne">
											<view v-if="val == '+' || val == '-' || val=='x' || val == '/' || val == '='" class="symbol">{{val}}</view>
											<view v-else class="num">{{val}}</view>
											
										</block>
									</view>
									<view v-if="item.formulaTwo" class="example-item">
										<block v-for="(val, key) in item.formulaTwo">
											<view v-if="val == '+' || val == '-' || val=='x' || val == '/' || val == '='" class="symbol">{{val}}</view>
											<view v-else class="num">{{val}}</view>											
										</block>
									</view>
								</view>
								<image v-if="item.exampleType == 1" class="dy" src="../../static/images/modal/dy.png" mode="aspectFit"></image>
							</view>
						</view>
					</view>
					<view @click="jumpAnswer" class="confirm">我明白啦</view>
				</view>
			</view>
		</view>
		<view v-if="isShowModal1" class="modal1">
			<view class="content">
				<image @click="isShowModal1 = false" class="close" src="../../static/images/modal/close.png" mode="aspectFit"></image>
				<view class="title">提示</view>
				<view class="name">{{modal1Title}}</view>
				<view v-if="isShowModal1 == 2" class="text-container">
					<view class="text">恭喜你已经掌握这个知识点</view>
					<view class="text">快去练习其他知识点吧</view>
				</view>
				<view v-else-if="isShowModal1 == 1" class="text-container">
					<view class="text">练习超过五次未成功</view>
					<view class="text">不如请教老师吧！</view>
				</view>
			</view>
		</view>
		<RestModal v-if="isShowRestModal" ref="rest" />
	</view>
</template>

<script>
	import RestModal from '../../component/restmodal.vue'
	export default {
		components: {
			RestModal
		},
		data() {
			return {
				currentTab: 0,
				pageData: [],
				isShowModal: false,
				isShowModal1: false,
				modal1Title: '',
				tipsData: {},
				answerId: '',
				isShowRestModal: false
			}
		},
		onLoad() {
			
		},
		onHide () {
			this.isShowRestModal = false
			// this.$refs.rest.hideHandle()
		},
		onShow () {
			this.isShowRestModal = true
			uni.showLoading({
				icon: 'loading',
				title: '加载中'
			})
			this.getPageData()
		},
		methods: {
			jumpAnswer () {
				this.isShowModal = false
				uni.navigateTo({
					url: '/pages/index/answer?type=0&id=' + this.answerId
				})
			},
			// 小数知识点弹窗
			async tipsHandle (val) {
				if (val.lockType != 0) {
					this.isShowModal1 = val.lockType
					this.modal1Title = val.name
					return false
				}
				if (val.dialog == 1) {
					this.answerId = val.id
					const res = await this.$http.post('/applet/training/queryKnowledgePopup', {knowledgeId: val.id})
					console.log(res)
					res.data.list.forEach((item) => {
						if (item.formulaOne) {
							item.formulaOne= item.formulaOne.replace(/\'/g,"").split(',')
						}
						if (item.formulaTwo) {
							item.formulaTwo = item.formulaTwo.replace(/\'/g,"").split(',')
						}
					})
					this.tipsData = res.data
					this.isShowModal = true
				} else {
					uni.navigateTo({
						url: '/pages/index/answer?type=0&id=' + val.id
					})
				}				
			},
			async itemHandle (item, itemIndex) {
				// cat.currentIndex = itemIndex
				// console.log(item)
				if (item.lockType != 0) {
					this.isShowModal1 = item.lockType
					this.modal1Title = item.name
					return false
				}
				if (item.list.length == 0) {
					console.log(item)
					if (item.dialog == 1) {
						this.answerId = item.id
						const res = await this.$http.post('/applet/training/queryKnowledgePopup', {knowledgeId: item.id})
						console.log(res)
						res.data.list.forEach((item) => {
							if (item.formulaOne) {
								item.formulaOne= item.formulaOne.replace(/\'/g,"").split(',')
							}
							if (item.formulaTwo) {
								item.formulaTwo = item.formulaTwo.replace(/\'/g,"").split(',')
							}
						})
						this.tipsData = res.data
						this.isShowModal = true
					} else {
						uni.navigateTo({
							url: '/pages/index/answer?type=0&id=' + item.id
						})
					}
					
				}
			},
			catHandle (sec, catIndex) {
				sec.currentIndex = catIndex
			},
			async getPageData() {
				const res = await this.$http.post('/applet/training/queryTrainData', {})
				uni.hideLoading()
				res.data.forEach(part => {
					part.list.forEach(sec => {
						const tempArr = JSON.parse(JSON.stringify(this.pageData))
						if (tempArr.length > 0) {
							tempArr.forEach(part1 => {
								part1.list.forEach(sec1 => {
									if (sec1.id == sec.id ) {
										sec.currentIndex = sec1.currentIndex
									}
								})
							})
						} else {
							sec.currentIndex = 0
						}					
						sec.list.forEach(cat => {
							cat.currentIndex = ''
						})
					})
				})
				this.pageData = res.data
			},
			tanHandle (index) {
				this.currentTab = index
			}
		}
	}
</script>

<style scoped lang="scss">
	.modal1 {
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
	.modal {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99999;
		.content-container {
			width: 562rpx;
			height: 826rpx;
			position: relative;
			.bg {
				width: 100%;
				height: 100%;
			}
			.content {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				box-sizing: border-box;
				padding-top: 54rpx;
				padding-left: 40rpx;
				padding-right: 40rpx;
				.confirm {
					width: 284rpx;
					height: 73rpx;
					background-image: url(../../static/images/modal/confirm1.png);
					background-size: 100% 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #ffffff;
					font-size: 28rpx;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: 50rpx;
				}
				.close {
					width: 84rpx;
					height: 84rpx;
					position: absolute;
					right: -25rpx;
					top: -25rpx;
				}
				.title {
					text-align: center;
					color: #886646;
					font-size: 36rpx;
					margin-bottom: 30rpx;
				}
				.list {
					max-height: 540rpx;
					overflow-y: auto;
					.list-item {
						box-sizing: border-box;
						padding: 40rpx 0;
						border-bottom: 1rpx solid rgba(136, 102, 70, 0.4);
						&:first-child {
							padding-top: 0;
						}
						&:last-child {
							border-bottom: 0 none;
							padding-bottom: 0
						}
						.examples {
							display: flex;
							align-items: flex-start;
							margin-top: 40rpx;
							justify-content: space-between;
							.example-list {
								flex: 1;
								.example-item {
									display: flex;
									align-items: center;
									margin-top: 20rpx;
									justify-content: space-around;
									&:first-child {
										margin-top: 0;
									}
									.num {
										background-color: #FFEBB4;
										border-radius: 6rpx;
										font-size: 32rpx;
										color: #886646;
										padding: 0 10rpx;
									}
									.symbol {
										margin: 0 10rpx;
									}
								}
							}
							.dy {
								width: 54rpx;
								height: 105rpx;
							}
						}
					}
				}
			}
		}
	}
	.index-container {
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #F3F3F3;
		padding-bottom: 30rpx;
	}
	.top-section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		.bg {
			width: 100%;
		}
	}
	.page-content {
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		padding-top: 180rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		.section {
			background-color: #ffffff;
			border-radius: 30rpx;
			box-sizing: border-box;
			padding: 30rpx 25rpx 40rpx;
			margin-top: 30rpx;
			&.section-2 {
				.section-header {
					.cat-box {
						.cat-item {
							&.active {
								background-image: url(../../static/images/index/cat_bg2.png);
								color: #ffffff;
							}
						}
					}
				}
				.list {
					.list-item {
						background-color: #FFF0E5;
						box-shadow: 0px 4rpx 6rpx 0rpx #FBC8A2;
						.iconfont {
							font-size: 38rpx;
							color: #ff772b;
							font-weight: bold;
						}
						.more {
							background-image: url(../../static/images/index/more2.png);
						}
						&.active {
							.list-item-header {
								border-bottom: 1rpx solid rgba(255, 120, 44, .5);
							}
						}
					}
				}
			}
			&.section-3 {
				.section-header {
					.cat-box {
						.cat-item {
							&.active {
								background-image: url(../../static/images/index/cat_bg3.png);
								color: #ffffff;
							}
						}
					}
				}
				.list {
					.list-item {
						background-color: #F6FFE9;
						box-shadow: 0px 4rpx 6rpx 0px #BAD692;
						.iconfont {
							font-size: 38rpx;
							color: #97ce47;
							font-weight: bold;
						}
						.more {
							background-image: url(../../static/images/index/more3.png);
						}
						&.active {
							.list-item-header {
								border-bottom: 1rpx solid rgba(151, 206, 71, .5);
							}
						}
					}
				}
			}
			&.section-4 {
				.section-header {
					.cat-box {
						justify-content: space-between;
						width: 100%;
						flex-wrap: wrap;
						.cat-item {
							&.active {
								background-image: url(../../static/images/index/cat_bg4.png);
								background-size: auto 100%;
								color: #ffffff;
							}
						}
					}
				}
				.list {
					.list-item {
						background-color: #FFF6D7;
						box-shadow: 0px 4rpx 6rpx 0px #E0C97A;
						.iconfont {
							font-size: 38rpx;
							color: #ffca10;
							font-weight: bold;
						}
						.more {
							background-image: url(../../static/images/index/more4.png);
						}
						&.active {
							.list-item-header {
								border-bottom: 1rpx solid rgba(255, 202, 16, .5);
							}
						}
					}
				}
			}
			.section-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				.title {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 38rpx;
					image {
						width: 72rpx;
						height: 72rpx;
						// margin-right: 6rpx;
						transform: translateX(-8rpx);
					}
					view {
						padding-bottom: 10rpx;
					}
				}
				.cat-box {
					display: flex;
					align-items: center;
					.cat-item {
						min-width: 121rpx;
						padding: 0 20rpx;
						height: 46rpx;
						background-size: 100% 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #666666;
						font-size: 25rpx;
						box-sizing: border-box;
						padding-bottom: 2rpx;
						overflow: hidden;
						border-radius: 23rpx;
						overflow: hidden;
						&.active {
							background-image: url(../../static/images/index/cat_bg1.png);
							color: #ffffff;
						}
					}
				}
			}
			.list {
				.list-item {
					background: #ECF8FF;
					box-shadow: 0px 4rpx 6rpx 0px #A9DFFF;
					border-radius: 21rpx;
					margin-top: 27rpx;
					box-sizing: border-box;
					padding: 0 30rpx;
					&:first-child {
						// margin-top: 0;
					}
					&.active {
						.list-item-header {
							.list-item-name {
								margin-right: 0;
							}
						}
					}
					.list-item-header {
						min-height: 100rpx;
						padding-top: 20rpx;
						padding-bottom: 20rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: relative;
						
						.lock {
							width: calc(100% + 60rpx);
							position: absolute;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							left: -30rpx;
							z-index: 10;
							border-radius: 20rpx;
							top: 0;
							background-color: rgba(0, 0, 0, 0.18);
							image {
								width: 80rpx;
								height: 80rpx;
							}
						}
						.list-item-name {
							font-size: 30rpx;
							flex: 1;
							text-align: justify;
							margin-right: 20rpx;
						}
						position: relative;
						.score {
							position: absolute;
							background-color: #ffa41c;
							font-size: 20rpx;
							color: #ffffff;
							display: flex;
							justify-content: center;
							align-items: center;
							width: 60rpx;
							line-height: 28rpx;
							border-radius: 14rpx 14rpx 14rpx 0;
							right: -30rpx;
							top: -10rpx;
							z-index: 10;
							&.score1 {
								background-color: #54da5d;
							}
							&.score2 {
								background: linear-gradient(312deg, #FF2F01 0%, #FF6A2A 100%);
								// background-color: ;
								background-image: url(../../static/images/index/score_bg1.png);
								background-size: 100% 100%;
							}
							&.score3 {
								background-image: url(../../static/images/index/score_bg2.png);
								background-size: 100% 100%;
							}
						}
					}
					// .iconfont {
					// 	font-size: 38rpx;
					// 	color: #23a8ff;
					// 	font-weight: bold;
					// }
					.more {
						width: 17rpx!important;
						height: 25rpx!important;
						background-image: url(../../static/images/index/more1.png);
						background-size: 100% 100%!important;
					}
					.item-detail {
						// overflow: hidden;
						// max-height: 0;
						.detail-item {
							display: flex;
							align-items: center;
							justify-content: space-between;
							min-height: 100rpx;
							position: relative;
							width: 100%;
							box-sizing: border-box;
							padding-top: 10rpx;
							padding-bottom: 10rpx;
							.lock {
								width: calc(100% + 60rpx);
								position: absolute;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;
								left: -30rpx;
								z-index: 10;
								border-radius: 20rpx;
								top: 0;
								background-color: rgba(0, 0, 0, 0.18);
								image {
									width: 80rpx;
									height: 80rpx;
								}
							}
							.detail-item-name {
								font-size: 28rpx;
								color: #333333;
								display: flex;
								align-items: center;
								margin-right: 20rpx;
								flex: 1;
								text-align: justify;
								.score {
									background-color: #ffa41c;
									font-size: 20rpx;
									color: #ffffff;
									display: flex;
									justify-content: center;
									align-items: center;
									width: 60rpx;
									line-height: 28rpx;
									border-radius: 14rpx 14rpx 14rpx 0;
									margin-left: 30rpx;
									&.score1 {
										background-color: #54da5d;
									}
									&.score2 {
										background: linear-gradient(312deg, #FF2F01 0%, #FF6A2A 100%);
									}
								}
							}
						}
					}
					&.active {
						.list-item-header {
							border-bottom: 1rpx solid rgba(35, 168, 255, 0.5);
							> .iconfont {
								display: none;
							}
						}
						.item-detail {
							max-height: 100vh;
						}
					}
				}
			}
		}
		.tab-box {
			display: flex;
			justify-content: center;
			align-items: center;
			.tab-item {
				width: 123rpx;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				color: #ffffff;
				&.active {
					background-image: url(../../static/images/index/tab_active.png);
					background-size: 100% 100%;
					color: #35B2FF;
				}
			}
		}
	}
	
</style>
