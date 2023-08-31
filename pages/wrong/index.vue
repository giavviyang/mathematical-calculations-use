<template>
	<view class="wrong-index" :style="{paddingTop: statusBarHeight + 45 + 'px'}">
		<CustomerTopBar title="错题本" color="#ffffff" :canBack="false" />
		<view class="tab-container">
			<view class="tab-box">
				<view
					@click="catHandle(cat.numfieldId)"
					v-for="(cat, catIndex) in numFields" :key="catIndex"
					:class="[cat.numfieldId == numfieldId ? 'active' : '', 'tab-item']">
					<view class="text">{{cat.numfieldName}}</view>
				</view>
			</view>
		</view>
		<view class="triangle-up">
			<view class="triangle"></view>
		</view>
		<view class="page-content">
			<view v-if="pageData.list && pageData.list.length == 0" class="nodata-box">
				<image v-if="pageData.isError == '没有'" src="../../static/images/wrong/nodata2.png" mode="aspectFit"></image>
				<image  v-else src="../../static/images/wrong/nodata1.png" mode="aspectFit"></image>
				<view v-if="pageData.isError == '没有'" class="text">
					<view>你还没有练习数据</view>
					<view>抓紧练习吧</view>
				</view>
				<veiw v-else class="text">
					<view class="">太棒了</view>
					<view>您消除了所有的错题哟</view>
				</veiw>
				
			</view>
			<view v-else-if="pageData && pageData.list && pageData.list.length > 0" class="list-container">
				<view v-for="(item, index) in pageData.list" :key="index" class="list-item">
					<view class="cat-box">
						<image :src="item.imgAddr" mode=""></image>
						<view class="cat-name">{{item.fullName}}</view>
					</view>
					<view
						v-for="(knowledge, knowledgeIndex) in item.knowledgeDTOs" :key="knowledgeIndex"
						:class="['list-box', knowledge.isShow ? 'active' : '']">
						<view @click.stop="showHandle(knowledge)" class="list-header">
							<view class="title">{{knowledge.classificationNickname || knowledge.classificationMsg || ''}}</view>
							<view class="numbox">
								<view class="num">{{knowledge.knowledgeCount}}道</view>
								<image src="../../static/images/wrong/arrow.png" mode="aspectFill"></image>
							</view>
						</view>
						<view class="list-content">
							<view v-for="(error, errorIndex) in knowledge.errorList" :key="errorIndex" class="list-content-item">
								<view class="formula-box">
									<view class="formula-item">
										<view class="formula"><Formula :str="error.error" /></view>
										<image src="../../static/images/index/answer/wrong.png" mode="aspectFit"></image>
									</view>
									<view class="formula-item">
										<view class="formula"><Formula :str="error.right"/></view>
										<image src="../../static/images/wrong/right.png" mode="aspectFit"></image>
									</view>
								</view>
								<view class="reason">
									<view class="label">诊断</view>
									<view class="desc">{{error.text}}</view>
								</view>
							</view>
							<view :class="['repeat', knowledge.isLock == 0 ? '' : 'locked']">
								<view @click="jumpAnswer(knowledge)" class="text">重复练习</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<RestModal v-if="isShowRestModal" ref="rest" />
		<view v-if="isShowModal" class="modal">
			<view class="content">
				<image @click="isShowModal = false" class="close" src="../../static/images/modal/close.png" mode="aspectFit"></image>
				<view class="title">提示</view>
				<view class="name">{{modalData.classificationNickname || modalData.classificationMsg || ''}}</view>
				<view v-if="modalData.isLock == 2" class="text-container">
					<view class="text">恭喜你已经掌握这个知识点</view>
					<view class="text">快去练习其他知识点吧</view>
				</view>
				<view v-else-if="modalData.isLock == 1" class="text-container">
					<view class="text">练习超过五次未成功</view>
					<view class="text">不如请教老师吧！</view>					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import app from '../../App.vue'
	import CustomerTopBar from '../../component/customer-top-bar/index.vue'
	import RestModal from '../../component/restmodal.vue'
	import Formula from './components/formula.vue'
	export default {
		components: {
			CustomerTopBar,
			RestModal,
			Formula
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				numFields: [],
				numfieldId: null,
				pageData: {},
				isShowModal: false,
				modalData: null,
				isShowRestModal: false
			}
		},
		onShow () {
			this.isShowRestModal = true
			uni.showLoading({
				title: '加载中'
			})
			this.numField ()
		},
		onHide () {
			this.isShowRestModal = false
			// this.$refs.rest.hideHandle()
		},
		methods: {
			jumpAnswer (knowledge) {
				console.log(knowledge)
				if (knowledge.isLock != 0) {
					this.modalData = knowledge
					this.isShowModal = true
				} else {
					uni.navigateTo({
						url: '/pages/index/answer?type=2&id=' + knowledge.knowledgeId
					})
				}
				
			},
			showHandle (knowledge) {
				knowledge.isShow = !knowledge.isShow
			},
			catHandle (numfieldId) {
				this.numfieldId = numfieldId
				uni.showLoading({
					icon: 'loading',
					title: '加载中'
				})
				this.wrongQuestion()
			},
			async numField () {
				const res = await this.$http.post('/applet/wrongQuestion/queryNumfield', {})
				console.log(res)
				this.numFields = res.data
				if (!this.numfieldId) {
					this.numfieldId = res.data[0].numfieldId
				}
				this.wrongQuestion()
			},
			async wrongQuestion () {
				const res = await this.$http.post('/applet/wrongQuestion/queryListByDictId', {dictId: this.numfieldId})
				// console.log(res, 123)
				res.data.list.forEach(item => {
					item.knowledgeDTOs.forEach(val => {
						val.isShow = false
					})
				})
				this.pageData = {}
				setTimeout(() => {
					this.pageData = res.data
					uni.hideLoading()
				})
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
		z-index: 99999;
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
	.wrong-index {
		background-image: url(../../static/images/wrong/wrong_bg.png);
		background-repeat: no-repeat;
		background-size: 100% auto;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		.triangle-up {
			margin-top: 50rpx;
			padding-left: 90rpx;
			.triangle {
				width: 0;
				height: 0;
				border-left: 20rpx solid transparent;
				border-right: 20rpx solid transparent;
				border-bottom: 20rpx solid #ffffff;
			}
		}
		.page-content {
			background-color: #FFFFFF;
			border-radius: 30rpx 30rpx 0 0;
			
			padding-top: 40rpx;
			flex: 1;
			overflow: hidden;
			box-sizing: border-box;
			.nodata-box {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image {
					width: 300rpx;
					height: 300rpx;
				}
				.text {
					text-align: center;
					font-size: 32rpx;
					color: #666666;
					margin-top: 20rpx;
				}
			}
			.list-container {
				height: 100%;
				box-sizing: border-box;
				padding: 0 30rpx;
				overflow: auto;
				.list-item {
					margin-top: 30rpx;
					&:first-child {
						margin-top: 0;
					}
					.cat-box {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						image {
							vertical-align: middle;
							width: 56rpx;
							height: 56rpx;
							margin-right: 6rpx;
							transform: translateY(3rpx);
						}
						font-size: 36rpx;
					}
					.list-box {
						margin-top: 45rpx;
						background-color: #ECF8FF;
						border-radius: 20rpx;
						box-sizing: border-box;
						padding: 30rpx 20rpx 30rpx;
						&.active {
							.list-header {
								.numbox {
									image {
										transform: rotateZ(0deg);
									}
								}
							}
							.list-content {
								height: auto;
							}
						}
						.list-header {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.title {
								font-size: 32rpx;
								flex: 1;
								margin-right: 15rpx;
								text-align: justify;
							}
							.numbox {
								display: flex;
								align-items: center;
								.num {
									font-size: 32rpx;
								}
								image {
									width: 32rpx;
									height: 32rpx;
									margin-left: 9rpx;
									transform: rotateZ(180deg);
								}
							}
						}
						.list-content {
							height: 0;
							overflow: hidden;
							transition: all .5s;
							.repeat {
								width: 210rpx;
								height: 64rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border-radius: 32rpx;
								overflow: hidden;
								background-color: #24a9ff;
								margin: 30rpx auto 0;
								&.locked {
									background-color: #DCDCDC;
									.text {
										background-color: #b2b2b2;
									}
								}
								.text {
									width: 100%;
									height: 100%;
									border-radius: 32rpx;
									background-color: #24A9FF;
									border: 1rpx solid rgba(255, 255, 255, .5);
									transform: translateY(-5rpx);
									display: flex;
									justify-content: center;
									align-items: center;
									color: #FFFFFF;
									font-size: 32rpx;
								}
							}
							.list-content-item {
								background-color: #ffffff;
								box-sizing: border-box;
								border-radius: 20rpx;
								padding: 0 30rpx;
								margin-top: 20rpx;
							}
							.formula-box {
								padding: 30rpx 0;
								display: flex;
								align-items: center;
								justify-content: space-between;
								border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
								flex-wrap: wrap;
								.formula-item {
									display: flex;
									align-items: center;
									.formula {
										font-size: 38rpx;
									}
									image {
										width: 50rpx;
										height: 50rpx;
										vertical-align: middle;
										margin-left: 10rpx;
									}
								}
							}
							.reason {
								display: flex;
								padding: 25rpx 0;
								.label {
									width: 72rpx;
									height: 35rpx;
									background: linear-gradient(180deg, #FE8686 0%, #FF0000 100%);
									border-radius: 5px;
									display: flex;
									justify-content: center;
									align-items: center;
									color: #ffffff;
									font-size: 24rpx;
								}
								.desc {
									color: #999999;
									font-size: 28rpx;
									margin-left: 20rpx;
									text-align: justify;
								}
							}
						}
					}
				}
			}
		}
		.tab-container {
			box-sizing: border-box;
			padding: 40rpx 40rpx 0;
		}
		.tab-box {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 60rpx;
			width: 399rpx;			
			background-color: rgba(255, 255, 255, .5);
			border-radius: 30rpx;
			.tab-item {
				flex: 1;
				height: 100%;
				border-radius: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				color: #ffffff;
				overflow: hidden;
				.text {
					width: 100%;
					height: 100%;
					border-radius: 30rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				&.active {
					.text {
						border: 1rpx solid rgba(255, 255, 255, .5);
						background-color: #ffd101;
						transform: translateY(-7rpx);
						padding-top: 4rpx;
					}
					background-color: #ffb802;
				}
			}
		}
	}
</style>
