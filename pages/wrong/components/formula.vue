<template>
	<view class="formula-container">
		<view class="formula-item" v-for="(item, index) in list" :key="index">
			<Fraction class="formula-item-text" v-if="item.indexOf('/') > -1" :str="item" />
			<text v-else class="formula-item-text">{{item}}</text>
			<!-- <text>{{item}}{{item.indexOf('/') > -1}}</text> -->
		</view>
	</view>
</template>

<script>
	import Fraction from './fraction.vue'
	export default {
		name: 'Formula',
		components: {
			Fraction
		},
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
			// console.log(this.str)
			this.list = this.str.split('#')
			// console.log(this.list)
		}
	}
</script>

<style lang="scss" scoped>
	.formula-container {
		display: inline-flex;
		align-items: center;
		.formula-item {
			display: inline-block;
			.formula-item-text {
				padding: 0 10rpx;
			}
		}
	}
</style>
