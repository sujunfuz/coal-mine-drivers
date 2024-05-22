<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="客户名称" prop="userName" ref="userName" label-width="100px" required>
						<view :class="userName?'':'colorc4'" @click="pickerShow=true">
							{{userName||'请选择'}}
						</view>
					</u-form-item>
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
			</u--form>
			<view class="modifybts bgMain colorfff bdRadius20 marAuto marT32" @tap.stop="submitForm">提交</view>
		</view>
		<u-picker :show="pickerShow" :columns="columns" keyName='label' @confirm='pickerConfirm' @cancel='pickerCancel'>
		</u-picker>
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
				userId: "",
				userName: '',
				shopName: '',

				pickerShow: false,
				columns: [
					[{
						label: '用户1',
						value: 1
					}, {
						label: '用户2',
						value: 2
					}]
				]
			}
		},
		onLoad(e) {

		},
		methods: {
			pickerCancel() {
				this.userId = '';
				this.userName = '';
				this.pickerShow = false;
			},
			pickerConfirm(e) {
				this.userId = e.value[0].value
				this.userName = e.value[0].label
				this.pickerShow = false;
			},
			chooseFile(type) {
				let that = this;
				wx.chooseMessageFile({
					count: 1,
					type: 'file',
					extension: ['.xlsx', '.xls'],
					success(res) {
						console.log("res", res)

						uni.uploadFile({
							url: that.uploadUrl + '/OIL_SMALL', // 大罐车 OIL_BIG,小罐车 OIL_SMALL
							filePath: tempFilePaths,
							header: {
								'Authorization': uni.getStorageSync('token')
							},
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								console.log(data)
								if (data.status == 200) {
									
								}
							},
							fail: (resfail) => {
								console.log(resfail)
							}
						});
					}
				})
			},
			submitForm() {
				if (!this.userId) {
					this.showMsg('请选择用户姓名')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				commonApi.oilRecordSub({
					userId: this.userId,
				}).then((res) => {
					if (res.status == 200) {
						that.showMsg('操作成功')
						setTimeout(e => {
							this.goToSw('/pages/tabbar/index')
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
