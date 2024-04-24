<template>
	<view>
		<view class="u-page">
			<!-- 所有内容的容器 -->
		</view>
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar v-model="current" :list="list" active-color="#3970E4" inactive-color="#959595">
		</u-tabbar>
	</view>
</template>

<script>
	import api from '@/api/login.js'
	export default {
		name: "tabbar",
		props: {
			isAgent: {
				type: String | Number,
				default: 0
			},
			showLevel: {
				type: String | Number,
				default: 4
			},
			is2Level: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				list: [{
						"iconPath": "../../../static/tab/task1.png",
						"selectedIconPath": "../../../static/tab/task.png",
						text: '任务',
						isDot: true,
						customIcon: false,
						pagePath: '/pages/tabbar/index'
					},
					{
						iconPath: "../../../static/tab/yingyong1.png",
						selectedIconPath: "../../../static/tab/yingyong.png",
						text: '应用',
						customIcon: false,
						pagePath: '/pages/tabbar/application'
					},
					{
						"iconPath": "../../../static/tab/xiaoxi1.png",
						"selectedIconPath": "../../../static/tab/xiaoxi.png",
						text: '消息',
						isDot: true,
						count: 0,
						customIcon: false,
						pagePath: '/pages/tabbar/msgcenter'
					},
					{
						"iconPath": "../../../static/tab/me1.png",
						"selectedIconPath": "../../../static/tab/me.png",
						text: '我的',
						isDot: false,
						customIcon: false,
						pagePath: '/mine/index'
					},
				],
				current: 0,
				userType: ''
			};
		},
		onShow() {
			this.getStats()
		},

		methods: {

			getStats() {
				api.stats().then(res => {
					this.list[2].count = res.data.data.unread;
					this.$forceUpdate()
				})
			},

		},
	};
</script>

<style scoped lang="scss">
	.area-ctn {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
		background: #fff;
		z-index: 50000;

		.area-v1 {
			border-bottom: 1rpx solid #ebebeb;
			display: flex;
			justify-content: space-between;

			.areav1item {
				padding: 25rpx;
				// border: 1px solid red;
			}

			.area-sure {
				color: #0081ff;
				// border: 1px solid red;
			}
		}

		.mpvue-picker-view {
			height: 500rpx;
		}

		.item {
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.act-item {
		color: #0081ff;
		font-weight: bold;
	}
</style>
