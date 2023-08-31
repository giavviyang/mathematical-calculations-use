<template>
	<view :style="{paddingTop: statusBarHeight + 45 + 'px'}" class="reset-password">
		<view :style="{ height: statusBarHeight + 45 + 'px', paddingTop: statusBarHeight + 'px'}" class="header">
			<image @click="navigageBack" src="../../static/images/Snipaste_2021-12-24_10-25-34.png" mode="widthFix"></image>
			<view class="title">修改密码</view>
		</view>
		<view class="form">
			<view class="form-item">
				<view class="label">学生ID：</view>
				<view class="form-value">{{studentID}}</view>
			</view>
			<view class="form-item">
				<view class="form-value">
					<input v-if="oldType == 'password'" v-model="oldPassword" type="password" placeholder="请输入原密码">
					<input v-else v-model="oldPassword" type="text" placeholder="请输入原密码">
				</view>
				<view @click="changeType('oldType')" class="eyes">
					<image src="../../static/images/mine/eyes.png" mode="aspectFit"></image>
				</view>				
			</view>
			<view class="form-item">
				<view class="form-value">
					<input v-if="newType == 'password'" v-model="newPassword" type="password" placeholder="请输入新密码">
					<input v-else v-model="newPassword" type="text" placeholder="请输入新密码">
				</view>
				<view class="eyes" @click="changeType('newType')">
					<image src="../../static/images/mine/eyes.png" mode="aspectFit"></image>
				</view>
				
			</view>
		</view>
		<view class="actions">
			<view @click="saveHandle" class="btn">确认</view>
		</view>
	</view>
</template>

<script>
	import app from '../../App.vue'
	export default {
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				studentID: '',
				oldPassword: '',
				newPassword: '',
				oldType: 'password',
				newType: 'password'
			}
		},
		onLoad(options) {
			this.studentID = options.studentID
		},
		methods: {
			changeType (type) {
				console.log(111)
				console.log(this[type])
				this[type] = this[type] == 'password' ? 'text' : 'password'
			},
			async saveHandle () {
				if (!this.oldPassword) {
					uni.showToast({
						title: '请输入原密码',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				if (!this.newPassword) {
					uni.showToast({
						title: '请输入新密码',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				const res = await this.$http.post('/applet/modifyPassword', { oldPassword: this.oldPassword, newPassword: this.newPassword})
				uni.showToast({
					title: '密码修改成功，请重新登录',
					icon: 'none',
					duration: 1500,
					success: function () {
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/login/index'
							})
						}, 1500)
					}
				})
			},
			navigageBack () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.reset-password {
		min-height: 100vh;
		background-color: #F5F5F5;
		box-sizing: border-box;
		padding-left: 30rpx;
		padding-right: 30rpx;
		.actions {
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 25rpx 0;
			.btn {
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #24A9FF;
				color: #ffffff;
				font-size: 32rpx;
				height: 72rpx;
				border-radius: 36rpx;
				width: 595rpx;
			}
		}
		.form {
			background-color: #ffffff;
			border-radius: 30rpx;
			overflow: hidden;
			padding: 0 30rpx;
			.form-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 105rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
				&:last-child {
					border-bottom: 0 none;
				}
				.form-value {
					height: 100%;
					flex: 1;
					font-size: 32rpx;
					display: flex;
					align-items: center;
					input {
						height: 100%;
					}
				}
				.label {
					font-size: 32rpx;
				}
				.iconfont {
					color: #C1C1C1;
				}
				.eyes {
					height: 100%;
					display: flex;
					align-items: center;
					width: 40rpx;
					height: 40rpx;
					justify-content: flex-end;
					image {
						width: 100%;
						height: 50rpx;
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
		background-color: #F5F5F5;
		.title {
			padding-right: 55rpx;
			flex: 1;
			text-align: center;
		}
		image {
			width: 55rpx;
			height: 55rpx;
			top: var(--status-bar-height);
		}
	}
</style>
