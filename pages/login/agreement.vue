<template>
	<view class="agreement-container">
		<view class="content" v-html="content"></view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				content: ''
			}
		},
		onLoad () {
			this.getContent()
		},
		methods: {
			async getContent () {
				const res = await this.$http.post('/applet/queryUserAgreement', {})
				console.log(res)
				this.content = res.data
			}
		}
	}
</script>

<style lang="scss" scoped>
	.agreement-container {
		box-sizing: border-box;
		padding: 30rpx;
		font-size: 28rpx;
	}
</style>
