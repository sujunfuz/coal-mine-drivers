<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="flex-c marL20">
					<view class="fontsize32">提交表格提交:</view>
					<view class="minbts1 bgGreen colorfff marL32" @click="goToPage('/pages/index/exportHardware')">一键导入
					</view>
				</view>
				<view class="marL20 marT30 marB32">
					<view class="fontsize32">手工输入提交:</view>
				</view>
				<view class="formView">
					<u-form-item label="客户名称" prop="userName" ref="userName" label-width="80px" required>
						<view :class="userName?'':'colorc4'" @click="pickerShow=true">
							{{userName||'请选择'}}
						</view>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="物品名称" prop="shopName" ref="shopName" label-width="80px" required>
						<u--input v-model="shopName" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="规格" prop="spec" ref="spec" label-width="80px" required>
						<u--input v-model="spec" border="none" placeholder="请输入规格"></u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="数量" prop="num" ref="num" label-width="80px" required>
						<u--input v-model="num" border="none" placeholder="请输入" type='number'></u--input>
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
				spec: '',
				num: "",
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
			submitForm() {
				if (!this.userId) {
					this.showMsg('请选择用户姓名')
					return
				}
				if (!this.shopName) {
					this.showMsg('请输入物品名称')
					return
				}
				if (!this.spec) {
					this.showMsg('请输入规格')
					return
				}
				if (!this.num) {
					this.showMsg('请输入数量')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				commonApi.oilRecordSub({
					userId: this.userId,
					shopName: this.shopName,
					num: this.num,
					spec: this.spec,
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
