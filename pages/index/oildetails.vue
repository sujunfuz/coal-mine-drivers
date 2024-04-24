<template>
	<view class="registerbg">
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView" v-if="rs.plateNumber">
					<u-form-item :label="rs.plateTypeName" prop="name" ref="name" label-width="100px">
						{{rs.plateNumber}}
					</u-form-item>
				</view>
				<view>
					<view class="formView">
						<u-form-item label="进库吨数" prop="name" ref="name" label-width="100px">
							{{rs.inTons}}
						</u-form-item>
					</view>
					<view class="formView">
						<u-form-item label="进库吨数照片" prop="name" ref="name" label-width="100px">
							<image @click="clickImg(rs.inImage)" v-if="rs.inImage" class="img1" :src="ImgUrl+rs.inImage"
								mode="scaleToFill"></image>
						</u-form-item>
					</view>
				</view>
				<view class="formView">
					<u-form-item label="出库吨数" prop="name" ref="name" label-width="100px">
						{{rs.outTons}}
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="出库吨数照片" prop="name" ref="name" label-width="100px">
						<image @click="clickImg(rs.outImage)" v-if="rs.outImage" class="img1" :src="ImgUrl+rs.outImage"
							mode="scaleToFill"></image>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="卸货净重" prop="name" ref="name" label-width="100px">
						{{rs.netTons}}
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
					inTons: '',
					outTons: '',
					netTons: ''
				},
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.oilRecordDetails()
		},
		methods: {
			oilRecordDetails() {
				commonApi.oilRecordDetails(this.id).then((res) => {
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
