const root = {};
root.name = "OrderConduct";
root.data = function () {
	return{
		// loading
    	loading: true,
		// 分页
		maxPage: 1,
		selectIndex: 1,
		// 列表
		list: [],

		// dialog
		popType: 0,
	    popOpen: false,
	    popText: '系统繁忙',

	    // 展示确认已付款弹框
	    show_dialog: false,
	    show_buy_dialog: false,
	    show_sell_dialog: false,

	    // 当前订单信息
	    order_detail: {},

	    // 确认收/付款
	    paying: false,

	    // 邮箱验证
	    sendingEmail: false,
	    bindEmail: false,
	    show_mail: false,
	    mailCode: '',
	    mailCodeWA: '',
	    getMailCode: false,
	    getMailCodeCountdown: 60,

	    // 谷歌验证码信息
	    // 展示验证信息框
	    show_ga_sms_dialog: false,
	    // 验证信息
	    verificationCode: '',
    	verificationCodeWA: '',

    	getVerificationCode: false,
	    getVerificationCodeInterval: null,
	    getVerificationCodeCountdown: 60,
	    clickVerificationCodeButton: false,

	    // 是否显示验证
	    showPicker: false,
	    bindGA: false,
	    bindMobile: false,
	    picked: '',
	    // 短信码/谷歌码
	    GACode: '',
	    GACodeWA: '',
			sending: false,
			authStatePopupType: 1,// 提示绑定状态弹窗 1为身份认证，2为谷歌或者手机认证
			authStatePopupWindow: false, // 提示绑定状态弹窗
			// 用户数据
			user_info:{}

	}
};

root.components = {
	'BasePageBar': resolve => require(['@/components/BasePageBar/BasePageBar.vue'], resolve),
	// loading
	'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
	'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
	'PopupWindow': resolve => require(['../BasePopupWindow/BasePopupWindow.vue'], resolve),
}

root.computed = {};

root.computed.userId = function () {
	return this.$store.state.authState.userId;
}

