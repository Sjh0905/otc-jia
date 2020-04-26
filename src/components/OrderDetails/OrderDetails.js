const root = {};

import Countdown from '../../../static/js/Countdown'

root.name = "OrderDetails";

// expireTime1

root.data = function () {
	return{
		// 展示付款码
		show_receipt_code: false,

		// 展示弹框
		show_dialog: false,
		// 撤销订单弹框
		show_revoke: false,
		// 确认付款订单
		show_compelete: false,
		// 温馨提示弹框 是否修改支付方式
		show_notice: false,

		// loading
		loading: true,

		// 是否展示收/付款按钮
		show_buy_sell_btn: true,

		// 进行中订单是否显示申诉
		appealTime: 0,
		appeal: '',

		// 订单状态时间
		order_detail_time: '',

		// dialog
		popType: 0,
	    popOpen: false,
	    popText: '系统繁忙',

	    // 是否显示付款按钮
	    paying: false,
	    // 展示订单状态 未付款，已收款，已撤单等
	    order_status: 0,
	    // 是否撤单
	    canneling: false,

	    // 用户信息
	    user_info: {},
	    // 订单列表
	    ctc_order: {},
	    // 支付列表
	    pay_info: [], //分为 商户支付列表 和 个人支付列表
	    // 详情用户状态
	    userType: 0,  // 0 商家， 1 普通用户
	    // 支付宝二维码url
	    alipay_url: '',

	    // 确认未付款
	    no_pay_agree: false,

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

	}
};
root.created = function () {
	// 获取认证状态
	this.GET_AUTH_STATE();
	// this.GET_ORDER_DETAIL()
	// console.log(this.pay_info,'用户名信息')
};

root.components = {
	// loading
	'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
	'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
	'PopupWindow': resolve => require(['../BasePopupWindow/BasePopupWindow.vue'], resolve),
}

root.computed = {};

// 订单类型
root.computed.detail_type = function () {
	return this.$route.query.type;
}

// 订单id
root.computed.ctcOrderId = function () {
	return this.$route.query.orderId;
}
// 买还是卖
root.computed.order_type = function () {
	return this.$route.query.orderType;
}
// 用户id
root.computed.userId = function () {
	return this.$store.state.authMessage.userId;
}
// 服务器时间
root.computed.serverTime = function () {
	return this.$store.state.serverTime;
}

root.computed.result_socket = function () {
	return this.$store.state.result_socket;
}

root.watch = {};

// 在进行中界面，如果倒计时结束了，还没有完成收付款，需要跳到取消页面
root.watch.serverTime = function (newValue, oldValue) {
	let end = !!this.ctc_order.expireTime2 ? this.ctc_order.expireTime2 : this.ctc_order.expireTime1;
	if (this.detail_type == 1 && end <= newValue) {
		this.GO_DETAIL_TYPE(4);
	}
}

root.watch.result_socket = function (newValue, oldValue) {
	let user_id = newValue.data.userId;
	let order_id = newValue.data.orderId;

	if (user_id != this.userId || order_id != this.ctcOrderId) return;

	if (newValue.data.result == 0 && (newValue.key == 'confirmationPay' || newValue.key == 'confirmationReceivables') || (newValue.key == 'cancelOrder')) {

    	if (newValue.key == 'confirmationPay') {
    		this.paying = true;
    		this.GO_DETAIL_TYPE(1);
    	};
    	if (newValue.key == 'confirmationReceivables') {
    		this.paying = true;
    		this.GO_DETAIL_TYPE(2);
    	}

    	// 是否撤单
    	if (newValue.key == 'cancelOrder') {
    		this.canneling = true;
    		this.GO_DETAIL_TYPE(3);
    	}
	}
	if (newValue.data.result == 1) {
		this.popOpen = true;
    	this.popText = newValue.data.message;
	}

}


root.mounted = function () {
	// 获取订单详情
	this.GET_ORDER_DETAIL();
}

root.methods = {};
// 跳转不同详情页
root.methods.GO_DETAIL_TYPE = function (type) {
	let host = window.location;
	let origin = host.origin;
	let pathname = host.pathname;
	let urls = origin + pathname + '?type=' + type + '&orderId=' + this.ctcOrderId + '&orderType=' + this.order_type;
	host.replace(urls);
}

// 详情点击我的订单返回上一级
root.methods.GO_HISTORY = function () {
	let order_list = ['OrderConduct', 'OrderComplete', 'OrderCancel', 'OrderOther'];
	this.$router.push({name: order_list[this.detail_type - 1]});
}

