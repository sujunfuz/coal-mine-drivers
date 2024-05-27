import qs from 'qs'
import config from '../config.js'


let myAppId = config.myAppId;
let baseUrl = config.baseUrl;
let ossIconUrl = config.ossIconUrl;
let ImgUrl = `${baseUrl}/common/storage/download/` //公用文件下载地址

let uploadUrl = `${baseUrl}/common/storage/upload` //公用文件上传




// 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
// uni.addInterceptor('request', {
// 	invoke(args) {
// 		// request 触发前拼接 url 
// 		const {
// 			data,
// 			method,
// 		} = args;
// 		if (method === "GET") {
// 			// 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
// 			const newData = qs.stringify(data, {
// 				arrayFormat: "repeat"
// 			})
// 			delete args.data;
// 			args.url = `${args.url}?${newData}`;
// 		}
// 	},
// 	success(args) {},
// 	fail(err) {},
// 	complete(res) {}
// })


export default {
	myAppId,
	baseUrl,
	ImgUrl,
	ossIconUrl,
	uploadUrl,
	/**
	 * 获取通用请求头
	 * 包含用户登录权限 && 签名
	 */
	getComHeader(param = {}) {
		let comHeader = {}
		if (uni.getStorageSync('token')) {
			comHeader['Authorization'] = uni.getStorageSync('token') || ''
		}
		console.log('comHeader', comHeader)
		return comHeader
	},
	/**
	 *
	 * @param {*} url 请求地址
	 * @param {*} data 请求参数
	 * @param {*} header 请求头
	 * @param {*} method 请求非法
	 * @param {*} isLoading 是否显示加载状态
	 */
	request(url = '', data = {}, header = {}, method = '', isLoading = false, callback) {
		if (header == true) {
			header = {}
		}
		if (uni.getStorageSync('token')) {
			header['Authorization'] = uni.getStorageSync('token') || ''
		}

		return new Promise((resolve, reject) => {
			if (isLoading) {
				uni.showLoading({
					title: '加载中',
				})
			}
			uni.request({
				url: `${baseUrl}${url}`,
				data: data,
				method: method,
				header: header,
				success: res => {
					if (isLoading) {
						uni.hideLoading()
					}
					if (res.data.status == 200) {
						resolve(res.data)
					} else if (res.data.status == 405) {
						uni.showToast({
							title: '暂未实名，实名认证后可解锁更多功能~',
							icon: 'none',
							duration: 2000,
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/mine/realName',
							})
						}, 1500)
					} else if (res.data.status == 401) {
						uni.showToast({
							title: '请重新登录',
							icon: 'none',
							duration: 2000,
						})
						setTimeout(() => {
							uni.clearStorage()
							uni.clearStorageSync()
							uni.reLaunch({
								url: '/pages/tabbar/mine',
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							duration: 2000,
						})
						resolve(res.data)
					}

				},
				fail: err => {
					if (isLoading) {
						setTimeout(() => {
							uni.hideLoading()
						}, 1500)
					}
					reject(err)
				},
			})
		})
	},
	post(url = '', data = {}, isLoading = false, header = {}) {
		if (header == true) {
			header = {}
		}
		//post默认请求头 和 接口保持一致
		header['content-type'] = 'application/json'
		return this.request(url, data, header, 'POST', isLoading)
	},
	post2(url = '', data = {}, isLoading = false, header = {}) {
		if (header == true) {
			header = {}
		}
		url = url + `${qs.stringify(data)}`
		//post默认请求头 和 接口保持一致
		header['content-type'] = 'application/json'
		return this.request(url, data, header, 'POST', isLoading)
	},
	post3(url = '', data = {}, data2 = {}, isLoading = false, header = {}) {
		if (header == true) {
			header = {}
		}
		url = url + `${qs.stringify(data)}`
		//post默认请求头 和 接口保持一致
		header['content-type'] = 'application/json'
		return this.request(url, data2, header, 'POST', isLoading)
	},
	get(url = '', data = {}, isLoading = false, header = {}) {
		//默认请求头
		return this.request(url, data, header, 'GET', isLoading)
	},
	put(url = '', data = {}, header = {}, isToken = false, isLoading = false) {
		//默认请求头
		header['Content-Type'] = 'application/json'
		return this.request(url, data, header, 'PUT', isLoading)
	},
	delete(url = '', data = {}, header = {}, isToken = false, isLoading = false) {
		//默认请求头
		header['content-type'] = 'application/x-www-form-urlencoded'
		return this.request(url, data, header, 'DELETE', isLoading)
	},
}