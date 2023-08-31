<template>
	<view :style="{paddingTop: statusBarHeight + 45 + 'px'}" class="userinfo-container">
		<view :style="{ height: statusBarHeight + 45 + 'px', paddingTop: statusBarHeight + 'px'}" class="header">
			<image @click="navigateBack" src="../../static/images/Snipaste_2021-12-24_10-25-34.png" mode="widthFix"></image>
			<view class="title">个人信息</view>
		</view>
		<view class="section">
			<view @click="jumpHandle('/pages/mine/setAvatar')" class="item">
				<view class="label">我的头像</view>
				<image class="avatar" :src="`${studentPortrait}&newDate=${new Date().getTime()}`" mode="aspectFill"></image>
				<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
			</view>
			<view class="item">
				<view class="label">修改昵称</view>
				<input @blur="editName" v-model="nickName" type="text" class="value">
				<!-- <image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image> -->
			</view>
		</view>
		<view class="section">
			<view class="item">
				<view class="label">年级班级</view>
				<view class="value">{{userInfo.studentGrade}}</view>
			</view>
			<view class="item">
				<view class="label">学校</view>
				<view class="value">{{userInfo.schoolName}}</view>
			</view>
		</view>
		<view class="section">
			<view class="item">
				<view class="label">我的登录ID</view>
				<view class="value">{{userInfo.studentId}}</view>
			</view>
			<view @click="jumpHandle('/pages/mine/resetPassword?studentID=' + userInfo.studentId)" class="item">
				<view class="label">修改密码</view>
				<image class="more" src="../../static/images/mine/more.png" mode="widthFix"></image>
			</view>
		</view>
		<RestModal ref="rest" />
	</view>
</template>

<script>
	import app from '../../App.vue'
	import RestModal from '../../component/restmodal.vue'
	export default {
		components: {
			RestModal
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight,
				userInfo: {},
				nickName: '',
				studentPortrait: ''
			}
		},
		onLoad () {
			
		},
		onShow () {
			this.getUserInfo()
		},
		destroyed () {
			this.$refs.rest.hideHandle()
		},
		methods: {
			jumpHandle (path) {
				uni.navigateTo({
					url: path
				})
			},
			async getUserInfo () {
				const res = await this.$http.post('/applet/getStudentsInfo', {})
				this.nickName = res.data.studentNickname
				
				if (this.studentPortrait) {
					this.studentPortrait = ''
					const _this = this
					setTimeout(() => {
						_this.studentPortrait = res.data.studentPortrait
					}, 100)
				} else {
					this.studentPortrait = res.data.studentPortrait
				}
				
				this.userInfo = res.data
				
			},
			navigateBack () {
				uni.navigateBack()
			},
			async editName () {
				if (this.nickName === this.userInfo.studentNickname) {
					return false
				}
				if (!this.nickName) {
					uni.showToast({
						title: '昵称不能为空',
						icon: 'none',
						duration: 1500
					})
					return false
				}
				const  res = await this.$http.post('/applet/modifyNickname', {nickname: this.nickName})
				console.log(res)
				uni.showToast({
					title: '昵称修改成功',
					icon: 'none',
					duration: 1500
				})
				this.getUserInfo()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo-container {
		background-color: #F5F5F5;
		min-height: 100vh;
		padding: 0 30rpx;
		box-sizing: border-box;
		.section {
			background-color: #ffffff;
			border-radius: 30rpx;
			margin-top: 30rpx;
			padding: 0 30rpx;
			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				&:last-child {
					border-bottom: 0 none;
				}
				.label {
					flex: 1;
					font-size: 32rpx;
				}
				.avatar {
					width: 110rpx;
					height: 110rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				.iconfont {
					font-size: 36rpx;
					color: #D8D8D8;
				}
				.more {
					width: 16rpx;
					height: 8rpx;
				}
				.value {
					text-align: right;
					font-size: 28rpx;
					color: #666666;
				}
				input.value {
					width: 70%;
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