root.computed.result_socket = function () {
	return this.$store.state.result_socket;
}
// 认证状态-实名认证
root.computed.identity = function () {
  if(this.$store.state.authState.idType =='PASSPORT')return true
  return false
}
// 认证状态-ga
root.computed.bindGa = function () {
  return this.$store.state.authState && this.$store.state.authState.ga
}
// 认证状态-mobile
root.computed.isBindMobile = function () {
  return this.$store.state.authState && this.$store.state.authState.sms
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.watch = {};

root.watch.result_socket = function (newValue, oldValue) {
	let user_id = newValue.data.userId;
	if (user_id != this.userId) return;
	if (newValue.data.result == 0 && (newValue.key == 'confirmationPay' || newValue.key == 'confirmationReceivables' || newValue.key == 'c2corder' || newValue.key == 'cancelOrder')) {
		// this.popOpen = true;
		// this.popType = 1;
  //   	this.popText = newValue.data.message;
    	// 已收/付款
    	this.paying = true;
		// 重新渲染列表
		this.GET_ORDER_CONDUCT();
	}
	if (newValue.data.result == 1) {
		this.popOpen = true;
    	this.popText = newValue.data.message;
	}

}

root.props = {};

root.created = function () {
	// 获取搜索内容
	this.$eventBus.listen(this, 'SEARCH_ORDER', this.GET_ORDER_CONDUCT);

	// 获取订单列表
	this.GET_ORDER_CONDUCT();

	// 获取认证状态
	this.GET_AUTH_STATE();

	// 订单页签默认选中1
	this.$eventBus.notify({key: 'SET_ORDER_TAB'}, 1);
	// console.log('aaaaaaaaa')
	this.getAuthState()
};

root.methods = {};

// 关闭付款，取消，提示弹框
root.methods.CLOSE_DIALOG = function () {
	this.show_dialog = false;
	// 隐藏已收款
	this.show_buy_dialog = false;
	// 隐藏已付款
	this.show_sell_dialog = false;
}

// 获取列表
root.methods.GET_ORDER_CONDUCT = function (search) {
	this.$http.send('GET_LIST_ORDERS', {
    query: {
			offset: this.selectIndex,
			maxResults: 10,
			// status: 'PROCESSING', //  “PROCESSING”进行中, “COMPLETE”已完成, “CANCEL”已取消
			status: 1, //  1进行中, 3已完成, 4已取消 ，0 全部
			ctcOrderId: search || '',
		}
	}).then(({data}) => {
		// console.log(data,'aaa')
		if (data.code == 200) {
			this.loading = false;
			// let datas = data.dataMap.ctcOrders;
			let datas = data.data
			this.list = datas;
			if (this.list[0] == null) {
				this.list = [];
				return;
			};
			this.GET_ORDER_CONDUCT()
			this.maxPage = datas.page.totalPages;
			this.selectIndex = datas.page.pageIndex;
		}
		if (data.code == 1) {
			window.location.reload();
		}
	}).catch((err) => {
		console.log(err);
	});
}

// 确认收/付款
root.methods.COMFIRM_BTN = function (item) {
	this.$http.send('CTC_ORDER_DETAIL', {
		query: {
			id: item.id,
		}
	}).then(({data}) => {
		let datas = data.data;
		this.user_info = !!datas.userPayment && datas.userPayment || {}
		// console.log(this.user_info,'ddd')

	}).catch((err) => {

	});
	//sss屏蔽
	// if(!this.openAuthStatePopupWindow()){
  //   return
	// }
  //sss屏蔽结束
	// console.log(item,'aaa')
	if (item.sellerId == this.userId) {
		// if (!this.bindEmail) {
		// 	this.popOpen = true;
	 //    	this.popText = '请先绑定邮箱';
		// 	return;
		// };
		this.show_sell_dialog = true;
	}
	if (item.sellerId != this.userId) {
		this.show_buy_dialog = true;
	}
	this.order_detail = item;
	this.show_dialog = true;

}

// 确认已付款
root.methods.COMFIRM_PAYMENT = function () {
	// console.log(this.order_detail.id)
	let self = this;
	this.$http.send('COMFIRM_PAYMENT', {
		params: {
			id: this.order_detail.id
		}
	}).then(({data}) => {
		console.log(this.order_detail.id,'aaa')
		let code = data.code;
		if (code == '200') {
			this.show_dialog = false;
			this.show_buy_dialog = false;
			// // 重新渲染列表
			this.GET_ORDER_CONDUCT();
			this.$router.push({name: 'OrderDetails', query: {'type': '1','orderId': this.order_detail.id, 'orderType':this.order_detail.type}});
		}
		if (code == 'FAIL') {
      this.popOpen = true;
      this.popText = '系统繁忙，请稍后重试';
    }
    if (code == '1032') {
      this.popOpen = true;
      this.popText = '订单超时';
    }
    if (code == '1016') {
      this.popOpen = true;
      this.popText = '订单未找到';
    }

	}).catch((err) => {
		console.log(err)
	});
}

// 确认已收款
// root.methods.COMFIRM_RECEIVABLES = function () {
// 	this.CLOSE_DIALOG();
// 	// this.show_mail = true;
// 	this.show_ga_sms_dialog = true;
// }

// 确认收款按钮
root.methods.COMFIRM_RECEIVED = function () {

  if (this.order_detail.sellerId == this.userId) {
    this.$http.send('COMFIRM_RECEIVED', {
      params: {
        id: this.order_detail.id
      }
    }).then(({data}) => {
      // console.log(data,'aaa')
      let code = data.code;
      if (code == 200) {
        // 关闭弹框
        this.CLOSE_DIALOG();

        // 跳到已完成界面
        // this.GO_ORDER_COMPELETE();
        this.popType = 1;
        this.popOpen = true;
        this.popText = '收款成功';
        this.$router.push({name: 'OrderDetails', query: {'type': '1','orderId': this.order_detail.id, 'orderType':this.order_detail.type}});
        this.GET_ORDER_CONDUCT();
        return;
      }

      if (code == 1016) {
        this.popOpen = true;
        this.popText = '订单未找到';
        return;
      }
      if (code == 500) {
        this.popOpen = true;
        this.popText = '订单操作中，无法取消';
        return;
      }
      if (code == 1032) {
        this.popOpen = true;
        this.popText = '订单超时';
        return;
      }
      if (code == 1025) {
        this.popOpen = true;
        this.popText = '订单不是一个待支付订单';
        return;
      }
      if (code == 1026) {
        this.popOpen = true;
        this.popText = '只有已支付状态的的订单才能确认';
        return;
      }

    }).catch((err) => {
      console.log(err,'aaa')
    });
  }
}

// 收付款成功后跳到完成界面
root.methods.GO_ORDER_COMPELETE = function () {
  let order_type = this.sellerId != this.userId ? 1 : 2;
  this.GO_DETAIL_TYPE(order_type);
}

// 切换页码
root.methods.clickChangePage = function (page) {
	this.selectIndex = page;
	// 切换页码
	this.GET_ORDER_CONDUCT();
}
// 跳转详情
root.methods.GO_DETAIL = function (id, orderType) {
	this.$router.push({name: 'OrderDetails', query: {'type': '1','orderId': id, 'orderType': orderType}});
}

// 隐藏提示dialog
root.methods.popClose = function () {
	this.popType = 0;
	this.popOpen = false;
}

// 获取邮箱验证码
root.methods.GET_MAIL_CODE = function () {

	this.$http.send('ORDER_MAIL_CODE',{
		params: {
			type: "email",
			mun: "",
			purpose:"Confirm"
		}
	}).then(({data}) => {
		if (data.errorCode == 0) {
			this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
			this.getVerificationCodeInterval = setInterval(() => {
			this.getMailCodeCountdown--
			this.getMailCode = true;
			this.sendingEmail = true;
			if (this.getMailCodeCountdown <= 0) {
					this.getMailCode = false;
					this.getMailCodeCountdown = 60
					clearInterval(this.getVerificationCodeInterval)
				}
			}, 1000)
		}
	}).catch((err) => {
		this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval);
		this.getMailCode = false;
		this.getMailCodeCountdown = 60;
		console.log(err)
	})
}

