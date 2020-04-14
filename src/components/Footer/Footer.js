const root = {};
root.name = "Footer";
root.data = function () {
return{
}
};
root.created = function () {
};

root.methods = {}
// 跳转到关于我们
root.methods.goToAboutUs = function () {
  // let btcdo_url = this.$store.state.domain_url + 'index/aboutUs';
  // window.open(btcdo_url);
  this.$http.send('SIGN_TEST',{
      params:{
        // email:"592891850@qq.com"
        // email:"wjl005@163.com" //用户
        email:"592891850@qq.com",//商家
        // email:"2534471591@qq.com"
        // email:"18811701164"
      }
  }

    ).then(({data}) => {
    console.warn('b 请求返回的结果', data)

  }).catch((err) => {
    console.warn('b 请求出错', err)
  })
}

// 跳转到服务协议
root.methods.goToUserAgreement = function () {
  let btcdo_url = this.$store.state.domain_url + 'index/help/userAgreement';
  window.open(btcdo_url);
}

// 跳转到费率标准
root.methods.goToRateStandard = function () {
  let btcdo_url = this.$store.state.domain_url + 'index/help/rateStandard';
  window.open(btcdo_url);
}

// 跳转到上币申请
root.methods.goToApplication = function () {
  let btcdo_url = 'https://jinshuju.net/f/jhg65X';
  window.open(btcdo_url);
}

// 跳转到API
root.methods.goToAPI = function () {
  let btcdo_url = 'https://github.com/btcdolab?tab=repositories';
  window.open(btcdo_url);
}

//跳转到官网币币交易页面
root.methods.gotoBBjiaoy = function () {
  window.location.replace(this.$store.state.domain_url + 'index/tradingHall?symbol=JADE_USDT');
}

//跳转到关于我们页面
root.methods.gotoAboutUs = function () {
  window.location.replace(this.$store.state.domain_url + 'index/aboutUs');
}

//跳转到服务协议页面
root.methods.gotoUserAgreement = function () {
  window.location.replace(this.$store.state.domain_url + 'index/help/userAgreement');
}

//跳转到隐私协议页面
root.methods.gotoUserPrivacy = function () {
  window.location.replace(this.$store.state.domain_url + 'index/help/userPrivacy');
}

//跳转到费率标准页面
root.methods.gotoRateStandard = function () {
  window.location.replace(this.$store.state.domain_url + 'index/help/rateStandard');
}

//跳转到新手指南页面
root.methods.gotoBeginnersGuide = function () {
  window.location.replace(this.$store.state.domain_url + 'index/beginnersGuide');
}

//跳转到加入我们页面
root.methods.gotoJoinUs = function () {
  window.location.replace(this.$store.state.domain_url + 'index/joinUs');
}


export default root;