// 银行卡显示后四位
root.methods.changeBankCard = function (card) {
  let number = card.slice(15)
  return `**** **** **** *** ${number}`
}
// 姓名只显示姓
root.methods.changeName = function (name) {
	if (!name) return '';
	return name.substr(0, 1) + new Array(name.length).join('*');
}
// 电话只显示前三位
root.methods.changePhone = function (phone) {
	if (!phone) return;
	let number = phone.slice(0,3)
	return `${number} **** ****`
}

// 我要申诉
root.methods.GO_APPEAL = function () {
	let appeal = this.$store.state.domain_url + 'index/help/wordOrder';
	window.location.replace(appeal);
}

// 取消订单
root.methods.CANCEL_CTC_ORDER = function () {
	if (!this.no_pay_agree) {
		this.popOpen = true;
	    this.popText = '请确定没有付款';
		return;
	}
	this.$http.send('CANCEL_CTC_ORDER', {
		params: {
			confirmNOPay: this.no_pay_agree ? 0 : 1,
			ctcOrderId: this.ctcOrderId,
		}
	}).then(({data}) => {
		let errorCode = data.errorCode;
		if (errorCode == 0) {
			this.CLOSE_DIALOG();
			// 跳到撤单详情界面
			this.GO_DETAIL_TYPE(3);
			this.popType = 1;
			this.popOpen = true;
		    this.popText = '撤销成功';
			return;
		}
		if (errorCode == 1) {
			this.popOpen = true;
		    this.popText = '没有勾选确认付款';
			return;
		}
		if (errorCode == 2 || errorCode == 9) {
			this.popOpen = true;
		    this.popText = '24小时内超过3笔取消订单将禁止2天OTC交易';
			return;
		}
	}).catch((err) => {

  });
}

// 判断支付方式有无变化
root.methods.USER_PAY_INFO = function (ctc_order) {
	if (this.detail_type > 1 || this.order_type == 'BUY') return;
	this.$http.send('USER_PAY_INFO', {
		params: {
			ctcOrder: ctc_order,
		}
	}).then(({data}) => {
		if (data.result == 'FAIL') {
			this.show_dialog = true;
			this.show_notice = true;
		}
	}).catch((err) => {

	});
}



// 获取订单详情
root.methods.GET_ORDER_DETAIL = function () {

	this.$http.send('CTC_ORDER_DETAIL', {
		params: {
			userId: this.userId,
			c2cOrderType: this.order_type,
			ctcOrderId: this.ctcOrderId,
		}
	}).then(({data}) => {
		let self = this;
		let code = data.errorCode;
		let datas = data.dataMap;
		// console.log(data,'bbb')
		if (code == 0) {
			this.loading = false;

			console.log('datas=====',datas,this.detail_type)

			this.appealTime = datas.appealTime;
			this.appeal = datas.ctcOrder.appeal;

			this.userType = datas.userType;


			console.log('rrrrrrrrrrr 88888888',datas.ctcOrder)


			this.ctc_order = datas.ctcOrder;
			// this.user_info = datas.userType == 0 ? (!!datas.user && datas.user || {}) : (!!datas.business && datas.business[0] || {});
			this.user_info = !!datas.user && datas.user || {}
			this.pay_info = (datas.userType == 1 || datas.userType == 4 )  ? (datas.userPayInfoList || []) : (datas.businessPayInfoList || []);
			// 判断用户支付方式有无变化 买入时候需要判断
			// datas.userType == 1 && this.USER_PAY_INFO(this.ctc_order);

			// 订单付款/完成/取消时间

      // this.order_detail_time = (this.detail_type == 2 || this.detail_type == 4) ? this.ctc_order.confirmTime : (this.detail_type == 3 ? this.ctc_order.cancelTime : this.ctc_order.payTime);

      //   订单状态时间  = (订单类型2完成 || 订单类型4全部)
      this.order_detail_time = (this.detail_type == 2 || this.detail_type == 4) ?
        this.ctc_order.confirmTime : (this.detail_type == 3 ?
          this.ctc_order.cancelTime : this.ctc_order.payTime);


      //expireTime1:订单未完成的时间  cancelTime:取消时间  payTime:创建时间  confirmTime:完成时间
      this.order_detail_time =(this.detail_type != 4 || this.detail_type == 4)?
        this.ctc_order.expireTime1 : this.ctc_order.cancelTime;

      // this.order_detail_time = this.detail_type == 2 ||  this.detail_type == 3 ||this.detail_type == 4 || ( this.ctc_order.confirmTime ?  this.ctc_order.cancelTime : this.ctc_order.payTime);
			// console.log(this.ctc_order,'ccc',this.order_detail_time,this.detail_type == 2 || this.detail_type == 4)

			// 是否收/付款
			if (this.ctc_order.type == 'BUY' && this.ctc_order.confirmStatus != 'UNCONFIRMED') { // 如果是买单
				this.paying = true; // 不能点
				return;
			}
			if (this.ctc_order.type == 'SELL' && this.ctc_order.confirmStatus != 'UNCONFIRMED' && this.ctc_order.confirmStatus != 'BUYER_CONFIRM') {  // 如果是卖单
				this.paying = true; // 不能点
				return;
			}
			if (this.ctc_order.type == 'SELL') {
				if (this.ctc_order.confirmStatus != 'UNCONFIRMED') {
					this.order_status = 1; // 显示买家已付款
				}
			}
			// 如果是取消订单列表
			if (!!this.ctc_order.cancelTime) {
				this.paying = true;
				return;
			}

			// 初始化倒计时
			let end = !!this.ctc_order.expireTime2 ? this.ctc_order.expireTime2 : this.ctc_order.expireTime1;
      // (this.detail_type == 1 || this.detail_type == 4) && this.initTimes(this.serverTime, end);
      this.detail_type == 1  && this.initTimes(this.serverTime, end);
      this.detail_type == 4 && this.initTimes(this.serverTime, end);
		}
		switch (code) {
			case 5:
				self.popOpen = true;
	    		self.popText = '用户/商户不存在';
				break;
			case 6:
				self.popOpen = true;
	    		self.popText = '待审核或审核未通过';
				break;
			case 7:
				self.popOpen = true;
	    		self.popText = '保证金未缴纳,异常,释放中,已释放';
				break;
			case 8:
				self.popOpen = true;
	    		self.popText = '对方的支付信息为空';
				break;
			case 2:
				self.popOpen = true;
	    		self.popText = '商家已被禁用';
				break;
			default:
				break;
		}
	}).catch((err) => {

	});
}

