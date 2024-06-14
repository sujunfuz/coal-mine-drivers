<template>
	<view class="registerbg">
		<view class="bgfff">
			<u-tabs :list="tabs" @click="tabsClick" keyName='label' :scrollable='false' :current='current'></u-tabs>
		</view>
		<view class="pad20" v-if="current==0">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="进库吨数照片" prop="inImage" ref="inImage" label-width="100px" required>
						<view class="imgView">
							<image v-if="!inImage" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile(1)"></image>
							<image v-else class="fileimg1" :src="ImgUrl+inImage"></image>
							<view v-if="inImage" class="del" @click="delimg(1)">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="出库吨数照片" prop="outImage" ref="outImage" label-width="100px" required>
						<view class="imgView">
							<image v-if="!outImage" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile(2)"></image>
							<image v-else class="fileimg1" :src="ImgUrl+outImage"></image>
							<view v-if="outImage" class="del" @click="delimg(2)">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="进库吨数" prop="inTons" ref="inTons" label-width="100px" required>
						<!-- <view>{{inTons}}</view> -->
						<u--input v-model="inTons" border="none" type='digit'></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="出库吨数" prop="outTons" ref="outTons" label-width="100px" required>
						<!-- <view>{{outTons}}</view> -->
						<u--input v-model="outTons" border="none" type='digit'></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="净重吨数" prop="netTons" ref="netTons" label-width="100px" required>
						<view>{{netTons}}</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="小罐车口令" prop="checkCode" ref="checkCode" label-width="100px" required>
						<u--input v-model="checkCode" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
			</u--form>
			<view v-if="Loading" class="modifybts bg999 colorfff bdRadius20 marAuto marT32">提交中...</view>
			<view v-else class="modifybts bgMain colorfff bdRadius20 marAuto marT32" @tap.stop="oilRecordSub">提交</view>
		</view>
		<view class="pad20" v-if="current==1">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="加油图片" prop="fillImage" ref="fillImage" label-width="80px" required>
						<view class="imgView">
							<image v-if="!fillImage" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile(3)"></image>
							<image v-else class="fileimg1" :src="ImgUrl+fillImage"></image>
							<view v-if="fillImage" class="del" @click="delimg(3)">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="加油升数" prop="fillLift" ref="fillLift" label-width="80px" required>
						<view>{{fillLift}}</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="加油车型" prop="fillCar" ref="fillCar" label-width="80px" required>
						<u--input v-model="fillCar" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="加油地址" prop="fillAddress" ref="fillAddress" label-width="80px" required>
						<view class="flex-cb" @click="pickerShow=true" style="position: relative;z-index: 999;">
							<view :class="fillAddress?'':'colorc4'">{{fillAddress||"请选择"}}</view>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="小罐车口令" prop="checkCode" ref="checkCode" label-width="80px" required>
						<u--input v-model="checkCode" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
			</u--form>
			<view v-if="Loading" class="modifybts bg999 colorfff bdRadius20 marAuto marT32">提交中...</view>
			<view v-else class="modifybts bgMain colorfff bdRadius20 marAuto marT32"
				@tap="$u.throttle(oilFillSub, 1000)">提交</view>
		</view>
		<u-picker :show="pickerShow" :columns="columns" keyName="fillAddress" @cancel='pickerShow=false'
			@confirm='pickerConfirm' :closeOnClickOverlay='true'></u-picker>
	</view>
</template>

