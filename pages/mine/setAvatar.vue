<template>
	<view  class="set-avatar">
		<view :style="{ height: statusBarHeight + 45 + 'px', paddingTop: statusBarHeight + 'px'}" class="header">
			<image @click="navigateBack" src="../../static/images/Snipaste_2021-12-24_10-25-34.png" mode="widthFix"></image>
			<view class="title">头像设置</view>
		</view>
		<view class="top-section">
			<image class="bg" src="../../static/images/mine/avatar_bg.jpg" mode="widthFix"></image>
			<view class="avatar-box">
				<view class="avatar-content">
					<image v-if="frameTemp.image" class="frame" :src="frameTemp.image" mode="widthFix"></image>
					<image v-else-if="frameUsed.image" class="frame" :src="frameUsed.image" mode="widthFix"></image>
					<view v-if="userInfo.studentPortrait" class="avatar">
						<image :src="`${userInfo.studentPortrait}&newDate=${new Date().getTime()}`" mode="aspectFill"></image>
					</view>
					<image @click="isShowActions = true" class="upavatar" src="../../static/images/mine/upavatar.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="list-box">
			<view class="title">
				<view class="line"></view>
				<view class="text">更换头像框</view>
				<view class="line"></view>
			</view>
			<view class="list">
				<view @click="setAvatar(item)" v-for="(item, index) in avatarFrameList" :key="index" class="item">
					<view v-if="frameUsed.id == item.id" class="used">使用中</view>
					<image :src="item.image" mode="widthFix"></image>
					<view class="name">{{item.name}}</view>
					<view class="desc">{{item.describe}}</view>
				</view>
			</view>
		</view>
		<view class="actions">
			<view @click="jumpHandle('/pages/mine/pointMall')" class="action-item">获取更多</view>
			<view @click="saveFrame" class="action-item save">保存</view>
		</view>
		<view v-if="isShowActions" class="action-sheet">
			<view class="content">
				<view class="sheets">
					<view @click.stop="chooseImg(1)" class="btn">拍照</view>
					<view @click.stop="chooseImg(2)" class="btn">从相册选择</view>
				</view>				
				<view @click.stop="isShowActions = false" class="cancel">取消</view>
			</view>
		</view>
		<RestModal ref="rest" />
	</view>
</template>

