<template>
	<view :style="{paddingTop: statusBarHeight + 45 + 'px'}" :class="['answer-container', isPad ? 'pad' : '']">
		<CustomerTopBar @customHandle="customHandle" :custom="true" />
		<view class="page-content">
			<image class="title-bg" src="../../static/images/index/answer/title_bg.png" mode="widthFix"></image>
			<view class="title">				
				<TextRoll v-if="subject.title && subject.title.length > 11" :text="subject.title"></TextRoll>
				<view v-else class="title-content">{{subject.title}}</view>
			</view>
			<image @click="tipsHandle" v-if="soundSwitch == 1 && bgMusicSwitch == 1" class="voice" src="../../static/images/unvioce.png" mode="aspectFit"></image>
			<block v-else>
				<image @click="localVoiceHandle(false)" v-if="localVoice" class="voice" src="../../static/images/voice.png" mode="aspectFit"></image>
				<image @click="localVoiceHandle(true)" v-else class="voice" src="../../static/images/unvioce.png" mode="aspectFit"></image>
			</block>
			
			<view class="step-container">
				<view class="progress-container">
					<view :style="{width: (current + 1) / subject.list.length * 100 + '%'}" class="progress"></view>
					<view v-if="subject.list" class="progress-num">{{(current + 1)}}/{{subject.list.length}}</view>
				</view>
				<image :style="{left: (current + 1) / subject.list.length * 100 + '%'}" class="bird" src="../../static/images/index/answer/bird.png" mode="aspectFit"></image>
			</view>
			<view class="clock-container">
				<image class="clock" src="../../static/images/index/answer/clock.png" mode="aspectFit"></image>
				<view class="text">用时{{second}}s</view>
			</view>
			<view v-if="subject.list" class="formula">
				<block v-for="(item, index) in subject.list[current].formula">
					<view v-if="item == '+' || item == '-' || item == 'x' || item == '×' || item == '÷' || item == '='" :key="index" class="symbol">{{item}}</view>
					<view v-else-if="item.indexOf('/') != -1" :key="index" class="number fraction">
						<view class="text">{{item.split('/')[0]}}</view>
						<view class="line"></view>
						<view class="text">{{item.split('/')[1]}}</view>
					</view>
					<view v-else :key="index" class="number">
						{{item}}
					</view>					
				</block>
				<view v-if="subject.list[current].isFraction" class="number-box">
					<view @click="focusHandle(1)" class="number result fraction">
						{{FractionResult.currentValue1}}
						<text v-if="isFocus1" class="cursor"></text>
					</view>
					<view class="line"></view>
					<view @click="focusHandle(2)" class="number result fraction">
						{{FractionResult.currentValue2}}
						<view v-if="isFocus2" class="cursor"></view>
					</view>
				</view>
				<view v-else class="number result">
					{{result.currentValue}}
				</view>
			</view>
			<!-- <view v-if="subject.list[current + 1]" class="next-formula">
				下一题 <text v-for="(item, index) in subject.list[current + 1].formula" :key="index">{{item}}</text> ？
			</view> -->
			<view v-else class="next-formula">
				无
			</view>
			<view class="keybord-container">
				<view class="keybord">
					<view class="left">
						<view class="row">
							<view @click="inputValue(1)" hover-class="press" class="item">1</view>
							<view @click="inputValue(2)" hover-class="press" class="item">2</view>
							<view @click="inputValue(3)" hover-class="press" class="item">3</view>
						</view>
						<view class="row">
							<view @click="inputValue(4)" hover-class="press" class="item">4</view>
							<view @click="inputValue(5)" hover-class="press" class="item">5</view>
							<view @click="inputValue(6)" hover-class="press" class="item">6</view>
						</view>
						<view class="row">
							<view @click="inputValue(7)" hover-class="press" class="item">7</view>
							<view @click="inputValue(8)" hover-class="press" class="item">8</view>
							<view @click="inputValue(9)" hover-class="press" class="item">9</view>
						</view>
						<view class="row">
							<view @click="inputValue(0)" hover-class="press" class="item">0</view>
							<view @click="inputValue('.')" hover-class="press" class="item">.</view>
						</view>
					</view>
					<view class="right">
						<view @click="backHandle" hover-class="delete-hover" class="delete">
						</view>
						<view v-if="(subject.list[current].isFraction && FractionResult.currentValue1 && FractionResult.currentValue2) || result.currentValue" @click="confirmHandle" hover-class="confirm-hover" class="confirm">
							<block v-if="current < subject.list.length - 1">
								<text>确</text>
								<text>认</text>
							</block>
							<block v-else>
								<text>提</text>
								<text>交</text>
							</block>							
						</view>
						<view v-else class="confirm disabled">
							<block v-if="current < subject.list.length - 1">
								<text>确</text>
								<text>认</text>
							</block>
							<block v-else>
								<text>提</text>
								<text>交</text>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="isShowModal" class="modal">
			<view class="content">
				<image @click.stop="isShowModal = false" src="../../static/images/modal/close.png" mode="widthFix" class="close"></image>
				<view class="title">真的要离开吗?</view>
				<view class="desc">
					<view>退出后不保留答题记录哦！</view>
				</view>
				<view class="actions">
					<view @click.stop="isShowModal = false" class="btn cancel">取消</view>
					<view @click.stip="navigateBack" class="btn confirm">确认</view>
				</view>
			</view>
		</view>
		<!-- <RestModal ref="rest" /> -->
	</view>
