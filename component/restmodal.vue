<template>
	<view v-if="isShowModal" class="rest-modal">
		<view class="content">
			<image @click="closeHandle" class="close" src="../static/images/modal/close.png" mode="aspectFit"></image>
			<view class="text-container">
				<view class="text">好棒呀，你已经练习了15分钟啦</view>
				<view class="text">不如休息一下眼睛吧</view>
			</view>
		</view>
	</view>
</template>

<script>
	import app from '../App.vue'
	export default {
		data () {
			return {
				timer: null,
				isShowModal: false
			}
		},
		created () {
			const _this = this
			this.timer = setInterval(() => {
				if (app.globalData.minutes >= 900) {
					_this.isShowModal = true
				} else {
					_this.isShowModal = false
				}
			}, 1000)
		},
		methods: {
			closeHandle () {
				this.isShowModal = false
				app.globalData.minutes = 0
			},
			hideHandle () {
				this.isShowModal = false
				clearInterval(this.timer)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rest-modal {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999999;
		.content {
			width: 685rpx;
			height: 339rpx;
			background-image: url(../static/images/modal/bg3.png);
			background-size: 100% 100%;
			position: relative;
			.close {
				width: 68rpx;
				height: 68rpx;
				position: absolute;
				right: 0rpx;
				top: 95rpx;
			}
			.text-container {
				font-size: 42rpx;
				color: #8F6E4D;
				text-align: right;
				box-sizing: border-box;
				padding: 177rpx 44rpx 0;
			}
		}
	}
</style>
