const root = {};
root.name = "Order";
root.data = function () {
	return{
		order_tab: 1,
		// 搜索单号
		order_search: '',
		// 日期
		value1:'',
	}
};
root.created = function () {
	// 获取当前页面类型
	this.GET_PAGE_TYPE();
	// 默认选中当前页签为进行中
	this.$eventBus.listen(this, 'SET_ORDER_TAB', this.ORDER_TAB);
};

root.methods = {};
// 获取当前页面类型
root.methods.GET_PAGE_TYPE = function () {
	let self = this;
	let pathname = window.location.pathname;
	let list = ['OrderConduct', 'OrderComplete', 'OrderCancel', 'OrderOther'];
	for (let i = 0; i < list.length; i++) {
		if (pathname.indexOf(list[i]) > 0) {
			self.order_tab = i + 1;
		}
	}
}

// 切换标签
root.methods.ORDER_TAB = function (type) {
	let self = this;
	self.order_tab = type;
	switch (type) {
		case 1:
			self.$router.push({name: 'OrderConduct'});
			break;
		case 2:
			self.$router.push({name: 'OrderComplete'});
			break;
		case 3:
			self.$router.push({name: 'OrderCancel'});
			break;
		case 4:
			self.$router.push({name: 'OrderOther'});
			break;
		default:
			self.$router.push({name: 'OrderConduct'});
			break;
	}
}

// 搜索单号
root.methods.SEARCH_ORDER = function () {
	// if (!this.order_search) return;
	this.$eventBus.notify({key: 'SEARCH_ORDER'}, this.order_search);
}



export default root;