<script>
	import {
		toBase64 as convert
	} from "@/common/base64.js"
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				tabs: [{
					label: '入库登记',
					value: 0,
				}, {
					label: '加油登记',
					value: 1,
				}, ],
				current: 0,
				inputStyle: {
					padding: '15rpx 20rpx',
				},
				inImage: '',
				inTons: '',
				outImage: '',
				outTons: '',
				checkCode: '',
				fileList: [],
				textList: [],

				fillAddress: '',
				fillCar: '',
				fillImage: '',
				fillLift: "",

				fillUnitPrice: '',
				fillAddressId: '',
				pickerShow: false,
				columns: [],
				Loading: false,
			}
		},
		computed: {
			//卸货净重
			netTons() {
				let netTons = ''
				if (this.inTons && this.outTons) {
					netTons = this.outTons - this.inTons
				} else {
					netTons = ''
				}
				if (netTons < 0) {
					this.showMsg('识别错误，请检查后再操作试试看吧~')
				}
				return this.fomatFloat(Number(netTons), 2)
			},
		},
		methods: {
			//加油地址
			addressList() {
				commonApi.addressList().then((res) => {
					if (res.status == 200) {
						this.columns[0] = res.data;
					}
				});
			},
			tabsClick(e) {
				if (this.current != e.value) {
					this.inImage = '';
					this.inTons = '';
					this.outImage = '';
					this.outTons = '';
					this.checkCode = '';
					this.fillAddress = '';
					this.fillAddressId = '';
					this.fillCar = '';
					this.fillImage = '';
					this.fillLift = '';
				}
				this.current = e.value;
				console.log(this.current)
				if (this.current == 1) {
					this.addressList()
				}
				this.Loading = false;
			},
			pickerConfirm(e) {
				console.log(e)
				this.fillUnitPrice = e.value[0].fillUnitPrice;
				this.fillAddress = e.value[0].fillAddress;
				this.fillAddressId = e.value[0].id;
				this.pickerShow = false
			},
			chooseFile(type) {
				let that = this;
				wx.chooseImage({
					count: 1,
					success(res) {
						const tempFilePaths = res.tempFilePaths[0];
						uni.uploadFile({
							url: that.uploadUrl + '/OIL_SMALL', // 大罐车 OIL_BIG,小罐车 OIL_SMALL
							filePath: tempFilePaths,
							header: {
								'Authorization': uni.getStorageSync('token')
							},
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if (data.status == 200) {
									switch (type) {
										case 1:
											that.inImage = data.data.key;
											break;
										case 2:
											that.outImage = data.data.key;
											break;
										case 3:
											that.fillImage = data.data.key;
											break;
									}
									convert(res.tempFilePaths[0]).then((res) => {
										that.getAccessToken(res, type)
									})
								}
							},
							fail: (resfail) => {
								console.log(resfail)
							}
						});
					}
				})
			},
			// 识别图片的数字
			getAccessToken(path, type) {
				let that = this;
				uni.showLoading({
					title: '图片识别中..',
				})
				uni.request({
					url: 'https://aip.baidubce.com/oauth/2.0/token',
					data: {
						grant_type: 'client_credentials',
						client_id: "14ninb2Tx3nXReXDqlIXsOZE", //APi key
						client_secret: "rKlxPQ9FXe5MpiQfmPmvfky6qGhuPVkl" //Secret Key
					},
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						uni.request({
							// url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
							url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/meter', //最新高精度
							data: {
								image: path,
								access_token: res.data.access_token
							},
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							success: (res1) => {
								console.log('识别图片', res1)
								let arr = []
								res1.data.words_result.forEach(e => {
									if (that.isNonNegativeFloat(e.words)) {
										arr.push(e.words)
									}
								})
								if (arr.length == 0) {
									that.showMsg('未识别任何数值~')
									setTimeout(e => {
										switch (type) {
											case 1:
												that.inTons = ''
												break;
											case 2:
												that.outTons = ''
												break;
											case 3:
												that.fillImage = ''
												break;
										}
									}, 1000)
								} else {
									switch (type) {
										case 1:
											that.inTons = arr.join(',')
											break;
										case 2:
											that.outTons = arr.join(',')
											break;
										case 3:
											that.fillLift = arr.join(',')
											break;
									}
									uni.hideLoading()
								}
							}
						})
					}
				})
			},
			delimg(type) {
				if (type == 1) {
					this.inImage = '';
					this.inTons = ''
				} else {
					this.outImage = '';
					this.outTons = ''
				}
				switch (type) {
					case 1:
						this.inImage = '';
						this.inTons = ''
						break;
					case 2:
						this.outImage = '';
						this.outTons = ''
						break;
					case 3:
						this.fillImage = '';
						this.fillLift = ''
						break;
				}
			},
			//小罐车入库登记
			oilRecordSub() {
				if (!this.inImage) {
					this.showMsg('请上传进库吨数照片')
					return
				}
				if (!this.myIsNaN(Number(this.inTons))) {
					this.showMsg('进库吨数格式错误')
					return
				}
				if (!this.outImage) {
					this.showMsg('请上传出库吨数照片')
					return
				}
				if (!this.myIsNaN(Number(this.outTons))) {
					this.showMsg('出库吨数格式错误')
					return
				}
				if (this.netTons < 0) {
					this.showMsg('净重吨数错误，请检查后重试')
					return
				}
				if (!this.checkCode) {
					this.showMsg('请输入小罐车口令')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				that.Loading = true;
				commonApi.oilRecordSub({
					inImage: this.inImage,
					inTons: this.inTons,
					outImage: this.outImage,
					outTons: this.outTons,
					netTons: this.netTons,
					checkCode: this.checkCode,
					plateType: 2,
				}).then((res) => {
					if (res.status == 200) {
						that.showMsg('操作成功')
						that.Loading = false;
						setTimeout(e => {
							uni.navigateBack({
								delta: 1
							});
						}, 10)
					} else {
						that.Loading = false;
					}
				});
			},

			//小罐车加油登记
			oilFillSub() {
				if (!this.fillImage) {
					this.showMsg('请上传加油图片')
					return
				}
				if (!this.myIsNaN(Number(this.fillLift))) {
					this.showMsg('加油升数格式错误')
					return
				}
				if (!this.fillCar) {
					this.showMsg('请输入加油车型')
					return
				}
				if (!this.fillAddress) {
					this.showMsg('请选择加油地址')
					return
				}
				if (!this.checkCode) {
					this.showMsg('请输入小罐车口令')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				that.Loading = true;
				commonApi.oilFillSub({
					fillImage: this.fillImage,
					fillLift: this.fillLift,
					fillCar: this.fillCar,
					fillAddress: this.fillAddress,
					fillUnitPrice: this.fillUnitPrice,
					fillAddressId: this.fillAddressId,
					checkCode: this.checkCode,
					plateType: 2,
				}).then((res) => {
					if (res.status == 200) {
						that.showMsg('操作成功')
						that.Loading = false;
						setTimeout(e => {
							uni.navigateBack({
								delta: 1
							});
						}, 10)
					} else {
						that.Loading = false;
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.registerbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.gyview {
			background-size: 100% 100%;
			background-repeat: no-repeat;
			padding: 30rpx 36rpx;
			border-radius: 20rpx;
		}

		.formView {
			padding: 20rpx;
			background: #fff;
			padding: 10rpx 36rpx;
			margin-top: 20rpx;
			border-radius: 20rpx;

			.topline {
				padding-top: 30rpx;
				border-top: 1rpx solid #E3E4E5;
			}

			.imgView {
				position: relative;
				height: 138rpx;
				width: 138rpx;

				.fileimg1 {
					position: absolute;
					top: 0;
					left: 0;
					width: 138rpx;
					height: 138rpx;
				}

				.del {
					position: absolute;
					right: -10rpx;
					top: -10rpx;
				}
			}
		}

		.modifybts {
			text-align: center;
			height: 90rpx;
			line-height: 90rpx;
		}


		.icon-size {
			width: 40rpx;
			height: 40rpx;
		}
	}

	/deep/ .u-input {
		background-color: #fff !important;
	}
</style>
