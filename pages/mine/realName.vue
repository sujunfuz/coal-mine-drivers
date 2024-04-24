<template>
	<view class="realNamebg">
		<!-- 	<u-navbar leftIconColor='#fff' title="实名认证" :titleStyle='{ "color": "#fff" }' :placeholder='true'
			bgColor="#4285F4" fixed="" @leftClick="leftClick"></u-navbar> -->
		<view class="pad20">
			<u--form labelPosition="left" ref="uForm">
				<view class="formView">
					<u-form-item label="姓名" prop="name" ref="name" label-width="80px" required>
						<view v-if='isLogin'>{{userInfo.nickname}}</view>
						<u--input v-else v-model="name" border="none" placeholder="请输入"></u--input>
					</u-form-item>
				</view>

				<!-- <view class="formView">
					<u-form-item label="身份证号" prop="idcard" ref="idcard" label-width="80px" required>
						<view v-if='isLogin'>{{userInfo.idcard}}</view>
						<u-input v-else v-model="idcard" :maxlength="18" border="none" placeholder="请输入">
						</u-input>
					</u-form-item>
				</view> -->

				<view class="formView">
					<u-form-item label="车牌号" prop="plateNumber" ref="plateNumber" label-width="80px" required>
						<view v-if='isLogin'>{{userInfo.plateNumber}}</view>
						<u-input v-else v-model="plateNumber" :maxlength="8" border="none" placeholder="请输入">
							<!-- 	<template slot="suffix">
								<view class="flex-c">
									<view class="color9c marR10">{{ plateNumber.length + '/8' }}</view>
								</view>
							</template> -->
						</u-input>
					</u-form-item>
				</view>

				<view class="formView">
					<u-form-item label="手机号" prop="mobile" ref="mobile" label-width="80px" required>
						<view v-if='isLogin'>{{userInfo.mobile}}</view>
						<u--input v-else v-model="mobile" border="none" :maxlength="11" placeholder="请输入">
							<!-- <template slot="suffix">
								<view class="flex-c">
									<view class="color9c marR10">{{ mobile.length + '/11' }}</view>
								</view>
							</template> -->
						</u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="车辆类型" prop="plateType" ref="plateType" label-width="80px" required>
						<view v-if='isLogin'>{{plateTypelabel(userInfo.plateType)}}</view>
						<view v-else :class="plateTypeName?'':'colorc4'" @click="pickerShow=true">
							{{plateTypeName||'请选择'}}
						</view>
					</u-form-item>
				</view>
				<view v-if="!isLogin" class="formView">
					<u-form-item label="认证口令" prop="checkCode" ref="checkCode" label-width="80px" required>
						<u--input v-model="checkCode" border="none" placeholder="请输入">
						</u--input>
					</u-form-item>
				</view>
				<view class="formView">
					<u-form-item label="身份证照片" prop="idcardImage" ref="idcardImage" label-width="80px" required>
						<view class="imgView" v-if='isLogin'>
							<image @click="clickImg(userInfo.idcardImage)" class="fileimg1"
								:src="ImgUrl+userInfo.idcardImage"></image>
						</view>
						<view class="imgView" v-else>
							<image v-if="!idcardImage" class="fileimg1" src="../../static/index/add.png"
								@click="chooseFile"></image>
							<image v-else class="fileimg1" :src="idcardImage.path"></image>
							<view v-if="idcardImage" class="del" @click="delimg">
								<u-icon name="close-circle-fill" size='20' color='red'></u-icon>
							</view>

						</view>
					</u-form-item>
				</view>
			</u--form>
			<view v-if="!userInfo.plateNumber" class="modifybts bgMain colorfff bdRadius20 marAuto marT32"
				@tap.stop="submitForm">提交认证</view>
			<view v-if="!userInfo.certified&&userInfo.plateNumber"
				class="modifybts bg999 colorfff bdRadius20 marAuto marT32">已提交，后台审核中...</view>
			<u-picker :show="pickerShow" :columns="columns" @confirm='pickerConfirm' @cancel='pickerCancel'></u-picker>
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
				name: '',
				idcard: '',
				plateNumber: '',
				mobile: '',
				checkCode: '',
				idcardImage: '',
				plateTypeName: '',
				plateType: '',
				pickerShow: false,
				columns: [
					['煤运车', '大罐车', '小罐车']
				]
			}
		},
		onLoad(e) {

		},
		methods: {
			pickerCancel() {
				this.plateTypeName = '';
				this.plateType = '';
				this.pickerShow = false;
			},
			pickerConfirm(e) {
				this.plateTypeName = e.value[0]
				this.pickerShow = false;
			},
			plateTypelabel(type) {
				let plateTypeName
				switch (type) {
					case 0:
						plateTypeName = '煤运车';
						break;
					case 1:
						plateTypeName = '大罐车';
						break;
					case 2:
						plateTypeName = '小罐车';
						break;
				}
				return plateTypeName
			},
			chooseFile() {
				let that = this;
				wx.chooseImage({
					count: 1,
					success(res) {
						that.idcardImage = res.tempFiles[0];
					}
				})
			},
			delimg() {
				this.idcardImage = null;
			},
			clickImg(img) {
				let imgs = []
				imgs.push(img);
				this.lookImg(imgs, 0)
			},
			submitForm() {
				if (!this.name) {
					this.showMsg('请输入姓名')
					return
				}
				if (!this.plateNumber) {
					this.showMsg('请输车牌号')
					return
				}
				if (!this.mobile) {
					this.showMsg('请输入手机号')
					return
				}
				const phoneRegex = /^1[34578]\d{9}$/;
				if (!phoneRegex.test(this.mobile)) {
					this.showMsg('手机号格式错误')
					return
				}
				if (!this.plateTypeName) {
					this.showMsg('请选择车辆类型')
					return
				}
				if (!this.checkCode) {
					this.showMsg('请输入认证口令')
					return
				}
				if (!this.idcardImage) {
					this.showMsg('请上传身份证照')
					return
				}
				uni.showLoading({
					title: '加载中',
				})
				let that = this;
				wx.login({
					success: (reswx) => {
						wx.uploadFile({
							url: that.baseUrl + '/client/register',
							filePath: that.idcardImage.path,
							name: 'idcardImage',
							formData: {
								name: this.name,
								mobile: this.mobile,
								plateNumber: this.plateNumber,
								code: reswx.code,
								checkCode: this.checkCode,
								plateType: this.plateTypeName == '煤运车' ? 0 : this.plateTypeName ==
									'大罐车' ? 1 : 2
							},
							success(uploadFileRes) {
								// uni.hideLoading()
								let rs = JSON.parse(uploadFileRes.data)
								console.log(rs)
								if (rs.status == 200) {
									that.showMsg('操作成功')
									uni.setStorageSync('isLogin', true);
									uni.setStorageSync('userInfo', rs.data);
									uni.setStorageSync('token', rs.data.accessToken);
									setTimeout(() => {
										that.goToSw('/pages/tabbar/mine')
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
						// console.log(reswx)
						// let obj = {
						// 	name: this.name,
						// 	idcardImage: this.idcardImage,
						// 	mobile: this.mobile,
						// 	plateNumber: this.plateNumber,
						// 	code: reswx.code,
						// 	checkCode: this.checkCode
						// }
						// commonApi.register(obj).then(res => {
						// 	if (res.status == 200) {

						// 	}
						// })
					}
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	.realNamebg {
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
