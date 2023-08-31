<template>
	<view class="mine-container">
		<view @click="jumpHandle('/pages/mine/userInfo')" class="userinfo-box">
			<view class="avatar-container">
				<view class="avatar-content">
					<image class="frame" v-if="userInfo.portraitFrame" :src="userInfo.portraitFrame" mode="aspectFit"></image>
					<view class="avatar">
						<image :src="`${studentPortrait}&newDate=${new Date().getTime()}`" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<view class="info-box">
				<view class="top">
					<view class="name">{{userInfo.studentNickname}}</view>
					<view class="grade">{{userInfo.studentGrade}}</view>
				</view>
				<view class="bottom">
					<view class="bottom-item">
						<view class="level">{{userInfo.diligence}}</view>
						<view class="text">勤奋之星</view>
					</view>
					<view class="bottom-item">
						<view class="level">{{userInfo.progress}}</view>
						<view class="text">进步之星</view>
					</view>
				</view>
			</view>
			<view class="play">
				<image src="../../static/images/mine/play.png" mode="widthFix"></image>
			</view>
		</view>
		<view v-if="userInfo.studentId" class="charts-container">
			<view class="title">成长曲线</view>
			<view class="charts-box">
			  <qiun-data-charts
				type="mix"
				canvasId="mycharts"
				timing="easeOut"
				duration="1000"
				background="#F5F5F5"
				:canvas2d="true"
			    :echartsH5="true"
				:ontouch="true"		    
			    :chartData="chartData"			    
				:dataLabel="false"
				:disableScroll="true"				
				tooltipFormat="tooltipDemo1"				      
				fontColor="#000000"
				:opts="{
					legend: {
						show: true,
						position: 'top',
						float: 'right',
						fontSize: 12
					},
					padding: [0, 0, 0, 0],
					fontSize: 12,
					dataLabel: false,
					enableScroll: true,
					xAxis: {
						axisLine: true,
						axisLineColor: '#2DAFFF',
						fontSize: 12,
						itemCount: 6,
					},
					yAxis: {
						showTitle: false,
						disableGrid: true,
						data: [
							{position: 'left',title: '总练习题数', fontSize: 12, axisLineColor: '#2DAFFF'},
							{position: 'right',title: '正确率',textAlign: 'left', disabled: true, disableGrid: true, format: '12121'}
						],
						extra: {
							column: {
								type: 'column',
								width: 10
							}
						}
					}
				}"
			  />
			</view>
		</view>
		<view class="count-container">
			<view class="count-item">
				<view class="num dl">{{userInfo.cumulativeLogin}}</view>
				<view class="text">累计登录</view>
			</view>
			<view class="count-item">
				<view class="num">{{userInfo.knowledgeNumber}}</view>
				<view class="text">已掌握知识点</view>
			</view>
			<view class="count-item">
				<view class="num">{{userInfo.levelNumber}}</view>
				<view class="text">闯过关卡</view>
			</view>
		</view>
		<view class="pannel pannel-1">
			<view @click="jumpHandle('/pages/classroom/index')" class="item">
				<view class="label">
					<image src="../../static/images/mine/icon6.png" mode="widthFix"></image>
				</view>
				<view class="text">课堂测试</view>
				<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="pannel pannel-1">
			<view @click="jumpHandle('/pages/mine/rank')" class="item">
				<view class="label">
					<image src="../../static/images/mine/icon1.png" mode="widthFix"></image>
				</view>
				<view class="text">排行榜</view>
				<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
			</view>
			<view @click="jumpHandle('/pages/mine/message')" class="item">
				<view class="label">
					<image src="../../static/images/mine/icon2.png" mode="widthFix"></image>
				</view>
				<view class="text">消息通知</view>
				<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
			</view>
			<view @click="jumpHandle('/pages/mine/pointMall')" class="item">
				<view class="label">
					<image src="../../static/images/mine/icon3.png" mode="widthFix"></image>
				</view>
				<view class="text">金币商城</view>
				<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="pannel pannel-1">
			<view class="item">
				<view class="label">
					<image v-if="soundSwitch" src="../../static/images/mine/icon4.png" mode="widthFix"></image>
					<image v-else src="../../static/images/mine/icon5.png" mode="widthFix"></image>
				</view>
				<view class="text">音效开关</view>
				<switch @change="soundSwitchHandle" color="#2DAFFF" style="transform: scale(.8,.8);" :checked="soundSwitch" />
			</view>
			<view class="item">
				<view class="label">
					<image v-if="bgMusicSwitch" src="../../static/images/mine/icon4.png" mode="widthFix"></image>
					<image v-else src="../../static/images/mine/icon5.png" mode="widthFix"></image>
				</view>
				<view class="text">背景音开关</view>
				<switch @change="bgMusicSwitchHandle" color="#2DAFFF" style="transform: scale(.8,.8);" :checked="bgMusicSwitch" />
			</view>
		</view>
		<button @click="logoutHandle" class="logout">退出登录</button>
		<RestModal v-if="isShowRestModal" ref="rest" />
	</view>