</template>

<script>
	import app from '../../App.vue'
	import CustomerTopBar from '../../component/customer-top-bar/index.vue'
	// import RestModal from '../../component/restmodal.vue'
	import TextRoll from '../../components/beyondGod-roll/text-roll.vue'
	export default {
		components: {
			CustomerTopBar,
			TextRoll
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				result: {
					record: [],
					currentValue: ''
				},
				FractionResult: {
					record1: [],
					record2: [],
					currentValue1: '',
					currentValue2: ''
				},
				subject: {},
				current: 0,
				params: {},
				second: 0,
				timer: null,
				isShowModal: false,
				isFocus1: false,
				isFocus2: true,
				innerAudioContext: null,
				acoustics: null,
				soundSwitch: null,
				bgMusicSwitch: null,
				localVoice: true,
				isInit: true,
				rightUrl1: '',
				rightUrl2: '',
				errorUrl1: '',
				errorUrl2: '',
				platform: '',
				isPad: false
			}
		},
		async onLoad (options) {
			const _this = this
			uni.getSystemInfo({
				success: function(res) {
					console.log(res)
					_this.platform = res.platform
					console.log(res.screenWidth > 480)
					// _this.isPad = true
					if (res.model.indexOf('Pad') != -1 || res.screenWidth >= 450) {
						_this.isPad = true
					}
				}
			})
			
			uni.downloadFile({
			  url: this.$http.baseUrl + '/applet/file/ioReadImage?fileId=breakThroughCorrect.mp3',
			  success: function(res) {
			    console.log(res.tempFilePath)
				_this.rightUrl1 = res.tempFilePath
			    uni.playVoice({
			      filePath: res.tempFilePath,
			      complete: function (res) {
			        console.log('playVoice res')
			        console.log(res)
			      }
			    })
			  },
			})
			uni.downloadFile({
			  url: this.$http.baseUrl + '/applet/file/ioReadImage?fileId=otherCorrect.mp3',
			  success: function(res) {
			    console.log(res.tempFilePath)
				_this.rightUrl2 = res.tempFilePath
			    uni.playVoice({
			      filePath: res.tempFilePath,
			      complete: function (res) {
			        console.log('playVoice res')
			        console.log(res)
			      }
			    })
			  },
			})
			uni.downloadFile({
			  url: this.$http.baseUrl + '/applet/file/ioReadImage?fileId=breakThroughError.mp3',
			  success: function(res) {
			    console.log(res.tempFilePath)
				_this.errorUrl1 = res.tempFilePath
			    uni.playVoice({
			      filePath: res.tempFilePath,
			      complete: function (res) {
			        console.log('playVoice res')
			        console.log(res)
			      }
			    })
			  },
			})
			uni.downloadFile({
			  url: this.$http.baseUrl + '/applet/file/ioReadImage?fileId=otherError.mp3',
			  success: function(res) {
			    console.log(res.tempFilePath)
				_this.errorUrl2 = res.tempFilePath
			    uni.playVoice({
			      filePath: res.tempFilePath,
			      complete: function (res) {
			        console.log('playVoice res')
			        console.log(res)
			      }
			    })
			  },
			})
			this.id = options.id
			this.type = options.type
			this.querySubjectList()
			setTimeout(() => {
				_this.progress = '50%'
			}, 1000)
			this.timer = setInterval(() => {
				_this.second = _this.second + 1
			}, 1000)
			
			const res = await this.$http.post('/applet/getStudentsInfo', {})
			this.bgMusicSwitch = res.data.backgroundMusic == 0 ? 1 : 2
			this.bgMusicSwitch = uni.getStorageSync('bgMusicSwitch')
			if (this.bgMusicSwitch == 1) {
				console.log('背景音乐关闭')
			} else {
				this.playBgMusic()
			}
			
			this.soundSwitch = res.data.acoustics == 0 ? 1 : 2
			// if (this.soundSwitch != 1) {
			// 	this.acoustics = uni.createInnerAudioContext()
			// }
			
		},
		destroyed () {
			clearInterval(this.timer)
			// this.$refs.rest.hideHandle()
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy()
			}			
		},
		methods: {
			playBgMusic () {
				const _this = this
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.autoplay = true;
				this.innerAudioContext.loop = true
				this.innerAudioContext.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=backgroundMusic.mp3';
				this.innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				  
				});
				this.innerAudioContext.onEnded(() => {
					console.log('播放结束')
					_this.innerAudioContext.play()
				})
				// _this.innerAudioContext.onTimeUpdate(() => {
				// 	// console.log(_this.innerAudioContext.currentTime)
				// 	// console.log(_this.innerAudioContext.duration)
				// 	if (_this.innerAudioContext.currentTime >= 30) {
				// 		_this.innerAudioContext.destroy()
				// 		_this.playBgMusic()
				// 	}
				// })
				this.innerAudioContext.onCanplay(() => {
					console.log('可以播放了')
					if (_this.isInit) {
						_this.innerAudioContext.play()
						_this.isInit = false
					}					
				})
			},
			localVoiceHandle (type) {
				this.localVoice = type
				console.log(type)
				if (type) {
					if (this.innerAudioContext) {
						this.innerAudioContext.play()
					}
				} else {
					if (this.innerAudioContext) {
						this.innerAudioContext.stop()
					}
				}
			},
			tipsHandle () {
				uni.showToast({
					title: '请前往设置开启音效',
					icon: 'none',
					duration: 1500
				})
			},
			focusHandle (type) {
				if (type == 1) {
					this.isFocus1 = true
					this.isFocus2 = false
				} else {
					this.isFocus1 = false
					this.isFocus2 = true
				}
			},
			navigateBack () {
				this.isShowModal = false
				uni.navigateBack()
			},
			customHandle () {
				this.isShowModal = true
			},
			async confirmHandle () {
				if (this.acoustics) {
					this.acoustics.destroy()
				}
				if (this.subject.list[this.current].isFraction) {
					this.params[this.subject.list[this.current].id] = this.FractionResult.currentValue1 + '/' + this.FractionResult.currentValue2
				} else {
					this.params[this.subject.list[this.current].id] = this.result.currentValue
				}
				if (this.soundSwitch != 1 && this.localVoice) {
					this.acoustics = uni.createInnerAudioContext()
					console.log(this.subject.list[this.current], this.params[this.subject.list[this.current].id])
					if (this.type == 1) {
						if (this.subject.list[this.current].result == this.params[this.subject.list[this.current].id]) {
							if (this.platform == 'ios') {
								this.acoustics.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=breakThroughCorrect.mp3'
							} else {
								this.acoustics.src = this.rightUrl1 || this.$http.baseUrl + '/applet/file/ioReadImage?fileId=breakThroughCorrect.mp3'
							}							
						} else {
							if (this.platform == 'ios') {
								this.acoustics.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=breakThroughError.mp3'
							} else {
								this.acoustics.src = this.errorUrl1 || this.$http.baseUrl + '/applet/file/ioReadImage?fileId=breakThroughError.mp3'
							}							
						}
						
					} else {
						if (this.subject.list[this.current].result == this.params[this.subject.list[this.current].id]) {
							if (this.platform == 'ios') {
								this.acoustics.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=otherCorrect.mp3'
							} else {
								this.acoustics.src = this.rightUrl2 || this.$http.baseUrl + '/applet/file/ioReadImage?fileId=otherCorrect.mp3'
							}
							
						} else {
							if (this.platform == 'ios') {
								this.acoustics.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=otherError.mp3'
							} else {
								this.acoustics.src = this.errorUrl2 || this.$http.baseUrl + '/applet/file/ioReadImage?fileId=otherError.mp3'
							}							
						}						
					}
					this.acoustics.play()
				}
				
				if (this.current < this.subject.list.length - 1) {
					this.current = this.current + 1
					this.result = {
						record: [],
						currentValue: ''
					}
					this.FractionResult = {
						record1: [],
						record2: [],
						currentValue1: '',
						currentValue2: ''
					}
					this.isFocus1 = false
					this.isFocus2 = true
				} else {
					// console.log(this.params, JSON.stringify(this.params))
					const params = {
						id: this.subject.id,
						json: JSON.stringify(this.params),
						second: this.second
					}
					if (this.type == 3 || this.type.indexOf('error') > -1) {
						params.batchId = this.subject.id
					}
					uni.redirectTo({
						url: '/pages/index/result?params=' + JSON.stringify(params) + '&type=' + this.type
					})
				}
				
			},
			async querySubjectList () {
				uni.showLoading({
					title: '加载中',
					icon: 'loading'
				})
				if (this.type == 3) {
					console.log(this.type, this.id)
					const res = await this.$http.get('/applet/classRoomTest/generateTestTopic', {testId: this.id})
					console.log(res, 1111111111111)
					res.data.list.forEach(item => {
						if (Number(item.resultType) == -1) {
							item.isFraction = false
						} else if (Number(item.resultType) > -1) {
							item.isFraction = true
						}
						item.formula = item.formula.replace(/\'/g,"").split(',')
					})
					this.subject = res.data
				} else if (this.type.indexOf('error') > -1) {
					console.log(12121212, uni.getStorageSync('errorList'))
					const errorList = JSON.parse(uni.getStorageSync('errorList'))
					console.log(errorList)
					errorList.list.forEach(item => {
						if (Number(item.resultType) == -1) {
							item.isFraction = false
						} else if (Number(item.resultType) > -1) {
							item.isFraction = true
						}
						item.formula = item.formula.replace(/\'/g,"").split(',')
					})
					this.subject = errorList
				} else {
					const res = await this.$http.post('/applet/training/querySubjectList', { id: this.id, type: this.type})
					console.log(res, 11111)
					res.data.list.forEach(item => {
						if (Number(item.resultType) == -1) {
							item.isFraction = false
						} else if (Number(item.resultType) > -1) {
							item.isFraction = true
						}
						item.formula = item.formula.replace(/\'/g,"").split(',')
					})
					this.subject = res.data
				}				
				uni.hideLoading()
			},
			backHandle () {
				if (this.subject.list[this.current].isFraction) {
					if (this.isFocus1) {
						if (this.FractionResult.record1.length > 0) {
							this.FractionResult.record1.pop()
						}
						if (this.FractionResult.record1[0]) {
							this.FractionResult.currentValue1 = this.FractionResult.record1[this.FractionResult.record1.length - 1]
						} else {
							this.FractionResult.currentValue1 = ''
						}						
					} else if (this.isFocus2) {
						if (this.FractionResult.record2.length > 0) {
							this.FractionResult.record2.pop()
						}
						if (this.FractionResult.record2[0]) {
							this.FractionResult.currentValue2 = this.FractionResult.record2[this.FractionResult.record2.length - 1]
						} else {
							this.FractionResult.currentValue2 = ''
						}
					}
				} else {
					if (this.result.record.length > 0) {
						this.result.record.pop()
					}
					if (this.result.record[0]) {
						this.result.currentValue = this.result.record[this.result.record.length - 1]
					} else {
						this.result.currentValue = ''
					}
				}				
			},
			inputValue(value) {
				// 分数
				if (this.subject.list[this.current].isFraction) {
					if (this.isFocus1) {
						if (this.FractionResult.record1[0]) {
							const lastRecord = this.FractionResult.record1[this.FractionResult.record1.length - 1]
							const newRecord = this.FractionResult.record1[this.FractionResult.record1.length - 1] + value.toString()
							this.FractionResult.record1.push(newRecord)
						} else {
							this.FractionResult.record1.push(value.toString())
						}
						this.FractionResult.currentValue1 = this.FractionResult.record1[this.FractionResult.record1.length - 1]
					} else if (this.isFocus2) {
						if (this.FractionResult.record2[0]) {
							const lastRecord = this.FractionResult.record2[this.FractionResult.record2.length - 1]
							const newRecord = this.FractionResult.record2[this.FractionResult.record2.length - 1] + value.toString()
							this.FractionResult.record2.push(newRecord)
						} else {
							this.FractionResult.record2.push(value.toString())
						}
						this.FractionResult.currentValue2 = this.FractionResult.record2[this.FractionResult.record2.length - 1]
					}
				} else {
					if (this.result.record[0]) {
						const lastRecord = this.result.record[this.result.record.length - 1]
						const newRecord = this.result.record[this.result.record.length - 1] + value.toString()
						this.result.record.push(newRecord)
					} else {
						this.result.record.push(value.toString())
					}
					this.result.currentValue = this.result.record[this.result.record.length - 1]
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
		background-color: rgba(0, 0, 0, .6);
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 99999;
		.content {
			width: 562rpx;
			height: 459rpx;
			background-image: url(../../static/images/modal/bg.png);
			background-size: 100% 100%;
			position: relative;
			padding-top: 80rpx;
			box-sizing: border-box;
			.close {
				position: absolute;
				width: 90rpx;
				height: 90rpx;
				top: -30rpx;
				right: -30rpx;
			}
			.title {
				text-align: center;
				font-size: 42rpx;
				color: #8F6E4D;
			}
			.desc {
				text-align: center;
				font-size: 27rpx;
				margin-top: 30rpx;
			}
			.actions {
				display: flex;
				justify-content: center;
				align-items: center;
				.btn {
					width: 214rpx;
					height: 72rpx;
					border-radius: 36rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-size: 100% 100%;
					font-size: 28rpx;
					margin-top: 78rpx;
					&.cancel {
						background-image: url(../../static/images/modal/cancel.png);
						color: #FFA621;
						margin-right: 35rpx;
					}
					&.confirm {
						background-image: url(../../static/images/modal/confirm.png);
						color: #FFFFFF;
					}
				}
			}
		}
	}
	.press {
		background-color: #36AFFF!important;
		color: #ffffff!important;
		box-shadow: 7rpx 8rpx 0px 0px #0A8ADF!important;
	}
	.delete-hover {
		background-image: url(../../static/images/index/answer/back_active.png)!important;
		background-color: #36AFFF!important;
		box-shadow: 7rpx 8rpx 0px 0px #0A8ADF!important;
	}
	.confirm-hover {
		background: #FF9900!important;
		box-shadow: 7rpx 8rpx 0px 0px #c77700!important;
	}
	@keyframes cursor {
		from {
			background-color: #36AFFF;			
		} to {
			background-color: rgba(0, 0, 0, 0);
		}
	}
	.answer-container {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;
		background: linear-gradient(#65c7ff, #1ca0ff);
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 40rpx;
		display: flex;
		&.pad {
			.page-content {
				.step-container {
					margin-top: 60px;
				}
				.formula {
					margin-top: 25px;
				}
				.keybord-container {
					box-sizing: border-box;
					padding: 30rpx;
					width: 100%;
					position: absolute;
					left: 0;
					bottom: 0;
					.keybord {
						display: flex;
						justify-content: space-between;
						.left {
							flex: 1;
							.row {
								display: flex;
								align-items: center;
								justify-content: space-between;
								margin-top: 15rpx;
								&:first-child {
									margin-top: 0;
								}
								&:last-child {
									.item {
										&:first-child {
											flex: 1;
											margin-right: 30rpx;
										}
									}
								}
								.item {
									width: 136rpx;
									height: 85rpx;
									background-color: #ECF8FF;
									border-radius: 18rpx;
									display: flex;
									justify-content: center;
									align-items: center;
									box-shadow: 7rpx 8rpx 0px 0px #36AFFF;
									font-size: 54rpx;
									color: #23A8FF;
								}
							}
						}
						.right {
							display: flex;
							flex-direction: column;
							margin-left: 30rpx;
							.delete {
								width: 136rpx;
								height: 85rpx;
								background-color: #ECF8FF;
								border-radius: 18rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								box-shadow: 7rpx 8rpx 0px 0px #36AFFF;
								margin-bottom: 30rpx;
								background-image: url(../../static/images/index/answer/back.png);
								background-size: 40rpx auto;
								background-repeat: no-repeat;
								background-position: center center;
							}
							.confirm {
								width: 136rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								background: #FFCB00;
								box-shadow: 7rpx 8rpx 0px 0px #FF9900;
								border-radius: 10px;
								flex: 1;
								color: #ffffff;
								display: flex;
								flex-direction: column;
								justify-content: space-around;
								align-items: center;
								padding: 60rpx 0;
								font-size: 38rpx;
								&.disabled {
									background-color: #DCDCDC;
									box-shadow: 7rpx 8rpx 0px 0px #B2B2B2;
								}
							}
						}
					}				
				}
				.formula {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 25rpx;
					.number-box {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.line {
							width: 95%;
							height: 4rpx;
							background-color: #36AFFF;
							margin: 10rpx 0 5rpx;
						}
						.number {
							.cursor {
								display: inline-block;
								width: 1rpx;
								height: 65%;
								background-color: #36AFFF;
								animation: cursor .5s linear infinite alternate;
							}
						}
					}
					.number {
						min-width: 116rpx;
						padding: 0 10rpx;
						box-sizing: border-box;
						height: 116rpx;
						box-shadow: 7rpx 8rpx 0px 0px #36AFFF;
						border-radius: 18rpx;
						background-color: #ECF8FF;
						font-size: 54rpx;
						color: #23A8FF;
						display: flex;
						justify-content: center;
						align-items: center;
						overflow: hidden;
						&.result {
							min-width: 116rpx;
							width: auto;
							max-width: 250rpx;
							box-sizing: border-box;
							padding: 0 10rpx;
						}
						&.fraction {
							height: 145rpx;
							&.result {
								height: 70rpx;
							}
							flex-direction: column;
							font-size: 44rpx;
							.line {
								width: 80%;
								height: 4rpx;
								background-color: #23A8FF;
								margin: 8rpx 0;
							}
						}
						input {
							width: 100%;
							height: 100%;
							text-align: center;
							font-size: 42rpx;
							color: #23A8FF;
						}
					}
					.symbol {
						color: #23A8FF;
						margin: 0 10rpx;
						font-size: 60rpx;
					}
				}
			}
		}
		.page-content {
			background-color: #ffffff;
			width: 100%;
			border-radius: 30rpx;
			position: relative;
			margin-top: 20rpx;
			flex: 1;
			.voice {
				width: 70rpx;
				height: 70rpx;
				position: absolute;
				right: 17rpx;
				top: 20rpx;
			}
			.title-bg {
				position: absolute;
				top: -10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 592rpx;
			}
			.title {
				position: relative;
				z-index: 10;
				text-align: center;
				color: #ffffff;
				font-size: 32rpx;
				top: -10rpx;
				box-sizing: border-box;
				overflow: hidden;
				width: 348rpx;
				left: 50%;
				transform: translateX(-50%);
				.title-content {
					white-space: nowrap;
				}
			}
			.step-container {
				width: 503rpx;
				height: 54rpx;
				margin: 0 auto;
				border-radius: 27rpx;
				background-color: #ECF8FF;
				box-shadow: 0px 6rpx 0rpx 0rpx #9DD8FF;
				margin-top: 75rpx;
				// overflow: hidden;
				position: relative;
				.bird {
					position: absolute;
					left: 0;
					width: 63rpx;
					height: 47rpx;
					top: -30rpx;
					transform: translateX(-50%);
					transition: all .5s;
				}
				.progress-container {
					width: 100%;
					height: 100%;
					border-radius: 27rpx;
					overflow: hidden;
					.progress {
						transition: all .5s;
						width: 0;
						height: 100%;
						// background: linear-gradient(323deg, #23A8FF 0%, #74C8FF 100%, rgba(35, 168, 255, 0) 100%);
						background-image: url(../../static/images/index/answer/progress_bg.jpg);
						background-size: auto 100%;
						background-repeat: no-repeat;
						overflow: hidden;
					}
					.progress-num {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translateX(-50%) translateY(-50%);
						font-size: 28rpx;
					}
				}
			}
			.clock-container {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 15rpx;
				.clock {
					width: 34rpx;
					height: 34rpx;
					margin-right: 10rpx;
				}
				.text {
					color: #666666;
					font-size: 28rpx;
				}
			}
			.formula {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 75rpx;
				.number-box {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.line {
						width: 95%;
						height: 4rpx;
						background-color: #36AFFF;
						margin: 20rpx 0 15rpx;
					}
					.number {
						.cursor {
							display: inline-block;
							width: 1rpx;
							height: 65%;
							background-color: #36AFFF;
							animation: cursor .5s linear infinite alternate;
						}
					}
				}
				.number {
					min-width: 116rpx;
					padding: 0 10rpx;
					box-sizing: border-box;
					height: 116rpx;
					box-shadow: 7rpx 8rpx 0px 0px #36AFFF;
					border-radius: 18rpx;
					background-color: #ECF8FF;
					font-size: 54rpx;
					color: #23A8FF;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
					&.result {
						min-width: 116rpx;
						width: auto;
						max-width: 250rpx;
						box-sizing: border-box;
						padding: 0 10rpx;
					}
					&.fraction {
						height: 180rpx;
						flex-direction: column;
						&.result {
							height: 116rpx;
						}
						.line {
							width: 80%;
							height: 4rpx;
							background-color: #23A8FF;
							margin: 8rpx 0;
						}
					}
					input {
						width: 100%;
						height: 100%;
						text-align: center;
						font-size: 54rpx;
						color: #23A8FF;
					}
				}
				.symbol {
					color: #23A8FF;
					margin: 0 10rpx;
					font-size: 60rpx;
				}
			}
			.next-formula {
				display: flex;
				justify-content: center;
				align-items: center;
				color: #999999;
				font-size: 32rpx;
				margin-top: 35rpx;
			}
			.keybord-container {
				box-sizing: border-box;
				padding: 30rpx;
				width: 100%;
				position: absolute;
				left: 0;
				bottom: 0;
				.keybord {
					display: flex;
					justify-content: space-between;
					.left {
						flex: 1;
						.row {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-top: 30rpx;
							&:first-child {
								margin-top: 0;
							}
							&:last-child {
								.item {
									&:first-child {
										flex: 1;
										margin-right: 30rpx;
									}
								}
							}
							.item {
								width: 136rpx;
								height: 109rpx;
								background-color: #ECF8FF;
								border-radius: 18rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								box-shadow: 7rpx 8rpx 0px 0px #36AFFF;
								font-size: 54rpx;
								color: #23A8FF;
							}
						}
					}
					.right {
						display: flex;
						flex-direction: column;
						margin-left: 30rpx;
						.delete {
							width: 136rpx;
							height: 109rpx;
							background-color: #ECF8FF;
							border-radius: 18rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							box-shadow: 7rpx 8rpx 0px 0px #36AFFF;
							margin-bottom: 30rpx;
							background-image: url(../../static/images/index/answer/back.png);
							background-size: 40rpx auto;
							background-repeat: no-repeat;
							background-position: center center;
						}
						.confirm {
							width: 136rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							background: #FFCB00;
							box-shadow: 7rpx 8rpx 0px 0px #FF9900;
							border-radius: 10px;
							flex: 1;
							color: #ffffff;
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							align-items: center;
							padding: 60rpx 0;
							font-size: 38rpx;
							&.disabled {
								background-color: #DCDCDC;
								box-shadow: 7rpx 8rpx 0px 0px #B2B2B2;
							}
						}
					}
				}				
			}
		}
	}
</style>
