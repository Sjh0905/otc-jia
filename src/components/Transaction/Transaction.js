import store from "../../configs/storeConfigs/storeConfigs";

const root = {};
root.name = "Transaction";
root.components = {
  'BasePopupWindow': resolve => require(['@/components/BasePopupWindow/BasePopupWindow.vue'], resolve),
  // loading
  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  // 点击选择框
  'BaseCheckBox': resolve => require(['../BaseCheckBox/BaseCheckBox.vue'], resolve),
  'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
}

root.data = function () {
return{
  // loading
  loading: true,
  // 首次风险提示弹窗
  popWindowOpenForFirst: false,

  // 其余弹窗样式
  popWindowOpenForCommon: false,

  // 显示余额
  userAccounts: 0,

  // 获取用户资产的loading
  accountLoading: false,
  // 获取用户绑定信息的loading
  authStateLoading: false,

  // 首次弹窗是否选中
  popAgreement: false,

  popOpen: false,
  popType: 0,
  popText: '',

}
};
root.created = function () {
  // 是否第一次进入此页
  this.isFirstVisit()

  // 获取用户资产
  this.getAccount()
  // 获取用户绑定状态
  this.getAuthState()
};

// 计算
root.computed = {}
// 计算当前的服务器时间
root.computed.buyOrSell = function () {
  if(this.$route.name === 'TransactionBuy') {
    return 'BUY'
  } else {
    return 'SELL'
  }
}

root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}

root.computed.account = function () {
  return this.toFixed(this.$store.state.account*1,8)
}

root.methods = {}
// 第一次进入是否弹窗
root.methods.isFirstVisit = function () {
  this.$http.send('IS_FIRST_VISIT')
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      if (data.errorCode) {
        switch (data.errorCode) {
          case 2:
            this.popWindowOpenForFirst = true
            break;
        }
        return
      }
    }).catch((err) => {
    console.log('err', err)
  });
}

// 首次弹窗内点击弹框的
root.methods.changePopAgreement = function () {
  this.popAgreement = !this.popAgreement
}

// 首次风险提示弹窗确认按钮
root.methods.popWindowCloseForFirst = function () {
  // if(this.popAgreement === false) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '请同意《OTC交易用户服务协议》'
  //   return
  // }
  this.$http.send('CONFIRM_MARKET_RULES_RECORD')
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      if (data.errorCode) {
        switch (data.errorCode) {
          case 1:
            this.popOpen = true
            this.popType = 0
            this.popText = '用户未登录'
            break;
        }
        return
      }
      this.popWindowOpenForFirst = false
    }).catch((err) => {
    console.log('err', err)
  });





}
// 首次风险提示弹窗关闭按钮
root.methods.popWindowGoAheadForFirst = function () {
  this.popWindowOpenForFirst = false
  window.location.href = this.$store.state.domain_url + 'index/home';
}



// 检查loading
root.methods.checkLoading = function () {
  this.isLogin ? (this.loading = !(this.accountLoading && this.authStateLoading)): (this.loading = false)
}



// 点击 充值 按钮
root.methods.goToRecharge = function () {
  // if (!this.isLogin) {
  //   // this.$router.push({name: 'SignPageLogin'});
  //   this.$router.push('/index/sign/login')
  //   return
  // }

  // 是否登录
  if (!this.isLogin) {
    window.location.replace(this.$store.state.domain_url + 'index/sign/login?ani=1&toUrl=c2c_url');
    return
  }
  window.location.replace(this.$store.state.domain_url + 'index/asset/rechargeAndWithdrawals?symbol=USDT');
}

// 获取用户的资产
root.methods.getAccount = function () {
  this.$http.send('ACCOUNTS', {
    query: {
      currency: 'USDT'
    }
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      this.$store.commit('SET_ACCOUNT',data.dataMap.account)
      this.accountLoading = true
      this.checkLoading()
    }).catch((err) => {
    console.log('err', err)
  });
  return
}

// 获取用户的绑定信息
root.methods.getAuthState = function () {
    this.$http.send('GET_AUTH_STATE')
      .then(({data}) => {
        // console.log(data)
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return
        this.$store.commit('SET_AUTH_STATE', data.dataMap)
        this.authStateLoading = true
        this.checkLoading()
      }).catch((err) => {
      console.log('err', err)
    });
    return
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/

export default root;
