<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm" labelAlign="right">
				<view class="flex-c marL20">
					<view class="fontsize32">导入表格提交:</view>
					<view class="minbts1 bgGreen colorfff marL32" @click="goToPage('/pages/index/exportHardware')">一键导入
					</view>
				</view>
				<view class="marL20 marT30 marB32">
					<view class="fontsize32">手工输入提交:</view>
				</view>
				<view class="formView">
					<u-form-item label="客户名称" prop="clientName" ref="clientName" label-width="68px" required>
						<view :class="clientName ? '' : 'colorc4'" @click="pickerShow = true">
							{{ clientName || "请选择" }}
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="物品名称" prop="goodsName" ref="goodsName" label-width="68px" required>
						<u--input v-model="goodsName" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="规格" prop="specification" ref="specification" label-width="68px">
						<u--input v-model="specification" border="none" placeholder="请输入规格"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="单位" prop="unit" ref="unit" label-width="68px">
						<u--input v-model="unit" border="none" placeholder="请输入单位"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="数量" prop="quantity" ref="quantity" label-width="68px" required>
						<u--input v-model="quantity" border="none" placeholder="请输入" type="digit"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="五金口令" prop="checkCode" ref="checkCode" label-width="68px" required>
						<u--input v-model="checkCode" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
			</u--form>
			<view v-if="Loading" class="modifybts bg999 colorfff bdRadius20 marAuto marT32">提交中...</view>
			<view v-else class="modifybts bgMain colorfff bdRadius20 marAuto marT32"
				@tap="$u.throttle(submitForm, 1000)">提交
			</view>
		</view>
		<u-picker :show="pickerShow" :columns="columns" keyName="clientName" @confirm="pickerConfirm"
			@cancel="pickerCancel">
		</u-picker>
	</view>
</template>

<script>
	import {
		toBase64 as convert
	} from "@/common/base64.js";
	import commonApi from "@/api/common.js";
	export default {
		data() {
			return {
				inputStyle: {
					padding: "15rpx 20rpx",
				},
				clientId: "",
				clientName: "",
				goodsName: "",
				specification: "",
				unit: "",
				quantity: "",
				checkCode: "",
				pickerShow: false,
				columns: [
					[]
				],
				Loading: false,
			};
		},
		onLoad(e) {
			this.hardwareTop();
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
				this.clientId = "";
				this.clientName = "";
				this.pickerShow = false;
			},
			pickerConfirm(e) {
				console.log(e);
				this.clientId = e.value[0].id;
				this.clientName = e.value[0].clientName;
				this.pickerShow = false;
			},
			submitForm() {
				if (!this.clientId) {
					this.showMsg("请选择客户");
					return;
				}
				if (!this.goodsName) {
					this.showMsg("请输入物品名称");
					return;
				}
				if (!this.quantity) {
					this.showMsg("请输入数量");
					return;
				}
				if (!this.checkCode) {
					this.showMsg("请输入口令");
					return;
				}
				this.Loading = true;
				commonApi.hardwareSubmit({
						clientId: this.clientId,
						goodsName: this.goodsName,
						quantity: this.quantity,
						specification: this.specification,
						unit: this.unit,
						checkCode: this.checkCode,
					})
					.then((res) => {
						if (res.status == 200) {
							this.showMsg("操作成功");
							setTimeout((e) => {
								this.Loading = false;
								this.goToSw("/pages/tabbar/index");
							}, 10);
						} else {
							this.Loading = false;
						}
					});
			},
		},
	};
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
				border-top: 1rpx solid #e3e4e5;
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
