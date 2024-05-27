<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView" v-if="rs.plateNumber">
					<u-form-item label="五金" prop="name" ref="name" label-width="100px">
						{{rs.plateNumber}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="客户" prop="clientName" ref="clientName" label-width="100px">
						{{rs.clientName}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="物品名称" prop="goodsName" ref="goodsName" label-width="100px">
						{{rs.goodsName}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="规格" prop="specification" ref="specification" label-width="100px">
						{{rs.specification||'-'}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="单位" prop="unit" ref="unit" label-width="100px">
						{{rs.unit||'-'}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="数量" prop="quantity" ref="quantity" label-width="100px">
						{{rs.quantity||'-'}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="创建时间" prop="createDate" ref="createDate" label-width="100px">
						{{rs.createDate}}
					</u-form-item>
				</view>
			</u--form>
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				id: '',
				rs: {
					fillLift: '',
					fillCar: '',
					fillAddress: ''
				},
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.hardwareDetails()
		},
		methods: {
			hardwareDetails() {
				commonApi.hardwareDetails(this.id).then((res) => {
					if (res.status == 200) {
						this.rs = res.data;
					}
				});
			},
			clickImg(img) {
				let imgs = []
				imgs.push(img);
				this.lookImg(imgs, 0)
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
