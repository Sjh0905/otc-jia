const root = {}
root.name = 'OrderOther'

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
};

root.methods = {};
// 获取列表
root.methods.GET_ORDER_CONDUCT = function (search) {
	this.$http.send('GET_LIST_ORDERS', {
		params: {
			offset: this.selectIndex,
			maxResults: 10,
			status: 'OTHER', //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
			ctcOrderId: search || '',
		}
	}).then(({data}) => {
		if (data.errorCode == 0) {
			this.loading = false;
			let datas = data.dataMap.ctcOrders;
			this.list = datas.results;
			if (this.list[0] == null) {
				this.list = [];
				return;
			};
			this.maxPage = datas.page.totalPages;
			this.selectIndex = datas.page.pageIndex;
		}
		if (data.errorCode == 1) {
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
	this.$router.push({name: 'OrderDetails', query: {'type': '4','orderId': id, 'orderType': orderType}});
}

export default root
