const root = {}
root.name = 'OrderOther'

root.data = function () {
	return{
		// loading
    	loading: true,
		// 分页
		maxPage: 3,
    maxResults: 10,
    offset: 0,
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
root.computed.userId = function () {
  return this.$store.state.authState.userId;
}

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
    query: {
			offset: this.offset,
			maxResults: this.maxResults,
			// status: 'OTHER', //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
			status: 0, //        1进行中, 3已完成, 4已取消  0全部
      ctcOrderId: search || '',
		}
	}).then(({data}) => {
		if (data.code == 200) {
			this.loading = false;
			// let datas = data.dataMap.ctcOrders;
			let datas = data.data;
			this.list = datas;
			if (this.list[0] == null) {
				this.list = [];
				return;
			};
			this.maxPage = this.maxResults;
			// this.selectIndex = datas.page.pageIndex;
		}
		if (data.code == 1) {
			window.location.reload();
		}
	}).catch((err) => {

	});
}
// // 切换页码
// root.methods.clickChangePage = function (page) {
// 	this.selectIndex = page;
// 	// 切换页码
// 	this.GET_ORDER_CONDUCT();
//
// }

// 切换页码
root.methods.clickChangePage = function (page) {
  // if (this.pageListAjaxLoading === false) {
  //   return
  // }
  this.selectIndex = page;
  this.offset = (page - 1) * this.maxResults
  if (this.offset < 0) {
    this.offset = 0
  }
  // this.loading = true
  this.GET_ORDER_CONDUCT();
}
// 跳转详情
root.methods.GO_DETAIL = function (id, orderType) {
	// console.log(orderType)
	this.$router.push({name: 'OrderDetails', query: {'type': '4','orderId': id, 'orderType': orderType}});
}

export default root
