<template>
	<view class="login-container">
    <view class="top-section pad" v-if="isPad">
    	<image class="bg" src="https://www.fudian.co:8443/applet/file/ioReadImage?fileId=iPadLoginBackground.gif" mode="widthFix"></image>
    </view>
		<view class="top-section" v-else>
			<image class="bg" src="https://www.fudian.co:8443/applet/file/ioReadImage?fileId=loginBackgroundMap.gif" mode="widthFix"></image>
		</view>
		<view :class="[isPad ? 'pad' : '', 'page-content']">
			<view class="login-form">
				<view class="form-item-container">
					<image class="decoration" src="../../static/images/decoration.png" mode="aspectFit"></image>
					<view class="form-item" :class="{padInput: isPad}">
						<image src="../../static/images/username.png" class="form-item-icon" mode="widthFix"></image>
						<input v-model="username" type="text" class="form-value" placeholder="请输入学生ID">
					</view>
				</view>
				<view class="form-item-container">
					<image class="decoration" src="../../static/images/decoration.png" mode="aspectFit"></image>
					<view class="form-item" :class="{padInput: isPad}">
						<image src="../../static/images/password.png" class="form-item-icon" mode="widthFix"></image>
						<input v-model="password" type="password" class="form-value" placeholder="请输入密码">
						<view @click="forgetPassword" class="forget-password">忘记密码</view>
					</view>
				</view>
				<view @click="loginHandle" class="login-btn" :class="{active: username && password && isAgree, 'pad-btn': isPad}">
					登录
				</view>
			</view>
			<view class="agreement">
				<image @click="isAgree = !isAgree" v-if="isAgree" src="../../static/images/checkbox_checked.png" mode="widthFix"></image>
				<image @click="isAgree = !isAgree" v-else src="../../static/images/checkbox_unchecked.png" mode="widthFix"></image>
				<text @click="jumpHandle">登录并注册即视为同意<text class="agreement-text">《用户协议及隐私政策》</text>，我们不会向任何人泄露您的信息</text>
			</view>
		</view>		
		<view v-if="isShowModal" class="modal">
			<view class="content">
				<image @click="isShowModal = false" src="../../static/images/modal/close.png" mode="widthFix" class="close"></image>
				<view class="title">是否恢复初始密码</view>
				<view class="desc">
					<view>系统将自动恢复密码</view>
					<view>为你的ID后6位哦！</view>
				</view>
				<view class="actions">
					<view @click="isShowModal = false" class="btn cancel">取消</view>
					<view @click="resetPassword" class="btn confirm">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				username: '',
				password: '',
				isAgree: false,
				isShowModal: false,
				isPad: false
			}
		},
		onLoad () {
			uni.clearStorageSync()
			const _this = this
			uni.getSystemInfo({
				success: function(res) {
					_this.platform = res.platform
					// _this.isPad = true
					if (res.model.indexOf('Pad') != -1 || res.screenWidth >= 450) {
						_this.isPad = true
					}
				}
			})
		},
		methods: {
			forgetPassword () {
				if (!this.username) {
					uni.showToast({
						title: '学生ID不能为空',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				this.isShowModal = true
			},
			async resetPassword () {
				uni.clearStorageSync()
				const res = await this.$http.post('/applet/restablecerContrasena', {username: this.username})
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 1500
				})
				this.isShowModal = false
			},
			jumpHandle () {
				uni.navigateTo({
					url: '/pages/login/agreement'
				})
			},
			async loginHandle () {
				if (!this.username) {
					uni.showToast({
						title: '学生ID不能为空',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.password) {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.isAgree) {
					uni.showToast({
						title: '未勾选《用户协议和隐私政策》',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				uni.clearStorageSync()
				const res = await this.$http.post('/applet/login', { username: this.username, password: this.password})
				console.log(res)
				uni.setStorageSync("token", res.token)
				uni.setStorageSync("JSESSIONID", res.JSESSIONID)
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.login-container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		.page-content {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
			// height: 100vh;
			// display: flex;
			// flex-direction: column;
			// justify-content: space-between;
			&.pad {
				// justify-content: flex-end;
				.login-form {
					padding-top: 0;
				}
			}
		}
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
			z-index: 99;
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
					margin-top: 15rpx;
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
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;
		.cover {
			image {
				width: 100%;
				height: auto;
				z-index: -1;
			}
		}
		.agreement {
			z-index: 3;
			margin-top: 50rpx;
			padding: 0 64rpx;
			font-size: 26rpx;
			color: #FFFFFF;
			display: flex;
			margin-bottom: 50rpx;
			.iconfont {
				margin-right: 20rpx;
			}
			.text {
				text-align: justify;
			}
			.agreement-text {
				color: #00ffff;
			}
			image {
				width: 40rpx;
				height: 40rpx;
				vertical-align: middle;
				margin-top: 8rpx;
				margin-right: 10rpx;
			}
		}
		.login-form {
			z-index: 2;
			padding: 0 64rpx;
			padding-top: 760rpx;
			
			.form-item-container {
				// margin-bottom: 40rpx;
				&:last-child {
					margin-bottom: 0;
				}
				.decoration {
					position: absolute;
					width: 50rpx;
					height: 48rpx;
					right: 30rpx;
					top: -17rpx;
				}
			}
			.form-item {
				position: relative;
				z-index: 1;
				display: flex;
				align-items: center;
				height: 110rpx;
				background-color: #F2F3F7;
				border-radius: 60rpx;
				padding: 0 45rpx;
				box-sizing: border-box;
				margin-top: 30rpx;
        &.padInput{
          height: 90rpx;
          .form-item-icon{
            width: 48rpx;
            height: 48rpx;
          }
        }
				.form-item-icon {
					width: 58rpx;
					height: 58rpx;
				}
				.form-value {
					flex: 1;
					height: 100%;
					font-size: 32rpx;
					padding-left: 26rpx;
				}
				.forget-password {
					color: #BBBBBB;
					font-size: 30rpx;
				}
			}
			.login-btn {
				margin-top: 30rpx;
				height: 110rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-image: url(../../static/images/login_btn.png);
				background-size: 100% 100%;
				font-size: 42rpx;
				color: #ffffff;
        &.pad-btn{
          height: 90rpx;
        }
				&.active {
					background-color: #36AFFF;
					box-shadow: 7rpx 8rpx 0px 0px #0A8ADF;
					background-image: none;
					border-radius: 55rpx;
				}
			}
		}
	}
	.top-section {
		width: 100%;
		height: 100vh;
		overflow: hidden;
    position: relative;
		.bg {
			width: 100%;
      height: 100%;
		}
		&.pad {
			.bg {
				// transform: translateY(-280rpx);
			}
		}
	}
</style>
