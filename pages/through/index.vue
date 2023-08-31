<template>
	<view v-if="pageData" id="through-index" class="through-index">
		<!-- <image class="bg" src="../../static/images/through/bg.png" mode="widthFix"></image> -->
		<image v-if="currentIndex == 0 || currentIndex == 1" class="bg" src="https://www.fudian.co:8443/applet/file/ioReadImage?fileId=snow.png" mode="widthFix"></image>
		<image v-else-if="currentIndex == 4 || currentIndex == 5" class="bg" src="https://www.fudian.co:8443/applet/file/ioReadImage?fileId=plain.png" mode="widthFix"></image>
		<image v-else class="bg" src="https://www.fudian.co:8443/applet/file/ioReadImage?fileId=ocean.png" mode="widthFix"></image>
		<view :style="{top: statusBarHeight + 10 + 'px'}" class="voice">
			<image @click="tipsHandle" v-if="bgMusicSwitch == 1" src="../../static/images/through/unvoice.png" mode="aspectFit"></image>
			<block v-else>
				<image @click="localVoiceHandle(false)" v-if="localVoice" src="../../static/images/through/voice.png" mode="aspectFit"></image>
				<image @click="localVoiceHandle(true)" v-else src="../../static/images/through/unvoice.png" mode="aspectFit"></image>
			</block>
		</view>
		<view class="page-content">
			<!-- <Lock v-for="(item, index) in 16" :key="index" :class="['level-' + (index + 1), 'level-item']" /> -->
			<block v-for="(item, index) in pageData[currentIndex].levelList">
				<UnLock
					v-if="item.isLock == 0 || item.isLock == 1 || item.isLock == 2"					
					:key="index"
					:class="['level-' + (16-index), 'level-item']"
					:level="item.levelName"
					:data="item"
					:starsNum="item.starsNum"
					/>
				<Lock
					v-else
					:data="item"
					:key="index"
					:class="['level-' + (16-index), 'level-item']"
					:level="item.levelName"
					/>				
			</block>
		</view>
		<view :class="['grade-container', currentIndex == 0 || currentIndex ==1 ? 'grade-container1' : currentIndex == 4 || currentIndex == 5 ? 'grade-container2' : 'grade-container3' ]">
			{{pageData[currentIndex].gradeName}}
			<view class="play">
				<image src="../../static/images/through/play.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="cat-container">
			<view class="cat-box">
				<scroll-view class="scroll-view_H" scroll-x="true" :scroll-into-view="'cat' + (currentIndex + 1)">
					<view v-for="(item, index) in pageData" :key="index"
						@click="catHandle(index)"
						:id="'cat' + (index + 1)"
						:class="['cat-item', index == currentIndex ? 'active' : '']">
						<view class="text">{{item.gradeName}}
							<image src="../../static/images/through/arrow.png" mode="aspectFit"></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<RestModal v-if="isShowRestModal" ref="rest" />
	</view>
</template>

