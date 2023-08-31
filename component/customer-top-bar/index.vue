<template>
	<view :style="{ color: color, height: statusBarHeight + 45 + 'px', paddingTop: statusBarHeight + 'px', background: backgroundColor}" class="customer-top-bar">
		<image v-if="canBack" @click="navigateBack" src="../../static/images/Snipaste_2021-12-24_10-25-34.png" mode="widthFix"></image>
		<view class="title">{{title}}</view>
	</view>
</template>

<script>
	import app from '../../App.vue'
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			backgroundColor: {
				type: String,
				default: 'rgba(0, 0, 0, 0)'
			},
			color: {
				type: String,
				default: '#333333'
			},
			custom: {
				type: Boolean,
				default: false
			},
			canBack: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				statusBarHeight: app.globalData.statusBarHeight
			}
		},
		methods: {
			navigateBack () {
				if (this.custom) {
					this.$emit('customHandle')
				} else {
					uni.navigateBack()
				}				
			}
		}
	}
</script>

<style scoped lang="scss">
	.customer-top-bar {
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
