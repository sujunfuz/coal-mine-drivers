<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="出矿吨数" prop="producedTons" ref="producedTons" label-width="80px" required>
						<u--input type='digit' v-model="producedTons" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="出矿票据" prop="producedBillImage" ref="producedBillImage" label-width="80px"
						required>
						<!-- <u-upload :fileList="fileList" name="1"  :maxCount="1"></u-upload> -->
						<view class="imgView">
							<image v-if="!producedBillImage" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile"></image>
							<image v-else class="fileimg1" :src="producedBillImage.path"></image>
							<view v-if="producedBillImage" class="del" @click="delimg">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>

						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="煤运客户" prop="clientld" ref="clientld" label-width="80px" required>
						<view :class="clientName?'color333':'colorc4'" @click="pickerShow=true">
							{{clientName||'请选择'}}
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="煤运口令" prop="checkCode" ref="checkCode" label-width="80px" required>
						<u--input v-model="checkCode" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
			</u--form>
			<view v-if="Loading" class="modifybts bg999 colorfff bdRadius20 marAuto marT32">提交中...</view>
			<view v-else class="modifybts bgMain colorfff bdRadius20 marAuto marT32" @tap="$u.throttle(submit0, 1000)">
				提交
			</view>
		</view>
		<u-picker :show="pickerShow" :columns="columns" @confirm='pickerConfirm' @cancel='pickerCancel'
			keyName="clientName"></u-picker>
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
				inputStyle: {
					padding: '15rpx 20rpx',
				},
				producedTons: '',
				producedBillImage: null,
				checkCode: '',
				fileList: [],
				textList: [],
				Loading: false,
				clientName: '',
				clientId: '',
				pickerShow: false,
				columns: [
					[]
				]
			}
		},
		onLoad(e) {
			this.clientList()
		},
		methods: {
			chooseFile() {
				let that = this;
				wx.chooseImage({
					count: 1,
					success(res) {
						that.producedBillImage = res.tempFiles[0];
						// convert(res.tempFilePaths[0]).then((res) => {
						// 	that.getAccessToken(res)
						// })
					}
				})
			},

			//煤运用户列表
			clientList() {
				commonApi.clientList().then((res) => {
					if (res.status == 200) {
						this.columns[0] = res.data;
						// console.log(this.columns)
					}
				});
			},
			pickerCancel() {
				this.clientName = '';
				this.clientId = '';
				this.pickerShow = false;
			},
			pickerConfirm(e) {
				// console.log(e.value)
				this.clientName = e.value[0].clientName;
				this.clientId = e.value[0].id;
				this.pickerShow = false;
			},
			// 识别图片的数字
			getAccessToken(path) {
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
								console.log(res1)
								let arr = []
								res1.data.words_result.forEach(e => {
									if (that.isNonNegativeFloat(e.words)) {
										arr.push(e.words)
									}
								})
								if (arr.length == 0) {
									that.showMsg('未识别任何数值~')
								} else {
									that.producedTons = arr.join(',')
									uni.hideLoading()
								}
							}
						})
					}
				})
			},
			delimg() {
				this.producedBillImage = null;
				this.producedTons = ''
			},
			submit0() {
				if (!this.producedTons) {
					this.showMsg('请输入出矿吨数')
					return
				}
				if (!this.isNonNegativeFloat(this.producedTons)) {
					this.showMsg('出矿吨数格式不正确')
					return
				}
				if (!this.producedBillImage) {
					this.showMsg('请上传出矿票据')
					return
				}
				if (!this.checkCode) {
					this.showMsg('请输入煤运口令')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				that.Loading = true;
				wx.uploadFile({
					url: that.baseUrl + '/client/freightSettlement/submit0',
					filePath: that.producedBillImage.path,
					name: 'producedBillImage',
					formData: {
						producedTons: this.producedTons,
						checkCode: this.checkCode,
						clientId: this.clientId
					},
					header: {
						'Authorization': uni.getStorageSync('token') || '',
					},
					success(uploadFileRes) {
						// uni.hideLoading()
						let rs = JSON.parse(uploadFileRes.data)
						if (rs.status == 200) {
							that.showMsg('操作成功')
							that.Loading = false;
							setTimeout(e => {
								uni.navigateBack({
									delta: 1
								});
							}, 10)
						} else {
							that.showMsg(rs.message)
							that.Loading = false;
						}
					},
					fail(red) {
						uni.hideLoading()
						that.Loading = false;
						console.log(red)
					}
				})
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