<script>
	import Lock from '../../component/level/lock.vue'
	import UnLock from '../../component/level/unlock.vue'
	import RestModal from '../../component/restmodal.vue'
	import app from '../../App.vue'
	export default {
		components: {
			Lock: Lock,
			UnLock: UnLock,
			RestModal
		},
		data () {
			return {
				pageData: null,
				currentIndex: 0,
				timer: null,
				statusBarHeight: app.globalData.statusBarHeight,
				refresh: true,
				innerAudioContext: null,
				bgMusicSwitch: null,
				localVoice: true,
				isInit: true,
				isShowRestModal: false
			}
		},
		onLoad () {
			uni.setInnerAudioOption({
			  obeyMuteSwitch: false
			})
			
			// InnerAudioContext.onEnded (() => {
			// 	innerAudioContext.play()
			// })
			
		},
		onShow () {
			this.isShowRestModal = true
			this.queryLevelList()
			this.getMusicStatus()
		},
		onHide () {
			this.isShowRestModal = false
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy()
			}
		},
		mounted () {
		},
		methods: {
			async getMusicStatus () {
				const res = await this.$http.post('/applet/getStudentsInfo', {})
				this.bgMusicSwitch = res.data.backgroundMusic == 0 ? 1 : 2
				if (this.bgMusicSwitch == 1) {
					console.log('背景音乐关闭')
				} else if (this.bgMusicSwitch != 1 && this.localVoice) {
					this.innerAudioContext = uni.createInnerAudioContext();
					this.innerAudioContext.autoplay = true;
					this.innerAudioContext.loop = true
					this.innerAudioContext.src = encodeURI(this.$http.baseUrl + '/applet/file/ioReadImage?fileId=backgroundMusic.mp3');
					console.log(encodeURI(this.$http.baseUrl + '/applet/file/ioReadImage?fileId=backgroundMusic.mp3'))
					this.innerAudioContext.onPlay(() => {
					  console.log('开始播放');
					});
					this.innerAudioContext.onCanplay(() => {
						console.log('可以播放了')
						if (this.isInit) {
							console.log('执行播放')
							this.innerAudioContext.play()
							this.isInit = false
						}
						
					})
				}
			},
			localVoiceHandle (type) {
				console.log(type)
				this.localVoice = type
				if (type) {
					console.log(this.innerAudioContext)
					if (this.innerAudioContext) {
						console.log('测试')
						this.innerAudioContext = uni.createInnerAudioContext();
						this.innerAudioContext.autoplay = true;
						this.innerAudioContext.loop = true
						this.innerAudioContext.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=backgroundMusic.mp3';
						this.innerAudioContext.onPlay(() => {
						  console.log('开始播放');
						});
						this.innerAudioContext.onCanplay(() => {
							console.log('可以播放了')
							if (this.isInit) {
								this.innerAudioContext.play()
								this.isInit = false
							}
							
						})
					} else {
						console.log('重播')
						this.innerAudioContext = uni.createInnerAudioContext();
						this.innerAudioContext.autoplay = true;
						this.innerAudioContext.loop = true
						this.innerAudioContext.src = this.$http.baseUrl + '/applet/file/ioReadImage?fileId=backgroundMusic.mp3';
						this.innerAudioContext.onPlay(() => {
						  console.log('开始播放');
						});
						this.innerAudioContext.onCanplay(() => {
							console.log('可以播放了')
							if (this.isInit) {
								this.innerAudioContext.play()
								this.isInit = false
							}
							
						})
					}
				} else {
					if (this.innerAudioContext) {
						this.innerAudioContext.stop()
					}
				}
			},
			tipsHandle () {
				uni.showToast({
					title: '请前往设置开启背景音乐',
					icon: 'none',
					duration: 1500
				})
			},
			catHandle (index) {
				this.currentIndex = index
				const _this = this
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					const query = uni.createSelectorQuery()
					query.select('.through-index').boundingClientRect((rect) => {
						if (rect) {
							uni.pageScrollTo({
								scrollTop: 9999
							})
							clearInterval(_this.timer)
						}						
					}).exec()
				}, 500)
			},
			async queryLevelList () {
				uni.showLoading({
					title: '加载中',
					icon: 'loading'
				})
				const res = await this.$http.post('/applet/breakThrough/queryLevelList', {})
				this.pageData = res.data
				uni.hideLoading()
				const _this = this
				if (this.refresh) {
					this.timer = setInterval(() => {
						const query = uni.createSelectorQuery()
						query.select('.through-index').boundingClientRect((rect) => {
							if (rect) {
								uni.pageScrollTo({
									scrollTop: 9999
								})
								clearInterval(_this.timer)
								_this.refresh = false
							}						
						}).exec()
					}, 500)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.through-index {
		.voice {
			position: fixed;
			top: 200rpx;
			left: 30rpx;
			width: 100rpx;
			height: 58rpx;
			border-radius: 30rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.bg {
			width: 100%;
			vertical-align: middle;
		}
		.cat-container {
			width: 100%;
			box-sizing: border-box;
			padding: 0 14rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			.cat-box {
				width: 100%;
				height: 100rpx;
				border-radius: 50rpx 50rpx 0 0;
				background: linear-gradient(180deg, #FFFFFF 0%, #B8D4FF 100%);
				box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.25);
				box-sizing: border-box;
				padding: 0 15rpx;
				.scroll-view_H {
					width: 100%;
					height: 100%;
					white-space: nowrap;
					.cat-item {
						height: 100%;
						display: inline-flex;
						justify-content: center;
						align-items: center;
						&.active {
							.text {
								width: 250rpx;
								height: 66rpx;
								background-image: url(../../static/images/through/cat_bg2.png);
								font-size: 30rpx;
								color: #7E6A00;
								padding-left: 45rpx;
								image {
									width: 20rpx;
									height: 25rpx;
									margin-left: 20rpx;
								}
							}
						}
						.text {
							width: 177rpx;
							height: 46rpx;
							background-image: url(../../static/images/through/cat_bg1.png);
							background-size: 100% 100%;
							color: #ffffff;
							font-size: 24rpx;
							box-sizing: border-box;
							// padding-left: 30rpx;
							padding-left: 35rpx;
							padding-right: 30rpx;
							line-height: 46rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							image {
								width: 10rpx;
								height: 20rpx;
								margin-left: 10rpx;
							}
						}
					}
				}
			}
		}
		.grade-container {
			width: 151rpx;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 30rpx;
			background-color: #FCD716;
			font-size: 26rpx;
			color: #7E6A00;
			position: absolute;
			top: 2843rpx;
			left: 100rpx;
			box-sizing: border-box;
			padding-left: 15rpx;
			&.grade-container2 {
				background-color: #FF3850;
				color: #ffffff;
				top: 2980rpx;
				left: 278rpx;
				.play {
					background-color: #FF3850;
				}
			}
			&.grade-container3 {
				top: 2818rpx;
				left: 188rpx;
			}
			.play {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 64rpx;
				width: 72rpx;
				border-radius: 32rpx;
				position: absolute;
				left: -30rpx;
				top: 50%;
				transform: translateY(-50%);
				background-color: #FCD716;
				image {
					width: 20rpx;
					height: 20rpx;
				}
			}
		}
		.page-content {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			.level-item {
				position: absolute;
			}
			.level-1 {				
				top: 286rpx;
				left: 372rpx;
			}
			.level-2 {
				top: 488rpx;
				left: 323rpx;
			}
			.level-3 {
				top: 652rpx;
				left: 213rpx;
			}
			.level-4 {
				top: 832rpx;
				left: 309rpx;
			}
			.level-5 {
				top: 1030rpx;
				left: 165rpx;
			}
			.level-6 {
				top: 1030rpx;
				left: 296rpx;
			}
			.level-7 {
				top: 1248rpx;
				left: 317rpx;
			}
			.level-8 {
				top: 1416rpx;
				left: 211rpx;
			}
			.level-9 {
				top: 1645rpx;
				left: 350rpx;
			}
			.level-10 {
				top: 1867rpx;
				left: 219rpx;
			}
			.level-11 {
				top: 2030rpx;
				left: 318rpx;
			}
			.level-12 {
				top: 2222rpx;
				left: 287rpx;
			}
			.level-13 {
				top: 2430rpx;
				left: 292rpx;
			}
			.level-14 {
				top: 2430rpx;
				left: 430rpx;
			}
			.level-15 {
				top: 2624rpx;
				left: 241rpx;
			}
			.level-16 {
				top: 2833rpx;
				left: 364rpx;
			}
		}
	}
</style>
