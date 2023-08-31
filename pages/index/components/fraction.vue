<template>
	<view class="fraction-container">
		<view class="num">{{list[0]}}</view>
		<view class="line"></view>
		<view class="num">{{list[1]}}</view>
	</view>
</template>

<script>
	export default {
		name: 'Fraction',
		props: {
			str: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				list: []
			}
		},
		created () {
			this.list = this.str.split('/')
			console.log(this.str, this.list)
		}
	}
</script>

<style lang="scss" scoped>
	.fraction-container {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		.line {
			width: 100%;
			height: 4rpx;
			background-color: #333333;
		}
	}
</style>
