const root = {};
root.name = "BusinessApplication";
root.data = function () {
	return{
		// 支付方式
		currency: 0,
		// 支付数量和币种
		key_amount: {},
		// 同意商家认证协议
		agree: false,
		// 用户认证信息
		auth_info: {},
		// dialog
		popType: 0,
	    popOpen: false,
	    popText: '系统繁忙',

	    // loading
	    loading: true,
	}
};
root.components = {
  'BasePageTopBar': resolve => require(['../BasePageTopBar/BasePageTopBar.vue'], resolve),
  'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
  'Loading' : resolve => require(['../Loading/Loading.vue'], resolve),
}
root.created = function () {
	// 获取认证状态
	this.GET_USER_AUTO_INFO();
	// console.log(this.auth_info,'aaa')
};
root.computed = {};
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 判断路由显示
// root.computed.isRoute = function(){
// 		 let route=this.$route.redirectedFrom
// 		 return route;
// }


root.methods = {};
// 获取认证状态
root.methods.GET_USER_AUTO_INFO = function () {
	this.$http.send('GET_USER_AUTO_INFO').then(({data}) => {
		// console.log(data,"银行卡绑定测试");
		let auth_info = data.dataMap;
		this.auth_info = auth_info;

		for (let item in auth_info.BOND) {
			this.key_amount.name = item;
			this.key_amount.value = auth_info.BOND[item];
		}
		this.loading = false;
		// console.log(this.auth_info,'aaa')
		// 已经成为商家直接进入商家中心
		if (auth_info.audits == 1) {
			this.$router.push({name: 'BusinessCenter'});
		}
	}).catch((err) => {
		// this.popOpen = true;
		// this.popText = '请稍后重试';
	});
}

// 提交申请
root.methods.APPLY_SUBMIT = function () {
	let notice = ['请先完成实名认证','请先绑定手机号','请先绑定银行卡','请同意支付保障金!', '请同意商家认证协议!'];
	if (!this.auth_info.idType) {
		this.popOpen = true;
	    this.popText = notice[0];
	    return false;
	}
	if (!this.auth_info.mobile&&!this.auth_info.ga) {
			this.popOpen = true;
	    this.popText = notice[1];
	    return false;
	}
	if (!this.auth_info.method) {
		this.popOpen = true;
	    this.popText = notice[2];
	    return false;
	}
	// if (this.currency == 0) {
	// 	this.popOpen = true;
	//     this.popText = notice[3];
	//     return false;
	// }
	// if (!this.agree) {
	// 	this.popOpen = true;
	//     this.popText = notice[4];
	//     return false;
	// }

	this.$http.send('APPLY_BUSINESS', {
		params: {
			// currency: this.currency == 1 && this.key_amount.name,
      currency:'USDT',
		}
	}).then(({data}) => {
		// console.log(data);
		let self = this;
		let err = data.errorCode;
		let notice = ['请先登录账号','请先完成实名认证','请先绑定手机号','请先绑定银行卡', '商家的可用余额小于保证金金额', '提交成功'];
		switch (err) {
			case 1:
				self.popOpen = true;
				self.popText = notice[0];
				window.location.reload();
				break;
			case 2:
				self.popOpen = true;
				self.popText = notice[1];
				break;
			case 3:
				self.popOpen = true;
				self.popText = notice[2];
				break;
			case 4:
				self.popOpen = true;
				self.popText = notice[3];
				break;
			case 10:
				self.popOpen = true;
				self.popText = notice[4];
				break;
			default:
				self.popType = 1;
				self.popOpen = true;
				self.popText = notice[5];
				self.GET_USER_AUTO_INFO();
				break;
		}
	}).catch((err) => {
		// this.popOpen = true;
		// this.popText = '请稍后重试';
	});
}
// 隐藏提示dialog
root.methods.popClose = function () {
	this.popType = 0;
	this.popOpen = false;
}
// 身份认证
root.methods.GO_AUTHEUSER = function () {
  if(this.isMobile){
    window.open(this.$store.state.download_app);
  }else {
    let open_url = this.$store.state.domain_url + 'index/personal/auth/authenticate'
    window.open(open_url);
  }
}
// 去认证
root.methods.GO_AUTHENTICATION = function () {
	let open_url = this.$store.state.domain_url + 'index/personal/securityCenter'
	window.open(open_url);
}
// 我要申诉
root.methods.GO_APPEAL = function () {
	let appeal = this.$store.state.domain_url + 'index/help/wordOrder';
	window.open(appeal);
}

export default root;
