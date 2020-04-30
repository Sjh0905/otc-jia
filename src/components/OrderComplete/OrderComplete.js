const root = {};
root.name = "OrderComplete";
root.data = function () {
	return{
		// loading
    	loading: true,
		// 分页
		maxPage: 1,
		selectIndex: 1,
		// 列表
		list: [],

	}
};

root.components = {
	'BasePageBar': resolve => require(['@/components/BasePageBar/BasePageBar.vue'], resolve),
	// loading
	'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
}

root.computed = {};

root.props = {};

root.created = function () {
	// 获取搜索内容
	this.$eventBus.listen(this, 'SEARCH_ORDER', this.GET_ORDER_CONDUCT);

	// 获取订单列表
	this.GET_ORDER_CONDUCT();

	console.log('bbbb')
};

root.methods = {};
// 获取列表
root.methods.GET_ORDER_CONDUCT = function (search) {
	this.$http.send('GET_LIST_ORDERS', {
		query: {
			offset: this.selectIndex,
			maxResults: 10,
			// status: 'COMPLETE', //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
			status: 3, //   1进行中, 3已完成, 4已取消
			ctcOrderId: search || '',
		}
	}).then(({data}) => {
		if (data.code == 200) {
			this.loading = false;
			// let datas = data.dataMap.ctcOrders;
			let datas = data.data
      console.info('data=========sss',this.datas)
			this.list = datas;
			if (this.list[0] == null) {
				this.list = [];
				return;
			};
			this.maxPage = datas.page.totalPages;
			this.selectIndex = datas.page.pageIndex;
		}
		if (data.code == 1) {
			window.location.reload();
		}
	}).catch((err) => {

	});
}
// 切换页码
root.methods.clickChangePage = function (page) {
	this.selectIndex = page;
	// 切换页码
	this.GET_ORDER_CONDUCT();

}
// 跳转详情
root.methods.GO_DETAIL = function (id, orderType) {
	// console.log(orderType)
	this.$router.push({name: 'OrderDetails', query: {'type': '2','orderId': id, 'orderType': orderType}});
}


export default root;