// copy
root.methods.COPY = function (type) {
	let copid = this.$refs[type].constructor == Array ? this.$refs[type][0] : this.$refs[type];
	// copy
	this.$globalFunc.COPY(copid);
	this.popType = 1;
	this.popOpen = true;
    this.popText = '复制成功!';
}
// 取消订单
root.methods.ORDER_CANNEL = function () {
	// let type = this.$route.query.type;
	// let list = ['OrderConduct', 'OrderComplete', 'OrderCancel'];
	// this.$router.push({name: list[type - 1]});
	this.show_dialog = true;
	this.show_revoke = true;
}
// 展示收款码
root.methods.SHOW_RECEIPT_CODE = function (alipay_url) {
	this.alipay_url = alipay_url;
	this.show_receipt_code = true;
}
// 隐藏收款码
root.methods.HIDE_RECEIPT_CODE = function () {
	this.show_receipt_code = false;
}

// 隐藏提示dialog
root.methods.popClose = function () {
	this.popType = 0;
	this.popOpen = false;
}

// 关闭付款，取消，提示弹框
root.methods.CLOSE_DIALOG = function () {
	this.show_dialog = false;
	// 撤销订单弹框
	this.show_revoke = false;
	// 确认付款订单
	this.show_compelete = false;
	// 温馨提示弹框
	this.show_notice = false;
}

// 倒计时
root.methods.initTimes = function (now, end) {
	// 买单和卖单都显示15分钟，但是如果是卖单，且开始结束时差大于一小时的时候，且客户已付款，需要显示出小时
	if (this.order_type == 'SELL' && this.ctc_order.confirmStatus == 'BUYER_CONFIRM' && (Number(end) - Number(now) > 3600000)) {
  console.log('ooooooooo=====',document.getElementById('times'))
		new Countdown(document.getElementById('times'), {
		    format: '<span style="margin-left: 2px; color: #ED7265;">hh</span> 时 <span style="margin-left: 2px; color: #ED7265;">mm</span> 分 <span style="margin-left: 2px; color: #ED7265;">ss</span> 秒',
        startTime: now,
        lastTime: end
	  	})
	} else {
		new Countdown(document.getElementById('times'), {
		    format: '<span style="margin-left: 2px; color: #ED7265;">mm</span> 分 <span style="margin-left: 2px; color: #ED7265;">ss</span> 秒',
        startTime: now,
        lastTime: end
	  	});
	}
}

