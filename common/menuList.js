let menulist = [{
	title: "功能",
	id: 111,
	status: false,
	child: [{
			title: "煤运登记",
			id: 1,
			image: '../../static/index/meiyundengji.png',
			status: false,
			url: "/pages/index/register",
			plateType: 0,
		}, {
			title: "大罐车登记",
			id: 1,
			image: '../../static/index/daguan.png',
			status: false,
			url: "/pages/index/maxTanker",
			plateType: 1,
		}, {
			title: "小罐车登记",
			id: 1,
			image: '../../static/index/xiaoguan.png',
			status: false,
			url: "/pages/index/minTanker",
			plateType: 2,
		}

	]
}, ]
export default menulist
