<template>
	<view class="recordListbg">
		<view class="bgfff" v-if="plateType==2">
			<u-tabs :list="tabs" @click="tabsClick" keyName='label' :scrollable='false' :current='current'></u-tabs>
		</view>
		<view class="pad30" v-if="isLogin">
			<view class="cards flex-cb" v-for="(it,i) in dataList" :key="i" @click="goDetails(it)">
				<view>
					<view>{{it.plateNumber}}</view>
					<view class="marT10 color666">{{it.fillCar}}</view>
					<view class="marT10 color999 fontsize24">{{it.createDate}}</view>
				</view>
				<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
			</view>
			<view style="margin: 40rpx 0;">
				<u-loadmore :status="status" />
			</view>
		</view>
		<view v-else class="pad30">
			<u-loadmore status="nomore" nomoreText='登录后解锁更多服务~' />
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				page: 1,
				size: 10,
				status: 'loading',
				dataList: [],
				total: 0,

				tabs: [{
					label: '入库记录',
					value: 0,
				}, {
					label: '装油记录',
					value: 1,
				}, ],
				current: 0,
			}
		},
		onShow() {
			if (this.isLogin) {
				switch (this.plateType) {
					case 0:
						this.page = 1;
						this.status = 'loading';
						this.dataList = [];
						this.freightSettlementList()
						break;
					case 1:
						this.page = 1;
						this.status = 'loading';
						this.dataList = [];
						this.oilRecordList()
						break;
					case 2:
						if (this.current == 0) {
							this.page = 1;
							this.status = 'loading';
							this.dataList = [];
							this.oilRecordList()
						} else {
							this.page = 1;
							this.status = 'loading';
							this.dataList = [];
							this.oilFillList()
						}

						break;
				}
			}
		},
		methods: {
			tabsClick(e) {
				this.current = e.value;
				if (this.current == 0) {
					this.page = 1;
					this.status = 'loading';
					this.dataList = [];
					this.oilRecordList()
				} else {
					this.page = 1;
					this.status = 'loading';
					this.dataList = [];
					this.oilFillList()
				}
			},
			//煤运登记
			freightSettlementList() {
				commonApi.freightSettlementList({
					page: this.page,
					size: this.size,
				}).then((res) => {
					if (res.status == 200) {
						let resOrderList = res.data.records;
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.size) {
							this.status = "nomore";
						}
					}
				});
			},
			//  大 小罐车的入库记录
			oilRecordList() {
				commonApi.oilRecordList({
					page: this.page,
					size: this.size,
					plateType: this.plateType, //plateType 1大罐  2小罐
				}).then((res) => {
					if (res.status == 200) {
						let resOrderList = res.data.records;
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.size) {
							this.status = "nomore";
						}
					}
				});
			},
			//小罐车 装油记录
			oilFillList() {
				commonApi.oilFillList({
					page: this.page,
					size: this.size,
				}).then((res) => {
					if (res.status == 200) {
						let resOrderList = res.data.records;
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.size) {
							this.status = "nomore";
						}
					}
				});
			},
			goDetails(it) {
				switch (this.plateType) {
					case 0:
						this.goToPage('/pages/mine/recordDetails?id=' + it.id)
						break;
					case 1:
						this.goToPage('/pages/index/oildetails?id=' + it.id)
						break;
					case 2:
						if (this.current == 0) {
							this.goToPage('/pages/index/oildetails?id=' + it.id)
						} else {
							this.goToPage('/pages/index/oilfilldetails?id=' + it.id)
						}
						break;
				}

			}
		},

		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			switch (this.plateType) {
				case 0:
					this.page = 1;
					this.status = 'loading';
					this.dataList = [];
					this.freightSettlementList()
					break;
				case 1:
					this.page = 1;
					this.status = 'loading';
					this.dataList = [];
					this.oilRecordList()
					break;
				case 2:
					if (this.current == 0) {
						this.page = 1;
						this.status = 'loading';
						this.dataList = [];
						this.oilRecordList()
					} else {
						this.page = 1;
						this.status = 'loading';
						this.dataList = [];
						this.oilFillList()
					}

					break;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.recordListbg {
		width: 100%;
		min-height: 100%;

		.cards {
			padding: 20rpx;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			background: #fff;
		}
	}
</style>
