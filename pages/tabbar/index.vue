<template>
	<view class="tabbarindex">
		<!-- <view>
			<u-button type="primary" text="煤运登记" @click='popupShow=true'></u-button>
		</view> -->
		<view class="content">
			<view class="content_li" v-for="(item,index) in menuList" :key='index'>
				<view class="fontsize30 color999">{{item.title}}</view>
				<view class="flex-c marT20">
					<view style="width: 25%;"  @click="goUrl(list)" v-for="(list,index1) in item.child" :key='index1'>
						<image class="img1" :src="list.image" mode="scaleToFill"></image>
						<view class="marT10 textC">{{list.title}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 登记 -->
	<!-- 	<view @touchmove.stop.prevent="()=>{return false}">
			<u-popup :show="popupShow" :safeAreaInsetBottom='false' mode="center" round="10" :closeable='true'
				@close="popupShow=false;value=''">
				<view class="directSaleView" @touchmove.stop.prevent="()=>{return false}">
					<view class="textC">煤运口令</view>
					<view class='marT30'>
						<u-input v-model='value' :customStyle='inputStyle' placeholder="请输入煤运口令" clearable>
						</u-input>
					</view>
					<view class="minbts bgMain colorfff marT30" style="width: 100%;" @tap="$u.throttle(confirm, 500)">确定
					</view>
				</view>
			</u-popup>
		</view> -->
	</view>
</template>


<script>
	import menulist from '@/common/menuList.js'
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				title: '首页',
				rs: '',
				popupShow: false,
				value: '',
				inputStyle: {
					padding: '15rpx 20rpx',
					background: '#F6F6F6',
					width: '520rpx'
				},
				menuList: [],
			}
		},
		onLoad() {
			let list = JSON.parse(JSON.stringify(menulist))
			this.menuList = list;
		},
		methods: {
			goUrl(e){
				if (!this.isLogin) {
					this.showMsg('请先登录解锁更多功能吧~')
					return
				}
				console.log(e.plateType)
				if ((this.plateType!=e.plateType)&&e.plateType!=-1) {
					this.showMsg('车辆类型不符，请确认后重试~')
					return
				}
				this.goToPage(e.url)
			},
			
			
			confirm() {
				if (!this.value) {
					this.showMsg('请输入煤运口令')
					return
				}
				if (this.value != '1234') {
					this.showMsg('煤运口令错误')
					return
				}
				this.goToPage('/pages/index/register')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabbarindex {
		width: 100%;
		min-height: 100vh;
		background: #fff;
		// align-items: center;
		// justify-content: center;

		.content {
			padding: 30rpx;

			.content_li {
				border-radius: 20rpx;
				background-color: #fff;
				
				.title {
					font-size: 26rpx;
					color: #959595;
					margin-left: 40rpx;
				}

				.img1 {
					width: 110rpx;
					height: 110rpx;
					margin: auto;
					display: block;
				}
			}
		}

		.directSaleView {
			padding: 30rpx;
		}
	}
</style>