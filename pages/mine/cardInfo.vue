<template>
	<view class="cardInfobg">
		<view class="pad30">
			<view class="marT20 flex-c">
				<view>{{cardNo}}</view>
				<view class="marL20 colorMain" @click="copyText(cardNo)">复制</view>
			</view>
			<view class="marT30 flex-c">
				<view>{{bank}}</view>
				<view class="marL20 colorMain" @click="copyText(bank)">复制</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ossIconUrl: this.$request.ossIconUrl,
				cardNo:"6212260509006308183",
				bank:"中国工商银行兴县支行"
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.cardInfobg{
	}
</style>
