<template>
	<view class="loading" v-if="isShow">
		<image :src="require(`./puff.svg`)" />
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false
			}
		},
		

		methods: {
			show() {
				this.isShow = true;
			},
			
			hide() {
				this.isShow = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loading {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.1);
		image {
			width: 110rpx;
			height: 110rpx;
			transform: translateY(-100%);
		}
	}
	.text{
		
	}
</style>
