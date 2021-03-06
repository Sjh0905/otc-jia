const root = {};
root.name = "OrderComplete";
root.data = function () {
	return{
		// loading
    	loading: true,
		// 分页
		maxPage: 1,
    page:1,
		selectIndex: 1,
    loadingMoreShow:false,
    showLoadingMore:true,
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
// 认证状态-实名认证
root.computed.identity = function () {
  if(this.$store.state.authState.idType !='NONE')return true
  return false
}
// 认证状态-ga
root.computed.bindGa = function () {
  return this.$store.state.authState && this.$store.state.authState.gaAuth
}
// 认证状态-mobile
root.computed.isBindMobile = function () {
  return this.$store.state.authState && this.$store.state.authState.mobile
}

root.props = {};

root.created = function () {
	// 获取搜索内容
	this.$eventBus.listen(this, 'SEARCH_ORDER', this.GET_ORDER_CONDUCT);

	// 获取订单列表
	this.GET_ORDER_CONDUCT();

	this.getAuthState()

	// console.log('bbbb')
};

root.methods = {};
// 获取列表
root.methods.GET_ORDER_CONDUCT = function (search) {
	this.$http.send('GET_LIST_ORDERS', {
		query: {
			page: this.page,
			maxResults: 10,
			// status: 'COMPLETE', //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
			status: 3, //   1进行中, 3已完成, 4已取消
			ctcOrderId: search || '',
		}
	}).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    this.loading = false;

		if (data.code == 200) {

      this.list.push(...data.data)
      //
      //
      if (data.data.length < 10) {
        this.showLoadingMore = false
      }
      //
      //
      this.page = this.page + 1
      // this.pageSize = this.pageSize + 1
      //
      // this.loading = false
      this.loadingMoreIng = false






			// // let datas = data.dataMap.ctcOrders;
			// let datas = data.data
      // console.info('data=========sss',this.datas)
			// this.list = datas;
			// if (this.list[0] == null) {
			// 	this.list = [];
			// 	return;
			// };
			// this.maxPage = datas.page.totalPages;
			// this.selectIndex = datas.page.pageIndex;
		}
		if (data.code == 1) {
			window.location.reload();
		}
    this.$eventBus.notify('AUTH_TYPE')
	}).catch((err) => {

	});
}
// 切换页码
root.methods.clickChangePage = function (page) {
	this.selectIndex = page;
	// 切换页码
	this.GET_ORDER_CONDUCT();

}

// 点击加载更多
root.methods.clickLoadingMore = function () {
  // this.loadingMoreIng = true
  this.GET_ORDER_CONDUCT()
}
// 跳转详情
root.methods.GO_DETAIL = function (id, orderType) {
	// console.log(orderType)
	this.$router.push({name: 'OrderDetails', query: {'type': '2','orderId': id, 'orderType': orderType}});
}

// 获取认证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    // this.authStateReady = true
    // if (this.bindMobile) {
    //   this.picked = 'bindMobile'
    // }
    // if (this.bindGa) {
    //   this.picked = 'bindGA'
    // }
    return
  }
  this.$http.send('GET_AUTH_STATE')
    .then(({data}) => {
      // console.log(data,'手机认证状态')
      typeof data === 'string' && (data = JSON.parse(data))
      if (!data) return
      this.$store.commit('SET_AUTH_STATE', data.data)
      // if (data.dataMap.sms) {
      //   this.picked = 'bindMobile'
      // }
      // if (data.dataMap.ga) {
      //   this.picked = 'bindGA'
      // }
      // this.authStateReady = true
    })
    .catch(err => {

    })
}

export default root;