// 验证邮箱验证码
root.methods.VALID_EMAIL = function () {

	if (!this.mailCode) {
		this.mailCodeWA = '请输入验证码';
		return;
	}

	if (!this.sendingEmail) {
		this.mailCodeWA = '请先获取验证码';
		return;
	}

	this.$http.send('COMMEN_AUTH_FORCTC',{
		params: {
			"type": 'email',
			"code": this.mailCode,
			"purpose":"Confirm",
			"ctcOrderId": this.order_detail.id
		}
	}).then(({data}) => {
		let error = data.errorCode;
		if (error > 0) {
			this.INIT_EMAIL();
			this.mailCodeWA = '请输入正确验证码';
			return;
		}
		this.INIT_EMAIL();
		this.show_ga_sms_dialog = true;
		// 关闭弹框
		this.CLOSE_DIALOG();
	}).catch((err) => {
		console.log(err)
	})
}

// 初始化邮箱信息
root.methods.INIT_EMAIL = function () {
	this.sending = false;
	this.getMailCode = false;
    this.getMailCodeCountdown = 60;
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval);
}


// 谷歌验证那一堆代码

// 检测验证码
root.methods.testVerificationCode = function () {
  if (this.picked !== 'bindMobile') {
    this.verificationCodeWA = ''
    return true
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 检测谷歌验证码
root.methods.testGACode = function () {
  if (this.picked !== 'bindGA') {
    this.GACodeWA = ''
    return true
  }
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true

}

// 点击发送
root.methods.click_send = function () {
  let canSend = true;

  if (this.verificationCode === '' && this.picked === 'bindMobile') {
    this.verificationCodeWA = '请输入验证码'
    canSend = false
  }
  if (!this.clickVerificationCodeButton && this.picked === 'bindMobile') {
    this.verificationCodeWA = '请输入验证码'
    canSend = false
  }
  if (this.GACode === '' && this.picked === 'bindGA') {
    this.GACodeWA = '请输入验证码'
    canSend = false
  }


  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  let pickedType = ''
  if (this.picked === 'bindMobile') {
    pickedType = 'mobile'
  }
  if (this.picked === 'bindGA') {
    pickedType = 'ga'
  }

  let code = ''
  this.picked === 'bindGA' && (code = this.GACode)
  this.picked === 'bindMobile' && (code = this.verificationCode)
  // console.log('emailemial', this.$route.query.email)

  this.sending = true;

  // let params

  console.log(code,'code')

  if (pickedType === 'mobile') {

    this.$http.send('COMMEN_AUTH_FORCTC', {
		params: {
			"type": pickedType,
  			"code": code,
  			"purpose":"Confirm",
			"ctcOrderId": this.order_detail.id
		}
	}).then(({data}) => {
		let errorCode = data.errorCode;
			this.sending = false;
		if (errorCode == 0) {
			this.CLOSE_GA_SMS_DIALOG();
			// 重新渲染列表
			// this.GET_ORDER_CONDUCT();
		}
		if (errorCode > 0) {
			let self = this;
			this.popOpen = true;
			switch (code) {
	    		case 1:
	    			self.popText = '用户未登录';
	    			break;
	    		case 3:
	    			self.popText = '系统繁忙';
	    			break;
	    		case 5:
	    			self.popText = '验证码过期/错误';
	    			break;
	    		default:
	    			break;
	    	}
		}
	}).catch((err) => {
		this.sending = false;
		console.log(err)
	});
    return
  }

  this.$http.send('COMMEN_AUTH_FORCTC', {
		params: {
			"type": pickedType,
  			"code": code,
  			"purpose":"Confirm",
			"ctcOrderId": this.order_detail.id
		}
	}).then(({data}) => {
		let errorCode = data.errorCode;
			this.sending = false;
		if (errorCode == 0) {
			this.CLOSE_GA_SMS_DIALOG();
			// 重新渲染列表
			// this.GET_ORDER_CONDUCT();
		}
		if (errorCode > 0) {
			let self = this;
			this.popOpen = true;
			switch (code) {
	    		case 1:
	    			self.popText = '用户未登录';
	    			break;
	    		case 3:
	    			self.popText = '系统繁忙';
	    			break;
	    		case 5:
	    			self.popText = '验证码过期/错误';
	    			break;
	    		default:
	    			break;
				}
			// 	console.log('aaa')
			// this.st = setTimeout(()=>{
			// 	window.location.reload()
			// },2000)
		}
	}).catch((err) => {
		this.sending = false;
		this.popOpen = true;
			this.popText = '系统繁忙，请稍后重试';
			console.log(err)
	});

}



// 检测验证码
root.methods.testVerificationCode = function () {
  if (this.picked !== 'bindMobile') {
    this.verificationCodeWA = ''
    return true
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}


// 检测谷歌验证码
root.methods.testGACode = function () {
  if (this.picked !== 'bindGA') {
    this.GACodeWA = ''
    return true
  }
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true

}

// 点击发送验证码
root.methods.click_getVerificationCode = function () {

  this.clickVerificationCodeButton = true


  this.getVerificationCode = true
  this.clickVerificationCodeButton = true
  this.verificationCodeWA = ''

  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)

  this.getVerificationCodeInterval = setInterval(() => {
    this.getVerificationCodeCountdown--
    if (this.getVerificationCodeCountdown <= 0) {
      this.getVerificationCode = false
      this.getVerificationCodeCountdown = 60
      clearInterval(this.getVerificationCodeInterval)
    }
  }, 1000)

  this.$http.send('ORDER_MAIL_CODE',{
  	params: {
		type: "mobile",
		mun: "",
		purpose:"Confirm"
	}
  }).then(({data}) => {
  	data.errorCode === 1 && (this.verificationCodeWA = '用户未登录')
    data.errorCode === 2 && (this.verificationCodeWA = '过于频繁')
    data.errorCode === 3 && (this.verificationCodeWA = '手机验证码发送异常')
    data.errorCode === 4 && (this.verificationCodeWA = '过于频繁')
    data.errorCode === 100 && (this.verificationCodeWA = '过于频繁被锁定')
  }).catch((err) => {
		console.log(err)
  })

}

root.methods.re_getVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data)
}

