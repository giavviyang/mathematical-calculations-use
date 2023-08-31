<script>
	export default {
		globalData: {
			statusBarHeight: '',
			isIPhoneX: false,
			timer: null,
			minutes: 0
		},
		onLaunch: async function() {
			console.log('App Launch')
			let that = this
			uni.getSystemInfo({
				success: function(res) {
					that.globalData.statusBarHeight = res.statusBarHeight
					if (res.model.indexOf('iPhone X') != -1 || res.model.indexOf('iPhone XR') != -1  || res.model.indexOf('iPhone XS Max') != -1 ) {
						that.globalData.isIPhoneX = true
					}
				}
			})
			this.globalData.timer = setInterval(() => {
				that.globalData.minutes = that.globalData.minutes + 1
			}, 1000)
			//#ifdef MP-WEIXIN
			uni.setInnerAudioOption({
			  mixWithOther: true,
			  obeyMuteSwitch: false
			})
			//#endif			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
			clearInterval(this.globalData.timer)
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
