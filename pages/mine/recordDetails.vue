<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="出矿吨数" prop="name" ref="name" label-width="80px">
						{{rs.producedTons}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="出矿票据" prop="name" ref="name" label-width="80px">
						<image @click="clickImg(rs.producedBillImage)" v-if="rs.producedBillImage" class="img1"
							:src="ImgUrl+rs.producedBillImage" mode="scaleToFill"></image>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="验收吨数" prop="receiptTons" ref="receiptTons" label-width="80px"
						:required='!disabled'>
						<view v-if='disabled'>{{rs.receiptTons}}</view>
						<u--input v-else type='digit' v-model="receiptTons" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="验收票据" prop="name" ref="name" label-width="80px" :required='!disabled'>
						<view class="imgView" v-if='disabled'>
							<image @click="clickImg(rs.receiptBillImage)" v-if="rs.receiptBillImage" class="fileimg1"
								:src="ImgUrl+rs.receiptBillImage"></image>
						</view>
						<view class="imgView" v-else>
							<image v-if="!receiptBillImage" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile"></image>
							<image v-else class="fileimg1" :src="receiptBillImage.path"></image>
							<view v-if="receiptBillImage" class="del" @click="delimg">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>
						</view>
					</u-form-item>
				</view>
			</u--form>
			<view v-if="!disabled" class="modifybts bgMain colorfff bdRadius20 marAuto marT32" @tap.stop="submit1">提交
			</view>
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				inputStyle: {
					padding: '15rpx 20rpx',
				},
				disabled: true,
				fileList: [],
				id: '',
				rs: {
					producedTons: ''
				},
				receiptTons: '',
				producedBillImage: '',
				receiptBillImage: null
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.freightSettlementDetails()
		},
		methods: {
			freightSettlementDetails() {
				commonApi.freightSettlementDetails(this.id).then((res) => {
					if (res.status == 200) {
						this.rs = res.data;
						this.disabled = this.rs.receiptTons ? true : false
					}
				});
			},
			clickImg(img) {
				let imgs = []
				imgs.push(img);
				this.lookImg(imgs, 0)
			},
			chooseFile() {
				let that = this;
				wx.chooseImage({
					count: 1,
					success(res) {
						that.receiptBillImage = res.tempFiles[0];
					}
				})
			},
			delimg() {
				this.receiptBillImage = null
			},
			submit1() {
				if (!this.receiptTons) {
					this.showMsg('请输入验收吨数')
					return
				}
				if (!this.isNonNegativeFloat(this.receiptTons)) {
					this.showMsg('出矿吨数格式不正确')
					return
				}
				if (!this.receiptBillImage) {
					this.showMsg('请上传验收票据')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				wx.uploadFile({
					url: that.baseUrl + '/freightSettlement/submit1/' + that.id,
					filePath: that.receiptBillImage.path,
					name: 'receiptBillImage',
					formData: {
						receiptTons: that.receiptTons
					},
					header: {
						'Authorization': uni.getStorageSync('token') || '',
					},
					success(uploadFileRes) {
						uni.hideLoading()
						let rs = JSON.parse(uploadFileRes.data)
						if (rs.status == 200) {
							that.showMsg('操作成功')
							setTimeout(e => {
								uni.navigateBack({
									delta: 1
								});
							}, 1500)
						} else {
							that.showMsg(rs.message)
						}
					},
					fail(red) {
						uni.hideLoading()
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

			.img1 {
				width: 120rpx;
				height: 120rpx;
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