// 关闭验证框
root.methods.CLOSE_GA_SMS_DIALOG = function () {
	this.show_ga_sms_dialog = false;
	this.show_mail = false;
}

// 认证状态
root.methods.GET_AUTH_STATE = function () {
	this.$http.send('GET_AUTH_STATE').then(({data}) => {
		typeof data === 'string' && (data = JSON.parse(data));
		let res = data.dataMap;
		this.identity_type = data;
		if (res.result == 'SUCCESS' && ((res.sms || res.ga) && res.email)) {
			this.identity = true;
		}
		// 两者都验证了
		this.bindGA = res.ga;
		this.bindMobile = res.sms;
		this.bindEmail = res.mail;
		this.bindMobile && (this.picked = 'bindMobile');
		this.bindGA && (this.picked = 'bindGA');
		if (this.bindGA && this.bindMobile) {
			this.showPicker = true;
		}

		this.loading = false
	}).catch((err) => {
		console.log(err)
	})
}
/**---------认证弹窗部分-----*/
// 清空认证状态弹窗
// root.methods.clearAuthStatePopupWindow = function () {
//   this.authStatePopupType = 1
// }

// 打开认证状态弹窗
root.methods.openAuthStatePopupWindow = function () {
  // console.log(this.identity,"实名认证")
  if (!this.identity) {
    this.authStatePopupType = 1
    this.authStatePopupWindow = true
    return false
  }
  if (!this.bindGa && !this.isBindMobile) {
    this.authStatePopupType = 2
    this.authStatePopupWindow = true
    return false
  }
  return true
}
// 关闭认证状态弹窗
root.methods.closeAuthStatePopupWindow = function () {
  this.authStatePopupWindow = false
  this.clearAuthStatePopupWindow()
}

// 清空认证状态弹窗
root.methods.clearAuthStatePopupWindow = function () {
  this.authStatePopupType = 1
}
// 去认证
root.methods.goToAuth = function () {
  if(this.isMobile){
    window.location.replace(this.$store.state.download_app);
  }else {
    let open_url = this.$store.state.domain_url + 'index/personal/auth/authentication'
    window.open(open_url);
  }
}

// 去绑定
root.methods.goToBind = function () {
  let open_url = this.$store.state.domain_url + 'index/personal/securityCenter'
  window.open(open_url);
}
// 获取认证状态
root.methods.getAuthState = function () {
  if (this.$store.state.authState) {
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
