const root = {};
root.name = "Header";
root.data = function () {
	return{
    isBlack:true,
    jtval:'white'
	}
};
root.created = function () {

	// console.log("document.cookie----------"+document.cookie);
	// console.log(this.isRoute,"aa")

};
root.computed = {};
root.computed.lang = function () {
	return this.$store.state.lang;
}
root.computed.isLogin = function () {
	return this.$store.state.isLogin;
  if (this.$store.state.authMessage.userId !== '') return true
  return false

  // 是否登录
  if (!this.isLogin) {
    window.location.replace(this.$store.state.domain_url + 'index/sign/login?symbol=ETH_USDT');
    return
  }
}


// 判断是否登录
// root.computed.isLogin = function () {
//   if (this.$store.state.authMessage.userId !== '') return true
//   return false
// }
// socket 信息
root.computed.socket = function () {
	return this.$store.state.socket;
}
// 路由信息
root.computed.isRoute = function () {
		let route = this.$route.matched[1].name
		let a

		return route
}



root.mounted = function () {

}

// 是否登录


root.methods = {};
// 更换语言
root.methods.changeLanguage = function (lang) {
	this.$store.commit('CHANGE_LANG', lang);
}
// 跳到币币交易大厅
root.methods.GO_TRADINGVIEW = function () {
	let btcdo_url = this.$store.state.domain_url + 'index/tradingHall';
	window.location.replace(btcdo_url);
}
// 个人资产
root.methods.GO_RECHARGE = function () {
	let btcdo_url = this.$store.state.domain_url + 'index/asset/rechargeAndWithdrawals';
	window.location.replace(btcdo_url);
}

// 登出
root.methods.LOGIN_OUT = function () {
	let btb_url = process.env.DOMAIN;
	let replace_url = btb_url;
	// console.log(replace_url)
	this.$http.send('SIGNOUT_CTC').then(({data}) => {
		if (data.errorCode == 0) {
			this.$store.commit('LOGIN_OUT');
			// window.location.reload();
      // this.$router.push('index/home')
			// window.location.replace(replace_url);
			window.location.replace('https://www.815ex.com');
		}
	}).catch((err) => {

	});
}

//鼠标移入改变图片
root.methods.enter = function () {
  this.jtval = 'yellow';
}

//鼠标移入改变语言文字样式和上下箭头
root.methods.leave = function () {
  this.jtval = 'white';
}

//跳转到官网首页
root.methods.goBackIndex = function () {
  window.location.replace(this.$store.state.domain_url + 'index/home');
}

//跳转到币币交易页面
root.methods.goToTradingHall = function () {
  window.location.replace(this.$store.state.domain_url + 'index/tradingHall?symbol=JADE_USDT');
}

//跳转到充值提现页面
root.methods.goToRechargeAndWithdrawals = function () {
  window.location.replace(this.$store.state.domain_url + 'index/asset/rechargeAndWithdrawals');
}

//跳转到充值记录页面
root.methods.goToRechargeRecord = function () {
  window.location.replace(this.$store.state.domain_url + 'index/asset/rechargeRecord');
}

//跳转到提现记录页面
root.methods.goToWithdrawalsRecord = function () {
  window.location.replace(this.$store.state.domain_url + 'index/asset/withdrawalsRecord');
}

//跳转到C2C订单页面
// root.methods.goToWithdrawalsCC = function () {
//   window.location.replace(this.$store.state.domain_url + '/index/Transaction/TransactionBuy');
// }


export default root;
