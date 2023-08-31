<template>
	<view v-if="result.title" :style="{paddingTop: statusBarHeight + 45 + 'px'}" class="result-container">
		<CustomerTopBar />
		<view class="stars">
			<view class="start-item">
				<image v-if="result.fraction >= 80" src="../../static/images/index/answer/start2.png" mode=""></image>
			</view>
			<view class="start-item">
				<image v-if="result.fraction >= 90" src="../../static/images/index/answer/start2.png" mode=""></image>
			</view>
			<view class="start-item">
				<image v-if="result.fraction == 100" src="../../static/images/index/answer/start2.png" mode=""></image>
			</view>
		</view>
		<view class="userbox">
			<image :style="{opacity: result.fraction >= 80 ? 1 : 0}" class="bg" src="../../static/images/index/answer/result_bg3.png" mode="widthFix"></image>
			<view class="avatar-container">
				<image class="frame" v-if="userInfo.portraitFrame" :src="userInfo.portraitFrame" mode="aspectFit"></image>
				<view :class="[result.fraction < 80 ? 'no' : '', 'score']">{{result.fraction}}分</view>
				<view class="avatar-content">
					<view class="avatar">
						<image :src="userInfo.studentPortrait" mode="aspectFill"></image>
					</view>
				</view>
				<view class="result-title">
					<image v-if="result.fraction >= 80" src="../../static/images/index/answer/result_bg2.png" mode="aspectFit"></image>
					<image v-else src="../../static/images/index/answer/result_bg1.png" mode="aspectFit"></image>
					<view v-if="type == 1 || type.indexOf(1) > -1" class="result-title-content">{{result.fraction >= 80 ? '闯关成功' : '闯关失败'}}</view>
					<view v-else class="result-title-content">					
						<text v-if="result.title.length < 15">{{result.fraction >= 80 ? '掌握' : '没有掌握'}}{{result.title}}</text>
						<TextRoll v-else :text="result.fraction >= 80 ? '掌握' + result.title : '没有掌握' + result.title"></TextRoll>
					</view>
				</view>
			</view>
			<view class="user-name">{{userInfo && userInfo.studentNickname}}同学</view>
		</view>
		<view class="result-box">
			<view class="title">{{type == 1 ? '本次闯关情况' : type.indexOf('error') > -1 ? '修改错题情况' : '本次练习情况'}}</view>
			<view class="result-list">
				<view v-if="type.indexOf('error') == -1" class="result-item">
					<view class="label">金币</view>
					<image src="../../static/images/index/answer/icon.png" mode="aspectFit"></image>
					<view class="desc">{{result.coins}}</view>
				</view>
				<view class="result-item">
					<view class="label">时长</view>
					<image src="../../static/images/index/answer/icon2.png" mode="aspectFit"></image>
					<view class="desc">{{result.duration}}秒</view>
				</view>
				<view class="result-item">
					<view class="label">正确率</view>
					<image src="../../static/images/index/answer/icon3.png" mode="aspectFit"></image>
					<view class="desc">{{(result.correctRate * 100).toFixed(0)}}%</view>
				</view>
				<view class="result-item">
					<view class="label">均速</view>
					<image src="../../static/images/index/answer/icon4.png" mode="aspectFit"></image>
					<view class="desc">{{result.average}}秒</view>
				</view>
			</view>
			<view v-if="type.indexOf('error') == -1" class="rank-list">
				<view class="rank-item">正确率击败 <text>{{(result.correctRateRanking * 100).toFixed(0)}}%</text>的同学</view>
				<view class="rank-item">用时击败 <text>{{(result.timeRanking * 100).toFixed(0)}}%</text>的同学</view>
			</view>
		</view>
		<view v-if="result.list && result.list.length > 0" class="wrong-container">
			<view class="title">这些题目没作对哦！</view>
			<view v-for="(item, index) in result.list" :key="index" class="wrong-list">
				<view class="wrong-number">{{item.number}}道</view>
				<view v-for="(val, key) in item.jsonArray" :key="key" class="wrong-item">					
					<view class="wrong-name">{{item.name}}</view>
					<view class="formular-box">
						<view class="formular"><Formula :str="val.errorSubject" /></view>
						<image src="../../static/images/index/answer/wrong.png" mode="aspectFit"></image>
					</view>
					<view class="reason">
						<view class="label">诊断</view>
						<view class="desc">{{val.diagnosis}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isShowModal && type != 3 && type.indexOf('error') == -1" class="modal">
			<view class="content">
				<image @click="isShowModal = false" class="close" src="../../static/images/modal/close.png" mode="aspectFit"></image>
				<view class="title">提示</view>
				<view class="name">{{result.title}}</view>
				<view v-if="result.isLock == 2" class="text-container">
					<block v-if="type == 1">
						<view class="text">你已闯关成功</view>
						<view class="text">不如去闯关其它关卡吧！</view>
					</block>
					<block v-else>
						<view class="text">恭喜你已经掌握这个知识点</view>
						<view class="text">快去练习其他知识点吧</view>
					</block>
				</view>
				<view v-else-if="result.isLock == 1" class="text-container">
					<block v-if="type == 1">
						<view class="text" style="font-size: 30rpx; line-height: 48rpx; padding: 0 20rpx;">5次未通过, 不如请教老师{{result.classification.join(',')}}！</view>
					</block>
					<block v-else>
						<view class="text">练习超过五次未成功</view>
						<view class="text">不如请教老师吧！</view>
					</block>					
				</view>
			</view>
		</view>
		<view v-if="type == 1" class="actions">
			<view @click="refreshHandle" class="action-item back">重新闯关</view>
			<view @click="reDo" v-if="result.fraction < 100" class="action-item back">重做错题</view>
			<view @click="nextHandle" v-if="result.fraction >= 80 && result.nextId" class="action-item refresh">下一关卡</view>			
		</view>		
		<view v-else-if="type ==3" class="actions">
			<template>
				<view @click="backHandle" v-if="result.fraction >= 80" class="action-item back">返回列表</view>
				<view @click="reDo" v-if="result.fraction < 100" class="action-item back">重做错题</view>
				<view @click="refreshHandle" class="action-item refresh">刷新成绩</view>
			</template>			
		</view>
		<view v-else-if="type.toString().indexOf('error') > -1" class="actions">
			<template>
				<view @click="backHandle" class="action-item back">返回列表</view>
			</template>			
		</view>
		<view v-else class="actions">
			<view @click="backHandle" v-if="result.fraction >= 80" class="action-item back">返回列表</view>
			<view @click="reDo" v-if="result.fraction < 100 && type != 2" class="action-item back">重做错题</view>
			<view @click="refreshHandle" class="action-item refresh">刷新成绩</view>
		</view>
		<RestModal ref="rest" />
	</view>
</template>

<script>
	import app from '../../App.vue'
	import CustomerTopBar from '../../component/customer-top-bar/index.vue'
	import RestModal from '../../component/restmodal.vue'
	import TextRoll from '../../components/beyondGod-roll/text-roll.vue'
	import Formula from './components/formula.vue'
	export default {
		components: {
			CustomerTopBar,
			RestModal,
			TextRoll,
			Formula
		},		
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				params: {},
				type: '',
				result: {},
				userInfo: {},
				isShowModal: false
			}
		},
		onLoad (options) {
			console.log(77777777777, options)
			this.params = JSON.parse(options.params)
			this.type = options.type
			this.getUserInfo()
			this.getResult()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			reDo () {
				uni.setStorageSync('errorList', JSON.stringify(this.result.errorResultObject))
				uni.redirectTo({
					url: '/pages/index/answer?type=error-'+this.type + '&id=' + this.result.errorResultObject.id
				})
			},
			refreshHandle () {
				if (this.type == 3) {
					uni.redirectTo({
						url: '/pages/index/answer?type=' + this.type + '&id=' + this.result.id
					})
				} else {
					if (this.result.isLock != 0) {
						this.isShowModal = true
					} else {
						uni.redirectTo({
							url: '/pages/index/answer?type=' + this.type + '&id=' + this.result.id
						})
					}
				}
								
			},
			nextHandle () {
				uni.redirectTo({
					url: '/pages/index/answer?type=' + this.type + '&id=' + this.result.nextId
				})
			},
			backHandle () {
				uni.navigateBack()
			},
			async getUserInfo () {
				const res = await this.$http.post('/applet/getStudentsInfo', {})
				this.userInfo = res.data
			},
			async getResult () {
				uni.showLoading({
					title: '结果生成中'
				})
				// this.type = 1
				// const json = {"11110":"4","11112":"3","11113":"4","11115":"6","11117":"8","11119":"2","11120":"14","11121":"14","11124":"17","11125":"16","11126":"19","11129":"12","11130":"12","11131":"13","11132":"14","11133":"15","11134":"16","11135":"17","11136":"18","11137":"19"}
				// this.params = {
				// 	id: 14
				// 	,json: JSON.stringify(json)
				// 	,second: 42
				// }
				if (this.type == 1) {
					const res = await this.$http.post('/applet/breakThrough/submitAnswerResult', this.params)
					console.log(res)
					uni.hideLoading()
					this.result = res.data
				} else if (this.type == 3) {
					const res = await this.$http.post('/applet/classRoomTest/submitAnswerResult', this.params)
					console.log(res)
					uni.hideLoading()
					res.data.fraction = res.data.score
					res.data.correctRateRanking = res.data.correctRateRanking / 100
					res.data.correctRate = res.data.correctRate / 100
					res.data.timeRanking = res.data.timeRanking / 100
					this.result = res.data
				} else if (this.type.indexOf('error') > -1) {
					const errorType = this.type.split('-')[1]
					console.log('errorType: ', errorType)
					if (errorType == 3) {
						const res = await this.$http.post('/applet/classRoomTest/submitErrorAnswerResult', this.params)
						console.log(res)
						res.data.fraction = res.data.score
						res.data.correctRate = res.data.correctRate / 100
						uni.hideLoading()
						this.result = res.data
					} else if (errorType == 0) {
						const res = await this.$http.post('/applet/training/submitErrorAnswerResult', this.params)
						console.log(res)
						// res.data.fraction = res.data.score
						// res.data.correctRate = res.data.correctRate / 100
						uni.hideLoading()
						this.result = res.data
					} else if (errorType == 1) {
						const res = await this.$http.post('/applet/breakThrough/submitErrorAnswerResult', this.params)
						console.log(res)
						// res.data.fraction = res.data.score
						// res.data.correctRate = res.data.correctRate / 100
						uni.hideLoading()
						this.result = res.data
					}
				} else {
					const res = await this.$http.post('/applet/training/submitAnswerResult', this.params)
					console.log(res)
					uni.hideLoading()
					this.result = res.data
				} 
				if (this.result.isLock != 0) {
					this.isShowModal = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.actions {
		position: fixed;
		z-index: 9999;
		background-color: #ffffff;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 25rpx;
		justify-content: center;
		align-items: center;
		display: flex;
		width: 100%;
		.back {
			width: 210rpx;
			height: 72rpx;
			border-radius: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1rpx solid #24A9FF;
			color: #24A9FF;
			font-size: 28rpx;
			margin-right: 30rpx;
		}
		.refresh {
			width: 430rpx;
			height: 72rpx;
			border-radius: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #24A9FF;
			color: #ffffff;
			font-size: 28rpx;
		}
	}
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
	@keyframes starScale {
		from {
			width: 0;
			height: 0
		}
		to {
			width: 100%;
			height: 100%;
		}
	}
	.result-container {
		width: 100vw;
		min-height: 100vh;
		box-sizing: border-box;
		background-image: url(../../static/images/index/answer/result_bg.png);
		background-color: #fada63;
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-position: center top; 
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 162rpx;
		.userbox {
			top: -220rpx;
			width: 100%;
			.bg {
				width: 100%;
				vertical-align: middle;
			}
			position: relative;
			.avatar-container {
				position: absolute;
				left: 50%;
				margin-left: -100rpx;
				top: 240rpx;
				.score {
					width: 94rpx;
					height: 60rpx;
					color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					background: linear-gradient(314deg, #FF0000 0%, #FFB6B6 100%);
					box-shadow: 0px 4rpx 0px 0px #DF0000;
					border-radius: 15rpx;
					position: absolute;
					right: -60rpx;
					top: 5rpx;
					&.no {
						background: linear-gradient(314deg, #00CA39 0%, #5FF35C 100%);
						box-shadow: 0px 4rpx 0px 0px #02A92B;
					}
				}
				.frame {
					width: 128%;
					height: 128%;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: -29rpx;
				}
				.avatar-content {
					.avatar {
						width: 200rpx;
						height: 200rpx;
						border: 2px solid #ffffff;
						border-radius: 50%;
						overflow: hidden;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}
				.result-title {
					position: absolute;
					bottom: -140rpx;
					left: 50%;
					transform: translateX(-50%);
					image {
						width: 100vw;
						height: 164rpx;
					}
					.result-title-content {
						position: absolute;
						left: 50%;
						transform: translateX(-50%) translateY(-50%);
						top: 50%;
						font-size: 32rpx;
						color: #ffffff;
						width: 70%;
						text-align: center;
						padding-bottom: 63rpx;
					}
				}
			}
			.user-name {
				text-align: center;
				margin-top: 60rpx;
				font-size: 32rpx;
				color: #666666;
			}
		}
		.result-box {
			margin-top: -180rpx;
			box-sizing: border-box;
			background-color: #FAF3D7;
			border-radius: 30rpx;
			padding: 0 30rpx 30rpx;
			.title {
				font-size: 32rpx;
				padding: 30rpx 0;
				text-align: center;
			}
			.rank-list {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 30rpx;
				.rank-item {
					flex: 1;
					height: 50rpx;
					border-radius: 25rpx;
					background-color: #FFEBB4;
					border: 1rpx solid #F9C639;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: #333;
					&:first-child {
						margin-right: 30rpx;
					}
				}
			}
			.result-list {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.result-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					background-color: #ffffff;
					flex: 1;
					border-radius: 30rpx;
					padding: 10rpx 0;
					margin-right: 20rpx;
					&:last-child {
						margin-right: 0;
					}
					image {
						width: 76rpx;
						height: 76rpx;
						margin-top: 5rpx;
					}
					.label {
						font-size: 26rpx;
					}
					.desc {
						margin-top: 10rpx;
						font-size: 26rpx;
						color: #666666;
					}
				}
			}
		}
		.wrong-container {
			box-sizing: border-box;
			border-radius: 30rpx;
			background-color: #FAF3D7;
			padding: 0 20rpx 30rpx;
			margin-top: 30rpx;
			.title {
				text-align: center;
				font-size: 32rpx;
				padding: 30rpx 0;
			}
			.wrong-list {
				overflow: hidden;
				background-color: #ffffff;
				border-radius: 30rpx;
				position: relative;
				.wrong-number {
					position: absolute;
					right: 0;
					top: 35rpx;
					height: 40rpx;
					background-color: #FADA63;
					border-radius: 20rpx 0 0 20rpx;
					font-size: 30rpx;
					padding: 0 15rpx;
					color: #ffffff;
				}
				.wrong-item {
					box-sizing: border-box;
					padding: 30rpx;
					border-bottom:  1rpx solid rgba(0, 0, 0, 0.1);
					&:last-child {
						border-bottom: 0 none;
					}
					.wrong-name {
						font-size: 32rpx;
					}
					.formular-box {
						display: flex;
						align-items: center;
						margin-top: 25rpx;
						.formular {
							font-size: 52rpx;
							margin-right: 15rpx;
						}
						image {
							width: 54rpx;
							height: 54rpx;
						}
					}
					.reason {
						display: flex;
						align-items: center;
						margin-top: 40rpx;
						.label {
							background: linear-gradient(180deg, #FE8686 0%, #FF0000 100%);
							border-radius: 5rpx;
							width: 72rpx;
							height: 35rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #ffffff;
							font-size: 24rpx;
						}
						.desc {
							color: #999999;
							font-size: 26rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
		.stars {
			display: flex;
			justify-content: center;
			align-items: flex-end;
			position: relative;
			z-index: 10;
			.start-item {
				width: 111rpx;
				height: 111rpx;
				background-image: url(../../static/images/index/answer/start1.png);
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 0;
					height: 0;
					animation: starScale .5s .5s forwards;
				}
				&:nth-child(2) {
					width: 134rpx;
					height: 134rpx;
					transform: translateY(-32rpx);
					margin: 0 50rpx;
				}
			}
		}
	}
</style>