// 确认付款弹框
root.methods.SHOW_COMPELETE = function () {
	this.show_dialog = true;
	// 撤销订单弹框
	this.show_compelete = true;
}
// 确认付款按钮
root.methods.COMPLETE_BTN = function () {
	if (this.order_type == 'SELL') {
		// 邮箱验证
		// this.show_mail = true;
		// 谷歌手机二级验证
		this.show_ga_sms_dialog = true;

		this.show_dialog = false;
	}
	if (this.order_type == 'BUY') {
		this.$http.send('COMFIRM_PAYMENT', {
			params: {
				"ctcOrderId": this.ctc_order.id
			}
		}).then(({data}) => {
			// console.log(data,'aaa')
			let code = data.errorCode;
			if (code == 0) {
				// 关闭弹框
				this.CLOSE_DIALOG();
				// 跳到已完成界面
				this.GO_ORDER_COMPELETE();
				this.popType = 1;
				this.popOpen = true;
				this.popText = '付款成功';
			}

			if (code > 0) {
				this.popOpen = true;
		    	this.popText = '系统繁忙，请稍后重试';
			}
		}).catch((err) => {
			console.log(err,'aaa')
		});
	}
}

// 收付款成功后跳到完成界面
root.methods.GO_ORDER_COMPELETE = function () {
	let order_type = this.order_type == 'BUY' ? 1 : 2;
	this.GO_DETAIL_TYPE(order_type);
}

// 谷歌验证那一堆代码 start

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

  // console.log(code,'code')

  if (pickedType === 'mobile') {

    this.$http.send('COMMEN_AUTH_FORCTC', {
		params: {
			"type": pickedType,
  			"code": code,
  			"purpose":"Confirm",
			"ctcOrderId": this.ctc_order.id
		}
	}).then(({data}) => {
		let code = data.errorCode;
			this.sending = false;
		if (code == 0) {
			this.show_buy_sell_btn = false;
			this.show_ga_sms_dialog = false;
			// 跳到已完成界面
			this.GO_ORDER_COMPELETE();
		}
		if (code > 0) {
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
		this.popOpen = true;
    	this.popText = '系统繁忙，请稍后重试';
	});
    return
  }

  this.$http.send('COMMEN_AUTH_FORCTC', {
		params: {
			"type": pickedType,
  			"code": code,
  			"purpose":"Confirm",
			"ctcOrderId": this.ctc_order.id
		}
	}).then(({data}) => {
		let code = data.errorCode;
			this.sending = false;
		if (code == 0) {
			this.show_buy_sell_btn = false;
			this.show_ga_sms_dialog = false;
			// 跳到已完成界面
			this.GO_ORDER_COMPELETE();
		}
		if (code > 0) {
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
		this.popOpen = true;
    	this.popText = '系统繁忙，请稍后重试';
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

  this.$http.send('ORDER_MAIL_CODE', {
  	params: {
		type: "mobile",
		mun: "",
		purpose:"Confirm"
	}
  }).then(({data}) => {
  	if (data.errorCode == 0) {
  		this.getVerificationCodeInterval = setInterval(() => {
	    this.getVerificationCodeCountdown--
	    if (this.getVerificationCodeCountdown <= 0) {
	      this.getVerificationCode = false
	      this.getVerificationCodeCountdown = 60
	      clearInterval(this.getVerificationCodeInterval)
	    }
	  }, 1000)
  	}
  	data.errorCode === 1 && (this.verificationCodeWA = '用户未登录')
    data.errorCode === 2 && (this.verificationCodeWA = '过于频繁')
    data.errorCode === 3 && (this.verificationCodeWA = '手机验证码发送异常')
    data.errorCode === 4 && (this.verificationCodeWA = '过于频繁')
    data.errorCode === 100 && (this.verificationCodeWA = '过于频繁被锁定')
  }).catch((err) => {
		this.getVerificationCode = false
		this.getVerificationCodeCountdown = 60
		this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
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
		this.identity_type = res;
		if (res.result == 'SUCCESS' && ((res.sms || res.ga) && res.email)) {
			this.identity = true;
		}
		// 两者都验证了
		this.bindGA = res.ga;
		this.bindMobile = res.sms;
		this.bindMobile && (this.picked = 'bindMobile');
		this.bindGA && (this.picked = 'bindGA');
		if (this.bindGA && this.bindMobile) {
			this.showPicker = true;
		}

		this.loading = false
	}).catch((err) => {

	})
}

// 谷歌验证那一堆东西 end


// 邮箱认证那一堆东西 start

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
			"ctcOrderId": this.ctc_order.id
		}
	}).then(({data}) => {
		let error = data.errorCode;
		if (error > 0) {
			this.INIT_EMAIL();
			this.mailCodeWA = '请输入正确验证码';
			return;
		}
		this.INIT_EMAIL();
		this.show_mail = false;
		this.show_ga_sms_dialog = true;
		// 关闭弹框
		this.CLOSE_DIALOG();
	}).catch((err) => {

	})
}

// 初始化邮箱信息
root.methods.INIT_EMAIL = function () {
	this.sending = false;
	this.getMailCode = false;
    this.getMailCodeCountdown = 60;
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval);
}

// 邮箱认证那一堆东西 end



export default root;
