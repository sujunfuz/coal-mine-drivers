<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView" v-if="rs.plateNumber">
					<u-form-item label="小罐车" prop="name" ref="name" label-width="100px">
						{{rs.plateNumber}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="装油图片" prop="fillImage" ref="fillImage" label-width="100px">
						<image @click="clickImg(rs.fillImage)" v-if="rs.fillImage" class="img1" :src="ImgUrl+rs.fillImage"
							mode="scaleToFill"></image>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="装油升数" prop="fillLift" ref="fillLift" label-width="100px">
						{{rs.fillLift}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="装油车型" prop="fillCar" ref="fillCar" label-width="100px">
						{{rs.fillCar}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="装油地址" prop="fillAddress" ref="fillAddress" label-width="100px">
						{{rs.fillAddress}}
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
			this.oilFillDetails()
		},
		methods: {
			oilFillDetails() {
				commonApi.oilFillDetails(this.id).then((res) => {
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