</template>

<script>
	import RestModal from '../../component/restmodal.vue'
	export default {
		components: {
			RestModal
		},
		data () {
			return {
				userInfo: {},
				chartData:{
				  categories: [],
				  series: [{
				      "name": "总练习题数",
				      "data": [],
					  "type": 'column'
				    },
				    {
				      "name": "正确率",
				      "data": [],
					  "type": 'line',
					  "style": 'curve',
					  "format": '12121212'
				    }
				  ]
				},
				studentPortrait: '',
				soundSwitch: true,
				bgMusicSwitch: true,
				isShowRestModal: false
			}
		},
		onLoad () {
		},
		onShow () {
			this.isShowRestModal = true
			// const soundSwitch = uni.getStorageSync('soundSwitch')
			// const bgMusicSwitch = uni.getStorageSync('bgMusicSwitch')
			// if (soundSwitch == 1) {
			// 	this.soundSwitch = false
			// } else {
			// 	this.soundSwitch = true
			// }
			// if (bgMusicSwitch == 1) {
			// 	this.bgMusicSwitch = false
			// } else {
			// 	this.bgMusicSwitch = true
			// }
			this.getUserInfo()
		},
		onHide () {
			this.isShowRestModal = false
			// this.$refs.rest.hideHandle()
		},
		methods: {
			soundSwitchHandle (e) {
				this.soundSwitch = e.detail.value
				const bgMusicSwitch = uni.getStorageSync('bgMusicSwitch')
				const params = {
					backgroundMusic: bgMusicSwitch == 1 ? 0 : 1
				}
				if (e.detail.value) {					
					params.acoustics = 1
					this.$http.put('/applet/setStudentSound', params)
						.then(data => {
							uni.setStorageSync('soundSwitch', 2)
						}, err => {
							console.log(err)
						})
				} else {
					params.acoustics = 0
					this.$http.put('/applet/setStudentSound', params)
						.then(data => {
							uni.setStorageSync('soundSwitch', 1)
						}, err => {
							console.log(err)
						})
				}
				// const params = {
				// 	acoustics: e.detail.value ? 1 : 0,
				// 	backgroundMusic: this.bgMusicSwitch ? 1 : 0
				// }
				// console.log(params)
				// this.$http.put('/applet/setStudentSound', {}).then(res => {
				// 	console.log(res)
				// }, err => {
				// 	console.log(err)
				// })
			},
			bgMusicSwitchHandle (e) {
				this.bgMusicSwitch = e.detail.value
				const soundSwitch = uni.getStorageSync('soundSwitch')
				const params = {
					acoustics: soundSwitch == 1 ? 0 : 1
				}
				if (e.detail.value) {
					params.backgroundMusic = 1
					this.$http.put('/applet/setStudentSound', params)
						.then(data => {
							uni.setStorageSync('bgMusicSwitch', 2)
						}, err => {
							console.log(err)
						})
				} else {
					params.backgroundMusic = 0
					this.$http.put('/applet/setStudentSound', params)
						.then(data => {
							uni.setStorageSync('bgMusicSwitch', 1)
						}, err => {
							console.log(err)
						})					
				}
			},
			async logoutHandle () {
				uni.redirectTo({
					url: '/pages/login/index'
				})
			},
			async getUserInfo () {
				const res = await this.$http.post('/applet/getStudentsInfo', {})
				console.log(res.data, 111234)
				const categories = []
				const exercisesNumber = []
				const correctRate = []
				let maxNumber = 0
				res.data.growthCurve.forEach(item => {
					if (Number(item.exercisesNumber) > maxNumber) {
						maxNumber = Number(item.exercisesNumber)
					}
				})
				console.log('最大值: ', maxNumber)
				res.data.growthCurve.forEach(item => {
					categories.push(item.week)
					exercisesNumber.push(Number(item.exercisesNumber))
					correctRate.push(Number(item.correctRate) * maxNumber)
				})
				this.chartData.categories = categories
				this.chartData.series[0].data = exercisesNumber
				this.chartData.series[1].data = correctRate
				// console.log(categories)
				if (this.studentPortrait) {
					const _this = this
					this.studentPortrait = ''
					setTimeout(() => {
						_this.studentPortrait = res.data.studentPortrait
					}, 100)
				} else {
					this.studentPortrait = res.data.studentPortrait
				}
				this.userInfo = res.data
				
				const soundSwitch = uni.getStorageSync('soundSwitch')
				const bgMusicSwitch = uni.getStorageSync('bgMusicSwitch')
				if (res.data.acoustics == 0) {
					// 音效关
					this.soundSwitch = false
					uni.setStorageSync('soundSwitch', 1)
				} else {
					// 音效开
					this.soundSwitch = true
					uni.setStorageSync('soundSwitch', 2)
				}
				if (res.data.backgroundMusic == 0) {
					// 背景音乐关
					this.bgMusicSwitch = false
					uni.setStorageSync('bgMusicSwitch', 1)
				} else {
					// 背景音乐开
					this.bgMusicSwitch = true
					uni.setStorageSync('bgMusicSwitch', 2)
				}
				
			},
			jumpHandle (path) {
				uni.navigateTo({
					url: path
				})
			},
			getMusicStatus () {
				const soundSwitch = uni.getStorageSync('soundSwitch')
				const bgMusicSwitch = uni.getStorageSync('bgMusicSwitch')
				if (soundSwitch == 1) {
					this.soundSwitch = false
				} else {
					this.soundSwitch = true
				}
				if (bgMusicSwitch == 1) {
					this.bgMusicSwitch = false
				} else {
					this.bgMusicSwitch = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mine-container {
		background-color: #F5F5F5;
		padding: 0 30rpx;
		padding-bottom: 30rpx;
		.logout {
			width: 595rpx;
			height: 74rpx;
			border-radius: 37rpx;
			border: 0 none;
			background-color: #24A9FF;
			font-size: 32rpx;
			color: #ffffff;
			margin-top: 40rpx;
			&::after {
				border: 0 none;
			}
		}
		.pannel {
			margin-top: 30rpx;
			background-color: #ffffff;
			border-radius: 30rpx;
			overflow: hidden;
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 105rpx;
				box-sizing: border-box;
				padding: 0 20rpx;
				.label {
					width: 54rpx;
					height: 54rpx;
					margin-right: 30rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.text {
					flex: 1;
				}
				.iconfont {
					font-size: 38rpx;
					color: #D8D8D8;
				}
				.more {
					width: 17rpx;
					height: 8rpx;
				}
			}
		}
		.count-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;
			.count-item {
				width: 215rpx;
				height: 217rpx;
				border-radius: 27rpx;
				background-color: #ffffff;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.num {
					width: 120rpx;
					height: 100rpx;
					background-size: 100% 100%;
					display: flex;
					justify-content: center;
					font-size: 27rpx;
					color: #ffffff;
					box-sizing: border-box;
}
				&:first-child .num {
					background-image: url(../../static/images/mine/count1.png);
					padding-top: 25rpx;
				}
				&:nth-child(2) .num {
					background-image: url(../../static/images/mine/count2.png);
					padding-top: 25rpx;
				}
				&:nth-child(3) .num {
					background-image: url(../../static/images/mine/count3.png);
					padding-top: 15rpx;
				}
				.text {
					font-size: 24rpx;
				}
			}
		}
		.charts-container {
			margin-top: 30rpx;
			.title {
				text-align: center;
				font-size: 32rpx;
			}
			.charts-box{
				margin-top: 10rpx;
			  width: 100%;
			  height:300rpx;
			}
		}
		.userinfo-box {
			height: 296rpx;
			background-image: url(../../static/images/mine/userInfo.png);
			background-size: 100% 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 38rpx 34rpx 0;
			.avatar-container {
				.avatar-content {
					position: relative;
					.frame {
						position: absolute;
						width: 132%;
						height: 132%;
						left: 50%;
						transform: translateX(-50%);
						top: -28rpx;
					}
				}
			}
			.avatar {
				width: 170rpx;
				height: 170rpx;
				border-radius: 50%;
				overflow: hidden;				
				box-shadow: 0px 4px 17px 0px rgba(255, 255, 255, 0.84);		
				image {
					width: 170rpx;
					height: 170rpx;
				}
			}
			.info-box {
				flex: 1;
				margin-left: 20rpx;
				.top {
					display: flex;
					padding-left: 5rpx;
					.name {
						font-size: 40rpx;
						color: #ffffff;
					}
					.grade {
						height: 46rpx;
						border-radius: 23rpx;
						background-color: #ffffff;
						color: #0085FF;
						font-size: 24rpx;
						line-height: 46rpx;
						padding: 0 15rpx;
						margin-left: 20rpx;
					}
				}
				.bottom {
					display: flex;
					align-items: center;
					color: #ffffff;
					font-size: 26rpx;
					.bottom-item {
						display: flex;
						align-items: center;
						margin-top: 33rpx;
						&:first-child {
							margin-right: 30rpx;
						}
						.level {
							width: 45rpx;
							height: 39rpx;
							background-image: url(../../static/images/mine/star.png);
							background-size: 100% 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 24rpx;
							box-sizing: border-box;
							padding-left: 6rpx;
							margin-right: 5rpx;
						}
					}
				}
			}
			.play {
				width: 57rpx;
				height: 57rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
