<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="客户名称" prop="clientName" ref="clientName" label-width="100px" required>
						<view :class="clientName?'':'colorc4'" @click="pickerShow=true">
							{{clientName||'请选择'}}
						</view>
					</u-form-item>
					<u-form-item label="文件导入" prop="tempFiles" ref="tempFiles" label-width="100px" required>
						<view class="imgView">
							<image v-if="!tempFiles.name" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile()"></image>
							<image v-else class="fileimg1" src="../../static/mine/excel.png" @click="popupShow=true">
							</image>
							<view v-if="tempFiles.name" class="del" @click="delimg()">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>
							<view v-if="tempFiles.name" class="colorMain yulan" @click="popupShow=true">预览</view>
						</view>
						<view @click="popupShow=true">{{tempFiles.name}}</view>
					</u-form-item>
					<view class="formView">
						<u-form-item label="五金口令" prop="checkCode" ref="checkCode" label-width="100px" required>
							<u--input v-model="checkCode" border="none" placeholder="请输入"></u--input>
						</u-form-item>
					</view>
				</view>
			</u--form>
			<view class="modifybts bgMain colorfff bdRadius20 marAuto marT32" @tap="$u.throttle(submitForm, 1000)">提交</view>
		</view>
		<u-picker :show="pickerShow" :columns="columns" keyName='clientName' @confirm='pickerConfirm'
			@cancel='pickerCancel'>
		</u-picker>
		<view @touchmove.stop.prevent="()=>{return false}">
			<u-popup :show="popupShow" :safeAreaInsetBottom='false' mode="bottom" round="10" :closeable='true'
				@close="popupShow=false;">
				<view class="popupview">
					<scroll-view scroll-y="true" style="max-height: 60vh;">
						<view class="flex-cb color6e tableView">
							<scroll-view scroll-x="true" class="tableLeft">
								<view class="flex-c table_th">
									<view class="table1">物品名称</view>
									<view class="table2">规格</view>
									<view class="table2">单位</view>
									<view class="table1">数量</view>
								</view>
								<view class="flex-c table_td" v-for="(item, index) in goodsList" :key='index'>
									<view class="table1">{{item.goodsName||'-'}}</view>
									<view class="table2">{{item.specification||'-'}}</view>
									<view class="table2">{{item.unit||'-'}}</view>
									<view class="table1">{{item.quantity||'-'}}</view>
								</view>
							</scroll-view>
						</view>
						<view style="padding: 40rpx 0;">
							<u-loadmore status="nomore" />
						</view>
					</scroll-view>
				</view>
			</u-popup>
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
				clientId: "",
				clientName: '',
				shopName: '',
				checkCode: '',
				pickerShow: false,
				columns: [
					[]
				],
				tempFiles: {}, //上传文件
				goodsList: [],
				popupShow: false
			}
		},
		onLoad(e) {
			this.hardwareTop()
		},
		methods: {
			//客户列表
			hardwareTop() {
				commonApi.hardwareTop().then((res) => {
					if (res.status == 200) {
						this.columns[0] = res.data;
					}
				});
			},
			pickerCancel() {
				this.clientId = '';
				this.clientName = '';
				this.pickerShow = false;
			},
			pickerConfirm(e) {
				this.clientId = e.value[0].id
				this.clientName = e.value[0].clientName
				this.pickerShow = false;
			},
			chooseFile() {
				let that = this;
				wx.chooseMessageFile({
					count: 1,
					type: 'file',
					extension: ['.xlsx', '.xls'],
					success(res) {
						console.log("res", res)
						that.tempFiles = res.tempFiles[0];
						uni.uploadFile({
							url: that.baseUrl + '/client/hardware/upload', //五金文件上传
							filePath: that.tempFiles.path,
							header: {
								'Authorization': uni.getStorageSync('token')
							},
							name: 'file',
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								console.log(data)
								if (data.status == 200) {
									that.goodsList = data.data;
								} else {
									that.showMsg(data.message)
								}
							},
							fail: (resfail) => {
								console.log(resfail)
							}
						});
					}
				})
			},
			delimg() {
				this.tempFiles = {}
				this.goodsList = []
			},
			submitForm() {
				if (!this.clientId) {
					this.showMsg('请选择客户')
					return
				}
				if (!this.tempFiles.name && this.goodsList.length == 0) {
					this.showMsg('请导入文件')
					return
				}
				if (!this.checkCode) {
					this.showMsg('请输入口令')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				commonApi.uploadExcel({
					clientId: this.clientId,
					checkCode: this.checkCode,
					goodsList: this.goodsList
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

				.yulan {
					position: absolute;
					top: 48rpx;
					left: 168rpx;
					width: 60rpx;
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


		.popupview {
			padding: 68rpx 30rpx;

			.tableView {
				width: 100%;

				.table_th {
					height: 60rpx;
					line-height: 60rpx;
					font-weight: bold;
				}

				.table_td {
					padding-bottom: 15rpx;
					font-size: 24rpx;
				}

				.tableLeft {
					width: 100%;

					.table1 {
						width: 30%;
						text-align: center;
					}

					.table2 {
						width: 20%;
						text-align: center;
					}
				}

				.tableRight1 {
					width: 220rpx;
				}

				.tableRight2 {
					width: 80rpx;
				}

			}

		}

	}

	/deep/ .u-input {
		background-color: #fff !important;
	}
</style>
