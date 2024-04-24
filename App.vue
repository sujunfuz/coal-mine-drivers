<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
		font-size: 28rpx;
		word-wrap: break-word;
		color: #2A2A2A;
	}
	@import "uview-ui/index.scss";
	@import "common/common.scss";
</style>