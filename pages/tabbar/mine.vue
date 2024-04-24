<template>
	<view class="minebg">
		<image class="img1bg" src="@/static/mine/minebg.png" mode="scaleToFill"></image>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar leftIcon=' ' :title="' '" :titleStyle='{"color":"#fff"}' fixed :placeholder='true'
			:bgColor="navTopShow?'rgba(0,0,0,0)':'rgba(0,0,0,0)'"></u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<u-navbar leftIcon=' ' title="我的" :titleStyle='{"color":"#fff"}' fixed :placeholder='true'
			:bgColor="navTopShow?'rgba(0,0,0,0)':'rgba(0,0,0,0)'"></u-navbar>
		<!-- #endif -->

		<view class="mineContent">
			<view class="infoView flex-cb">
				<view v-if="isLogin" class="flex-c">
					<u-avatar :src="require('../../static/mine/yidenglu.png')" size="43"></u-avatar>
					<view class="colorfff marL20 u-line-1 fontsize32 fontbold">{{userInfo.username}}</view>
				</view>
				<view v-else class="flex-c" @click="wxlogin()">
					<u-avatar :src="'../../static/mine/yidenglu.png'" size="43"></u-avatar>
					<view class="colorfff marL20 u-line-1">未登录</view>
				</view>
			</view>
			<view class="cellView">
				<view class="cell_li marT30 flex-cb" v-for="(it,i) in tabs" :key='i'
					@tap="checkDeving(it.url,it.isLogin)">
					<view class="flex-c">
						<image class="imgicon2" :src="it.img" mode="scaleToFill"></image>
						<view class="marL16">{{it.label}}</view>
					</view>
					<view v-if='i==0'
						:class="userInfo.certified?'colorGreen':!userInfo.certified&&userInfo.plateNumber&&isLogin?'colorYellow':'colorRed'">
						{{userInfo.certified?'已认证':!userInfo.certified&&userInfo.plateNumber&&isLogin?'认证中':'未认证'}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				navTopShow: false,
				phoneShow: false,
				tabs: [{
					label: '实名认证',
					img: "../../static/mine/icon1.png",
					url: "/pages/mine/realName",
					isLogin: true
				},{
					label: '卡片信息',
					img: "../../static/mine/icon2.png",
					url: "/pages/mine/cardInfo",
					isLogin: true
				}, {
					label: '设置',
					img: "../../static/mine/icon3.png"
				}],
			}
		},
		onPageScroll(e) {
			this.navTopShow = e.scrollTop > 88 ? true : false;
		},
		onShow() {
			if(this.isLogin){
				this.getUserInfo()
			}
		},
		methods: {
			getUserInfo() {
				commonApi.getUserInfo().then((res) => {
					if (res.status == 200) {
						this.userInfo = res.data;
						uni.setStorageSync('userInfo', res.data);
					}
				});
			},
			wxlogin() {
				uni.showLoading({
					title: '加载中',
				})
				wx.login({
					success: (reswx) => {
						commonApi.wxlogin({
							code: reswx.code
						}).then(res => {
							if (res.status == 200) {
								uni.hideLoading()
								this.isLogin = true;
								uni.setStorageSync('isLogin', true);
								this.userInfo = res.data;
								uni.setStorageSync('userInfo', res.data);
								uni.setStorageSync('token', res.data.accessToken);
							}
						})
					}
				})

			},
		},
	}
</script>

<style lang="scss" scoped>
	button::after {
		border: none;
	}

	button {
		background-color: transparent;
		padding: 0;
		margin: 0;
		line-height: inherit;
		border-radius: 0;
		text-align: left;
		font-size: 30rpx;
		font-weight: 500;
	}

	.minebg {
		min-height: calc(100vh - var(--window-bottom));
		position: relative;

		.img1bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			/* #ifdef MP-WEIXIN */
			height: 400rpx;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			height: 338rpx;
			/* #endif */
		}

		.mineContent {
			padding: 0 24rpx;
			position: relative;

			.infoView {
				margin-top: 88rpx;

				.imghead {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}


			.cellView {
				margin-top: 120rpx;

				.cell_li {
					border-radius: 20rpx;
					background: #fff;
					padding: 30rpx;

					.imgicon2 {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
		}
	}
</style>