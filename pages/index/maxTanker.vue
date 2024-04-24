<template>
	<view class="registerbg">
		<view class="pad20">
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
						<view>{{inTons}}</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="出库吨数" prop="outTons" ref="outTons" label-width="100px" required>
						<view>{{outTons}}</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="净重吨数" prop="netTons" ref="netTons" label-width="100px" required>
						<view>{{netTons}}</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="大罐车口令" prop="checkCode" ref="checkCode" label-width="100px" required>
						<u--input v-model="checkCode" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
			</u--form>
			<view class="modifybts bgMain colorfff bdRadius20 marAuto marT32" @tap.stop="oilRecordSub">提交</view>
		</view>
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
				inImage: '',
				inTons: '',
				outImage: '',
				outTons: '',
				checkCode: '',
				fileList: [],
				textList: []
			}
		},
		computed: {
			//卸货净重
			netTons() {
				let netTons = ''
				if (this.inTons && this.outTons) {
					netTons = this.inTons - this.outTons
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
			chooseFile(type) {
				let that = this;
				wx.chooseImage({
					count: 1,
					success(res) {
						const tempFilePaths = res.tempFilePaths[0];
						uni.uploadFile({
							url: that.uploadUrl + '/OIL_BIG', // 大罐车 OIL_BIG,小罐车 OIL_SMALL
							filePath: tempFilePaths,
							header: {
								'Authorization': uni.getStorageSync('token')
							},
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if (data.status == 200) {
									if (type == 1) {
										that.inImage = data.data.key;
									} else {
										that.outImage = data.data.key;
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
						client_id: "ET6mVtMTRAqRx7KdZa70VqAu", //APi key
						client_secret: "ENJuRq9E6lHwBgDuNkZJgiS6r6WddMFd" //Secret Key
					},
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						uni.request({
							url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
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
										if (type == 1) {
											that.inImage = ''
										} else {
											that.outImage = ''
										}
									}, 1000)
								} else {
									if (type == 1) {
										that.inTons = arr.join(',')
									} else {
										that.outTons = arr.join(',')
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
			},
			oilRecordSub() {
				if (!this.inImage) {
					this.showMsg('请上传进库吨数照片')
					return
				}
				if (!this.outImage) {
					this.showMsg('请上传出库吨数照片')
					return
				}
				if (this.netTons < 0) {
					this.showMsg('净重吨数错误，请检查后重试')
					return
				}
				if (!this.checkCode) {
					this.showMsg('请输入大罐车口令')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				commonApi.oilRecordSub({
					inImage: this.inImage,
					inTons: this.inTons,
					outImage: this.outImage,
					outTons: this.outTons,
					netTons: this.netTons,
					checkCode: this.checkCode,
					plateType: 1,
				}).then((res) => {
					if (res.status == 200) {
						that.showMsg('操作成功')
						setTimeout(e => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
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
