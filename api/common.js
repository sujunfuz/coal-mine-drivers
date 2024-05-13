import request from '../common/request.js'

export default {
	//登录
	wxlogin: (data) => {
		return request.post2('/client/login?', data);
	},
	//实名登记
	register: (data) => {
		return request.post('/client/register', data);
	},
	//获取用户信息
	getUserInfo: (data) => {
		return request.get('/client/userInfo', data);
	},
	//首次提交
	submit0: (obj1, obj2) => {
		return request.post3('/client/freightSettlement/submit0?', obj1, obj2);
	},
	//二次提交货运单
	submit1: (id, data) => {
		return request.post('/client/freightSettlement/' + id + '/submit1', data);
	},
	//结算单详情
	freightSettlementDetails: (id, data) => {
		return request.get('/client/freightSettlement/' + id, data, true);
	},

	//结算单分页
	freightSettlementList: (data) => {
		return request.get('/client/freightSettlement/page', data);
	},
	
	
	//油库记录提交   大罐  小罐车
	oilRecordSub: (data) => {
		return request.post('/client/oilRecord/submit', data);
	},
	//油库记录分页
	oilRecordList: (data) => {
		return request.get('/client/oilRecord/page', data);
	},
	//油库记录详情
	oilRecordDetails: (id, data) => {
		return request.get('/client/oilRecord/' + id, data, true);
	},
	
	//加油地址列表
	addressList: (data) => {
		return request.get('/client/oilFill/addressList', data);
	},
	
	//加油提交 小罐车
	oilFillSub: (data) => {
		return request.post('/client/oilFill/submit', data);
	},
	//加油记录分页
	oilFillList: (data) => {
		return request.get('/client/oilFill/page', data);
	},
	//加油记录详情
	oilFillDetails: (id, data) => {
		return request.get('/client/oilFill/' + id, data, true);
	},

};