<script>
	import app from '../../App.vue'
	import http from '../../common/js/http.js'
	import RestModal from '../../component/restmodal.vue'
	export default {
		components: {
			RestModal
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				userInfo: {},
				avatarFrameList: [],
				isShowActions: false,
				frameUsed: {},
				frameTemp: {}
			}
		},
		onLoad () {
			console.log(http)
			this.getUserInfo()
			this.getMyAvatarFrame()
			this.getUsed()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			// 保存设置
			async saveFrame () {
				if (!this.frameTemp.image) {
					uni.showToast({
						title: '请选择头像框',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				const res = await this.$http.post('/applet/modifyPortraitFrame', {id: this.frameTemp.id})
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 1500
				})
				// this.getUsed()
				console.log(res)
			},
			// 切换头像框
			setAvatar (item) {
				console.log(item)
				this.frameTemp = item
			},
			// 获取正在使用的头像框
			async getUsed () {
				const res = await this.$http.post('/applet/portraitBoxInUse', {})
				console.log('正在使用的头像框：', res)
				this.frameUsed = res.data
			},
			chooseImg (type) {
				const _this = this
				if (type == 1) {
					uni.chooseImage({
					    count: 1, //默认9
					    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['camera '], //从相册选择
					    success: function (res) {
					        console.log(JSON.stringify(res.tempFilePaths));
							_this.upLoadAvatar(res.tempFilePaths[0])
					    }
					})
				} else if (type == 2) {
					uni.chooseImage({
					    count: 1, //默认9
					    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['album'], //从相册选择
					    success: function (res) {
					        console.log(JSON.stringify(res.tempFilePaths));
							_this.upLoadAvatar(res.tempFilePaths[0])
					    }
					})
				}
				
			},
			// 头像上传
			upLoadAvatar (tempFilePath) {
				const _this = this
				const access_token = uni.getStorageSync('token')
				const Cookie = uni.getStorageSync('cookie')
				uni.uploadFile({
					url: http.baseUrl + '/applet/modifyPortrait', //仅为示例，非真实的接口地址
					filePath: tempFilePath,
					header: {
						"Authorization": access_token,
						"Cookie": Cookie,
						"content-type": 'application/x-www-form-urlencoded'
					},
					name: 'file',
					success: (uploadFileRes) => {
						console.log(uploadFileRes.data, 1111);
						uni.showToast({
							title: JSON.parse(uploadFileRes.data).msg,
							icon: 'none',
							duration: 1500
						})
						_this.userInfo = {}
						_this.getUserInfo()
						_this.isShowActions = false
						// _this.isShowActions = false
						// setTimeout(() => {
						// 	_this.getUserInfo()
						// }, 1000)
					}
				});
			},
			// 跳转
			jumpHandle (path) {
				uni.navigateTo({
					url: path
				})
			},
			// 获取我的头像框列表
			async getMyAvatarFrame () {
				const res = await this.$http.post('/applet/queryMyAvatarFrame', {})
				console.log('我的头像框列表：', res)
				this.avatarFrameList = res.data
			},
			// 获取用户信息
			async getUserInfo () {
				const res = await this.$http.post('/applet/getStudentsInfo', {})
				console.log(res.data)
				this.userInfo = res.data
			},
			// 返回上一页
			navigateBack () {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	@keyframes popUp {
		from {
			transform: translateY(100%);
		} 
		to {
			transform: translateY(0);
		}
	}
	.action-sheet {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		background-color: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		.content {
			transform: translateY(100%);
			animation: popUp .3s forwards;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
			padding: 30rpx;
			padding-bottom: 50rpx;
			.sheets {
				background-color: #ffffff;
				box-sizing: border-box;
				padding: 0 20rpx;
				border-radius: 15rpx;
				.btn {
					display: flex;
					justify-content: center;
					align-items: center;
					border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);
					font-size: 32rpx;
					height: 110rpx;
					&:last-child {
						border-bottom: 0 none;
					}
				}
			}
			.cancel {
				background-color: #ffffff;
				border-radius: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				height: 110rpx;
				margin-top: 20rpx;
			}
		}
	}
	.set-avatar {
		min-height: 100vh;
		background-color: #F5F5F5;
		box-sizing: border-box;
		padding-bottom: 130rpx;
		.actions {
			position: fixed;
			left: 0;
			bottom: 0;
			background-color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 999;
			width: 100%;
			padding: 25rpx 30rpx;
			box-sizing: border-box;
			.action-item {
				background-color: #ffffff;
				border: 1rpx solid #24A9FF;
				flex: 1;
				height: 72rpx;
				color: #24A9FF;
				border-radius: 36rpx;
				font-size: 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				&:last-child {
					margin-left: 30rpx;
					background-color: #24A9FF;
					color: #ffffff;
				}
			}
		}
		.list-box {
			background-color: #F5F5F5;
			border-radius: 30rpx 30rpx 0 0;
			margin-top: -40rpx;
			position: relative;
			z-index: 99;
			padding-top: 30rpx;
			.list {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 30rpx 30rpx 0;
				.item {
					width: 335rpx;
					background-color: #ffffff;
					height: 406rpx;
					border-radius: 30rpx;
					box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.11);
					margin-bottom: 30rpx;
					box-sizing: border-box;
					padding: 40rpx 20rpx 0;
					image {
						width: 200rpx;
						display: flex;
						margin: 0 auto;
					}
					position: relative;
					overflow: hidden;
					.used {
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
					.name {
						font-size: 32rpx;
						margin-top: 40rpx;
					}
					.desc {
						font-size: 24rpx;
						color: #999999;
						margin-top: 10rpx;
					}
				}
			}
			.title {
				display: flex;
				justify-content: center;
				align-items: center;
				.line {
					width: 50rpx;
					height: 1px;
					background-color: #24A9FF;
				}
				.text {
					font-size: 32rpx;
					padding: 0 20rpx;
				}
			}
		}
	}
	.top-section {
		position: relative;
		width: 100%;
		image.bg {
			width: 100%;
		}
		.avatar-box {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 275rpx;
			.avatar-content {
				position: relative;
				.frame {
					position: absolute;
					bottom: -26rpx;
					width: 210rpx;
					left: 50%;
					transform: translateX(-50%);
					z-index: 200;
				}
				.upavatar {
					width: 54rpx;
					height: 54rpx;
					position: absolute;
					right: 0;
					bottom: 0;
					z-index: 300;
				}
				.avatar {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					overflow: hidden;
					position: relative;
					z-index: 10;
					image {
						width: 100%;
						height: 100%;
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
		background-color: #25a9fe;
		.title {
			padding-right: 55rpx;
			flex: 1;
			text-align: center;
			color: #ffffff;
		}
		image {
			width: 55rpx;
			height: 55rpx;
			top: var(--status-bar-height);
		}
	}
</style>
