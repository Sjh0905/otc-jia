const root = {};
root.name = "BusinessCenter"
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'BaseSimpleRadio': resolve => require(['../BaseSimpleRadio/BaseSimpleRadio.vue'], resolve),
  // 进行中
  'BusinessOrderConduct': resolve => require(['../BusinessOrderConduct/BusinessOrderConduct.vue'], resolve),
  // 已完成
  'BusinessOrderComplete': resolve => require(['../BusinessOrderComplete/BusinessOrderComplete.vue'], resolve),
  // 已撤单
  'BusinessOrderCannel': resolve => require(['../BusinessOrderCannel/BusinessOrderCannel.vue'], resolve),
  // loading
  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  // 弹框提示
  'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
  'BasePopupWindow': resolve => require(['@/components/BasePopupWindow/BasePopupWindow.vue'], resolve),
}
root.data = function () {
  return {
    // 订单页签
    order_tab: 1,
    // 部分市场挂单loading
    loading: true,

    authStatePopupType: 1, // 提示绑定状态弹窗 1为身份认证，2为谷歌或者手机认证
    authStatePopupWindow: false, // 提示绑定状态弹窗

    // 购买表单控制
    buyInputPrice: '',
    buyInputNum: '',
    buyInputMoney: '',
    buyInputMinNum: '',
    buyInputMaxNum: '',
    buyInputMethod: '',

    // 出售表单控制
    sellInputPrice: '',
    sellInputNum: '',
    sellInputMoney: '',
    sellInputMinNum: '',
    sellInputMaxNum: '',
    sellInputMethod: '',


    //数量限制
    inputMinNum:1,
    inputMaxNum:200000000,

    // 商家usdt余额
    balanceNum: 0,

    // c2c手续费
    ctcFee: 0,
    // 购买参考价
    lowestBuyPrice: 0,
    // 出售参考价
    lowestSellPrice: 0,

    // 获取部分市场挂单
    sectionPendingList: [],

    // 商户有没有支付宝
    aliPay: false,
    bankPay: false,
    bankName: '',

    buyCheckboxAliPay: false,
    buyCheckboxBankPay: false,

    sellCheckboxAliPay: false,
    sellCheckboxBankPay: false,

    submitBuyBoxFlag: false,
    submitSellBoxFlag: false,


    // ----------- 二级认证弹窗 end ----------
    popOpen: false,
    popType: 0,
    popText: '',

    // loading
    headerLoading: true,

    postBusinessBaseInfoLoading: false,

    getAccountLoading: false,

    getPartPosterOrderListLoading: true,

    // ajax
    submitBuyAjaxFlag: false,

    submitSellAjaxFlag: false,

    //---------超时弹窗开始-------
    //超时弹窗是否显示
    refreshPageFlag: false,
    //回调函数
    refreshPageFunc: () => {},

    //---------超时弹窗结束-------
    isRouterAlive:true,

    payType:1,// 银行卡 1 支付宝 2  微信 3

    accounts:[],

    feeRate:0,//手续费费率
    buyFee:0,//购买手续费
    buyActuallyArrived:0,//购买实际到账
    sellFee:0,//出售手续费
    sellActualSale:0,//实际售卖

    defaultBank:{}//默认银行卡
  }
}
root.created = function () {
  // 临时loading

  // 获取顶部信息
  // this.postBusinessBaseInfo
  this.getSystemArgs();

  this.getBankList();

  // 获取账户余额信息
  this.getAccount()

  // 获取部分市场挂单
  // this.getPartPosterOrderList()
  this.getUserAuthInfo()
}

root.computed = {}

root.computed.userId = function () {
  return this.$store.state.authState.userId
}

root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

// 用户USDT的可用余额
root.computed.USDTAvailable = function () {
  let USDTAccount = this.accounts.find(v => v.currency == "USDT") || {}
  // console.log('USDTAccount', USDTAccount)

  return USDTAccount.available || 0
}

// socket推过来的值
root.computed.result_socket = function () {
  return this.$store.state.result_socket;
}
// 认证状态-实名认证
root.computed.identity = function () {
  if(this.$store.state.authState.idType !='NONE')return true
  return false
}
// 认证状态-ga
root.computed.bindGa = function () {
  return this.$store.state.authState && this.$store.state.authState.ga
}
// 认证状态-mobile
root.computed.bindMobile = function () {
  return this.$store.state.authState && this.$store.state.authState.sms
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
root.provide = function () {
  return {
    reload: this.reload
  }
}


root.watch = {}
root.watch.buyInputNum = function (newVal, oldVal) {
  // console.log('newVal',newVal,'oldVal',oldVal);
  if(newVal == ''){
    this.buyFee = 0;
    this.buyActuallyArrived = 0
    return
  }
  if(newVal != oldVal && this.feeRate > 0 && this.buyInputNum > 0){
    this.buyFee = this.accMul(this.feeRate, this.buyInputNum)
    this.buyActuallyArrived = this.accMinus(this.buyInputNum,this.buyFee)
  }
}
root.watch.sellInputNum = function (newVal, oldVal) {
  // console.log('newVal',newVal,'oldVal',oldVal);
  if(newVal == ''){
    this.sellFee = 0;
    this.sellActualSale = 0
    return
  }
  if(newVal != oldVal && this.feeRate > 0 && this.sellInputNum > 0){
    this.sellFee = this.accMul(this.feeRate, this.sellInputNum)
    this.sellActualSale = this.accMinus(this.sellInputNum,this.sellFee)
  }
}
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
}

root.watch.result_socket = function (newValue, oldValue) {
 /* let user_id = newValue.data.userId;
  if (user_id != this.userId || newValue.key != 'createPostersOrder') return;
  console.log('watchSocket', newValue)
  if (newValue.data.result == 0) {

    //清空定时器
    clearTimeout(this.st)

    this.$eventBus.notify({
      key: 'SET_BUSINESS_ORDER_SUCCESS'
    });
    // this.getPartPosterOrderList()

    this.popOpen = true
    this.popType = 1
    this.popText = '下单成功'
    if (newValue.data.postersType === 'BUY') {
      // 关闭购买弹框
      this.submitBuyBoxFlag = false;
      this.buyInputPrice = ''
      this.buyInputNum = ''
      this.buyInputMoney = ''
      this.submitBuyAjaxFlag = false
    }
    if (newValue.data.postersType === 'SELL') {
      // 关闭出售弹框
      this.submitSellBoxFlag = false;
      this.sellInputPrice = ''
      this.sellInputNum = ''
      this.sellInputMoney = ''
      this.submitSellAjaxFlag = false
    }

    return
  }
  if (newValue.data.result != 0) {
    this.popOpen = true;
    this.popType = 0
    this.popText = newValue.data.message;
  }*/
}



root.methods = {}
root.methods.reload = function () {
  this.order_tab = '';
  this.$nextTick(function () {
    this.order_tab = 1;
  })

}

// 输入框只能输入数字，小数点只能保留后两位
root.methods.inputNumbers = function (val) {
  let value = val.replace(/[^0-9.]/g, '').replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

  if (value.toString().split(".")[1]) {
    if (value.toString().split(".")[1].length < 3) {
      return value
    } else {
      return this.toFixed(value, 2)
    }
  } else {
    return value
  }
}

root.methods.checkHeaderLoading = function () {
  this.headerLoading = !this.getAccountLoading //&& false
}

// 点击usdt充值跳转到去充值
root.methods.goToRecharge = function () {

  window.location.replace(this.$store.state.domain_url + 'index/asset/rechargeAndWithdrawals');
}

// 购买多选选择是否用支付宝
root.methods.changeBuyCheckboxAliPay = function () {
  this.buyCheckboxAliPay = !this.buyCheckboxAliPay
}
// 购买多选选择是否用银行卡
root.methods.changeBuyCheckboxBankPay = function () {
  this.buyCheckboxBankPay = !this.buyCheckboxBankPay
}
// 出售多选选择是否用支付宝
root.methods.changeSellCheckboxAliPay = function () {
  this.sellCheckboxAliPay = !this.sellCheckboxAliPay
}
// 出售多选选择是否用银行卡
root.methods.changeSellCheckboxBankPay = function () {
  this.sellCheckboxBankPay = !this.sellCheckboxBankPay
}
// 根据购买数量修改购买金额
root.methods.changeBuyInputPrice = function () {
  this.buyInputPrice = this.inputNumbers(this.buyInputPrice)
  this.buyInputNum = this.inputNumbers(this.buyInputNum)
  if (this.buyInputPrice && this.buyInputNum) {
    this.buyInputMoney = this.toFixed(this.accMul(this.buyInputPrice, this.buyInputNum), 2);
  }
}
// 根据购买金额修改购买数量
root.methods.changeBuyInputNum = function () {
  this.buyInputMoney = this.inputNumbers(this.buyInputMoney)
  if (this.buyInputPrice && this.buyInputPrice != 0 && this.buyInputMoney) {
    this.buyInputNum = this.toFixed(this.accDiv(this.buyInputMoney, this.buyInputPrice), 2);
  }
}
// 根据修改出售金额
root.methods.changeSellInputPrice = function () {
  this.sellInputPrice = this.inputNumbers(this.sellInputPrice)
  this.sellInputNum = this.inputNumbers(this.sellInputNum)
  if (this.sellInputPrice && this.sellInputNum) {
    this.sellInputMoney = this.toFixed(this.accMul(this.sellInputPrice, this.sellInputNum), 2);
  }
}
// 根据出售金额修改
root.methods.changeSellInputNum = function () {
  this.sellInputMoney = this.inputNumbers(this.sellInputMoney)
  if (this.sellInputPrice && this.sellInputPrice != 0 && this.sellInputMoney) {
    this.sellInputNum = this.toFixed(this.accDiv(this.sellInputMoney, this.sellInputPrice), 2);
  }
}
// blur商家购买的价格的input框后的验证
root.methods.blurBuyInputPrice = function (e) {
  this.BLUR(e)
  this.testBuyInputPrice()
}
// 商家购买的价格的input框后的验证
root.methods.testBuyInputPrice = function () {
  // if(this.buyInputPrice > this.accMul(this.lowestBuyPrice,1.2) || this.buyInputPrice < this.accMul(this.lowestBuyPrice,0.8)) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '价格不允许超过时价20%或低于时价20%，请重新输入正确价格'
  //   return false
  // }
  return true
}

// blur商家出售的价格的input框后的验证
root.methods.blurSellInputPrice = function (e) {
  this.BLUR(e)
  this.testSellInputPrice()
}
// 商家出售的价格的input框后的验证
root.methods.testSellInputPrice = function () {
  // if(this.sellInputPrice > this.accMul(this.lowestSellPrice,1.2) || this.InputPrice < this.accMul(this.lowestSellPrice,0.8)) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '价格不允许超过时价20%或低于时价20%，请重新输入正确价格'
  //   return false
  // }
  return true
}
// blur商家购买的数量的input框后的验证
root.methods.blurBuyInputNum = function (e) {
  this.BLUR(e)
  this.testBuyInputNum()
}
// 商家购买的数量的input框后的验证
root.methods.testBuyInputNum = function () {
  /*if (parseFloat(this.buyInputNum) > 30000) {
    this.popOpen = true
    this.popType = 0
    this.popText = '购买数量最大30000'
    return false
  }*/
  if (this.inputMinNum && parseFloat(this.buyInputNum) < parseFloat(this.inputMinNum)) {
    this.popOpen = true
    this.popType = 0
    this.popText = '购买数量不能小于' + this.inputMinNum
    return false
  }
  return true
}

// blur商家出售的数量的input框后的验证
root.methods.blurSellInputNum = function (e) {
  this.BLUR(e)
  this.testSellInputNum()
}
// 商家出售的数量的input框后的验证
root.methods.testSellInputNum = function () {
  /*if (parseFloat(this.sellInputNum) > 30000) {
    this.popOpen = true
    this.popType = 0
    this.popText = '最大30000'
    return false
  }*/
  if (this.inputMinNum && parseFloat(this.sellInputNum) < parseFloat(this.inputMinNum)) {
    this.popOpen = true
    this.popType = 0
    this.popText = '不能小于'  + this.inputMinNum
    return false
  }
  return true
}

// blur商家购买的金额的input框后验证数量
root.methods.blurBuyInputMoney = function (e) {
  this.BLUR(e)
  this.testBuyInputMoney()
}

// 商家购买的金额的input框后的验证
root.methods.testBuyInputMoney = function () {
  if (this.buyInputPrice && this.buyInputPrice != 0 && this.buyInputMoney) {
    this.buyInputNum = this.toFixed(this.accDiv(this.buyInputMoney, this.buyInputPrice), 2);
    return this.testBuyInputNum()
  }
}

// blur商家出售的金额的input框后验证数量
root.methods.blurSellInputMoney = function (e) {
  this.BLUR(e)
  this.testSellInputMoney()
}

// 商家出售的金额的input框后的验证
root.methods.testSellInputMoney = function () {
  if (this.sellInputPrice && this.sellInputPrice != 0 && this.sellInputMoney) {
    this.sellInputNum = this.toFixed(this.accDiv(this.sellInputMoney, this.sellInputPrice), 2);
    return this.testSellInputNum()
  }
}

// blur商家购买的单笔最小购买数量
root.methods.blurBuyInputMinNum = function (e) {
  this.BLUR(e)
  this.testBuyInputMinNum()
}
// 商家购买的单笔最小购买数量
root.methods.testBuyInputMinNum = function () {
  if (parseFloat(this.buyInputMinNum) < this.inputMinNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最小购买不能小于'+ this.inputMinNum
    return false
  }
  if ((this.buyInputMinNum && this.buyInputNum) && parseFloat(this.buyInputNum) < parseFloat(this.buyInputMinNum)) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最小购买不能大于挂单数量'
    return false
  }
  if ((this.buyInputMinNum && this.buyInputMaxNum) && parseFloat(this.buyInputMinNum) > this.buyInputMaxNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最小购买不能大于单笔最大购买数量'
    return false
  }
  return true
}

// blur商家购买的单笔最大购买数量
root.methods.blurBuyInputMaxNum = function (e) {
  this.BLUR(e)
  this.testBuyInputMaxNum()
}
// 商家购买的单笔最大购买数量
root.methods.testBuyInputMaxNum = function () {
  // if (parseFloat(this.buyInputMaxNum) > this.inputMaxNum) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '单笔最大购买数量为' + this.inputMaxNum
  //   return false
  // }
  if ((this.buyInputMinNum && this.buyInputMaxNum) && parseFloat(this.buyInputMinNum) > this.buyInputMaxNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最大购买不能小于单笔最小购买数量'
    return false
  }
  if ((this.buyInputMaxNum && this.buyInputNum) && parseFloat(this.buyInputNum) < parseFloat(this.buyInputMaxNum)) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最大购买不能大于挂单数量'
    return false
  }
  return true
}

// blur商家出售的单笔最小出售数量
root.methods.blurSellInputMinNum = function (e) {
  this.BLUR(e)
  this.testSellInputMinNum()
}
// 商家出售的单笔最小出售数量
root.methods.testSellInputMinNum = function () {
  if (parseFloat(this.sellInputMinNum) < this.inputMinNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最小出售不能小于' + this.inputMinNum
    return false
  }
  if ((this.sellInputMinNum && this.sellInputNum) && parseFloat(this.sellInputNum) < parseFloat(this.sellInputMinNum)) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最小出售不能大于挂单数量'
    return false
  }
  if ((this.sellInputMinNum && this.sellInputMaxNum) && parseFloat(this.sellInputMinNum) > this.sellInputMaxNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最小出售不能大于单笔最大出售数量'
    return false
  }

  return true
}

// blur商家出售的单笔最大出售数量
root.methods.blurSellInputMaxNum = function (e) {
  this.BLUR(e)
  this.testSellInputMaxNum()
}
// 商家出售的单笔最大出售数量
root.methods.testSellInputMaxNum = function () {
  // if (parseFloat(this.sellInputMaxNum) > this.inputMaxNum) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '单笔最大为' + this.inputMaxNum
  //   return false
  // }
  if ((this.sellInputMinNum && this.sellInputMaxNum) && parseFloat(this.sellInputMinNum) > this.sellInputMaxNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最大出售不能小于单笔最小出售数量'
    return false
  }
  if ((this.sellInputMaxNum && this.sellInputNum) && parseFloat(this.sellInputNum) < parseFloat(this.sellInputMaxNum)) {
    this.popOpen = true
    this.popType = 0
    this.popText = '单笔最大出售不能大于挂单数量'
    return false
  }
  return true
}

// input时检测最小购买数量
root.methods.changeBuyInputMinNum = function () {
  this.buyInputMinNum = this.inputNumbers(this.buyInputMinNum)
}

// input时检测最大购买数量
root.methods.changeBuyInputMaxNum = function () {
  this.buyInputMaxNum = this.inputNumbers(this.buyInputMaxNum)
}

// input时检测最小
root.methods.changeSellInputMinNum = function () {
  this.sellInputMinNum = this.inputNumbers(this.sellInputMinNum)
}

// input时检测最大
root.methods.changeSellInputMaxNum = function () {
  this.sellInputMaxNum = this.inputNumbers(this.sellInputMaxNum)
}



root.methods.goToBuy = function () {
  // if (!this.openAuthStatePopupWindow()) {
  //   return
  // }
  if (!this.buyInputPrice) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入购买价格'
    return
  }
  if (!this.testBuyInputPrice()) {
    return
  }
  if (!this.buyInputNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入购买数量'
    return
  }
  if (!this.testBuyInputNum()) {
    return
  }
  if (!this.buyInputMoney) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入购买金额'
    return
  }
  if (!this.testBuyInputMoney()) {
    return
  }

  if (!this.buyInputMinNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入单笔最小购买数量'
    return
  }
  if (!this.testBuyInputMinNum()) {
    return
  }
  if (!this.buyInputMaxNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入单笔最大购买数量'
    return
  }
  if (!this.testBuyInputMaxNum()) {
    return
  }
  // if (parseFloat(this.buyInputMinNum) > parseFloat(this.buyInputMaxNum)) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '单笔最小购买不能大于单笔最大购买数量'
  //   return
  // }

  // // 判断支付方式
  // let payType = '';
  // if(this.buyCheckboxAliPay && this.buyCheckboxBankPay) {
  //   payType = 'ALIPAY|BANKCARD'
  // } else if (this.buyCheckboxAliPay) {
  //   payType = 'ALIPAY'
  // } else if (this.buyCheckboxBankPay) {
  //   payType = 'BANKCARD'
  // } else {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '请选择您的支付方式'
  //   return
  // }

  // if (!this.buyCheckboxBankPay) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '请选择您的支付方式'
  //   return
  // }

  this.submitBuyBoxFlag = true;
}

root.methods.goToSell = function () {
  // if (!this.openAuthStatePopupWindow()) {
  //   return
  // }
  if (!this.sellInputPrice) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入出售价格'
    return
  }
  if (!this.testSellInputPrice()) {
    return
  }
  if (!this.sellInputNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入出售数量'
    return
  }
  if (!this.testSellInputNum()) {
    return
  }
  if (!this.sellInputMoney) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入出售金额'
    return
  }
  if (!this.testSellInputMoney()) {
    return
  }

  if (!this.sellInputMinNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入单笔最小出售数量'
    return
  }
  if (!this.testSellInputMinNum()) {
    return
  }
  if (!this.sellInputMaxNum) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请填入单笔最大出售数量'
    return
  }
  if (!this.testSellInputMaxNum()) {
    return
  }
  // if (parseFloat(this.sellInputMinNum) > parseFloat(this.sellInputMaxNum)) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '单笔最小不能大于单笔最大'
  //   return
  // }
  // // 判断支付方式
  // let payType = '';
  // if(this.sellCheckboxAliPay && this.sellCheckboxBankPay) {
  //   payType = 'ALIPAY|BANKCARD'
  // } else if (this.sellCheckboxAliPay) {
  //   payType = 'ALIPAY'
  // } else if (this.sellCheckboxBankPay) {
  //   payType = 'BANKCARD'
  // } else {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '请选择您的支付方式'
  //   return
  // }

  // if (!this.sellCheckboxBankPay) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '请选择您的支付方式'
  //   return
  // }


  this.submitSellBoxFlag = true;
}

root.methods.closeBuyBox = function () {
  this.submitBuyBoxFlag = false;
}

root.methods.closeSellBox = function () {
  this.submitSellBoxFlag = false;
}


root.methods.submitToBuy = function () {
  if (this.submitBuyAjaxFlag === true) {
    return
  }
  this.submitBuyAjaxFlag = true

  //todo:生成定时器
  // this.st = setTimeout(()=>{
  //todo:改变状态,和watch监听里边一致
  // 关闭购买弹框
  // this.submitBuyBoxFlag = false;
  // this.buyInputPrice = ''
  // this.buyInputNum = ''
  // this.buyInputMoney = ''
  // this.submitBuyAjaxFlag = false

  // console.log('进入定时器，已经超过4s，状态帮你改为',this.status,new Date());

  //回调函数
  // this.refreshPageFunc = ()=>{
  //   this.refreshPageFlag = false;
  //   this.$router.go(0)
  // };
  //显示弹窗
  // this.refreshPageFlag = true;

  // },4000)

  this.$http.send('CREATE_POSTER_ORDER', {
    params: {
      // postersType: 'BUY',
      // userId: this.userId,
      // currency: 'USDT',
      // toCurrency: 'CNY',
      // price: this.buyInputPrice,
      // total: this.buyInputNum,
      // amount: this.buyInputNum,
      // maxLimit: this.buyInputMaxNum,
      // minLimit: this.buyInputMinNum,
      // payType: payType,   // 银行卡 1 支付宝 2  微信 3

      //2020-4-26sss 修改参数
      side: 'BUY',
      currency: 'USDT',
      price: this.buyInputPrice, //单价
      amount: this.buyInputNum, //数量
      max: this.buyInputMaxNum, //最大数量
      min: this.buyInputMinNum,//最小数量
      payType: this.payType,  //支付方式

    }
  }).then(({
    data
  }) => {
    // typeof res === 'string' && (res = JSON.parse(res))
    console.log('data', data)
    typeof data === 'string' && (data = JSON.parse(data))
    if (data.result === 'FAIL' || data.code != 200) {
      this.submitBuyAjaxFlag = false

      switch (data.code) {
        case 1010://暂不支持该币种交易
          this.popOpen = true
          this.popType = 0
          this.popText = '暂不支持该币种交易'
          break;
        case 1012://挂单数量不在单笔成交数量区间
          this.popOpen = true
          this.popType = 0
          this.popText = '挂单数量不在单笔成交数量区间'
          break;
        case 1013://挂单数量小于系统限制最小数量
          this.popOpen = true
          this.popType = 0
          this.popText = '挂单数量小于系统限制最小数量'
          break;
        case 1014://挂单数量大于系统限制最大数量
          this.popOpen = true
          this.popType = 0
          this.popText = '挂单数量大于系统限制最大数量'
          break;
        case 1047://该用户不是商家
          this.popOpen = true
          this.popType = 0
          this.popText = '您不是商家'
          break;
        case 1048://请设置默认收款账号
          this.popOpen = true
          this.popType = 0
          this.popText = '请设置默认收款账号'
          break;
        case 1049://请设置默认收款账号
          this.popOpen = true
          this.popType = 0
          this.popText = '可用余额不足'
          break;
      }
      return
    }

    this.popOpen = true
    this.popType = 1
    this.popText = '下单成功'
    this.submitBuyBoxFlag = false;
    // this.submitBuyBoxFlag = false;
    this.buyInputPrice = ''
    this.buyInputNum = ''
    this.buyInputMoney = ''
    this.submitBuyAjaxFlag = false
    this.st = setTimeout(()=>{
    this.$router.go(0) },2000)
  }).catch((err) => {
    console.log('err', err)
    this.submitBuyAjaxFlag = false
    this.submitBuyBoxFlag = false;
  });
}

root.methods.submitToSell = function () {
  if (this.submitSellAjaxFlag === true) {
    return
  }
  this.submitSellAjaxFlag = true

  //todo:生成定时器
  // this.st = setTimeout(()=>{
  //todo:改变状态,和watch监听里边一致
  // 关闭出售弹框
  // this.submitSellBoxFlag = false;
  // this.sellInputPrice = ''
  // this.sellInputNum = ''
  // this.sellInputMoney = ''
  // this.submitSellAjaxFlag = false

  // console.log('进入定时器，已经超过4s，状态帮你改为',this.status,new Date());

  // 回调函数
  // this.refreshPageFunc = ()=>{
  //   this.refreshPageFlag = false;
    // this.$router.go(0)
  // };
  // 显示弹窗
  // this.refreshPageFlag = true;

  // },4000)

  this.$http.send('CREATE_POSTER_ORDER', {
    params: {
      // postersType: 'SELL',
      // userId: this.userId,
      // currency: 'USDT',
      // toCurrency: 'CNY',
      // price: this.sellInputPrice,
      // total: this.sellInputNum,
      // amount: this.sellInputNum,
      // maxLimit: this.sellInputMaxNum,
      // minLimit: this.sellInputMinNum,
      // // payType: payType,   // 银行卡 1 支付宝 2  微信 3

      side: 'SELL',
      currency: 'USDT',
      price: this.sellInputPrice, //单价
      amount: this.sellInputNum, //数量
      max: this.sellInputMaxNum, //最大数量
      min: this.sellInputMinNum,//最小数量
      payType: this.payType,  //支付方式
    }
  }).then(({
    data
  }) => {
    // console.log('dataa',data)
    typeof data === 'string' && (data = JSON.parse(data))
    if (data.result === 'FAIL' || data.code != 200) {

      this.submitSellAjaxFlag = false
      switch (data.code) {
        case 1010://暂不支持该币种交易
          this.popOpen = true
          this.popType = 0
          this.popText = '暂不支持该币种交易'
          break;
        case 1012://挂单数量不在单笔成交数量区间
          this.popOpen = true
          this.popType = 0
          this.popText = '挂单数量不在单笔成交数量区间'
          break;
        case 1013://挂单数量小于系统限制最小数量
          this.popOpen = true
          this.popType = 0
          this.popText = '挂单数量小于系统限制最小数量'
          break;
        case 1014://挂单数量大于系统限制最大数量
          this.popOpen = true
          this.popType = 0
          this.popText = '挂单数量大于系统限制最大数量'
          break;
        case 1047://该用户不是商家
          this.popOpen = true
          this.popType = 0
          this.popText = '您不是商家'
          break;
        case 1048://请设置默认收款账号
          this.popOpen = true
          this.popType = 0
          this.popText = '请设置默认收款账号'
          break;
        case 1049://请设置默认收款账号
          this.popOpen = true
          this.popType = 0
          this.popText = '可用余额不足'
          break;
      }
      return
    }

    // console.log('data', data)
    this.popOpen = true
    this.popType = 1
    this.popText = '下单成功'
    this.submitSellBoxFlag = false;
    this.sellInputPrice = ''
    this.sellInputNum = ''
    this.sellInputMoney = ''
    this.submitSellAjaxFlag = false
    this.st = setTimeout(()=>{
    this.$router.go(0) },2000)
  }).catch((err) => {
    console.log('err', err)
    this.submitSellBoxFlag = false;
    this.sellInputPrice = ''
    this.sellInputNum = ''
    this.sellInputMoney = ''
    this.submitSellAjaxFlag = false
  });
}

// 获取用户的资产
root.methods.getAccount = function () {
  this.$http.send('ACCOUNTS', {
      // query: {
      //   currency: 'USDT'
      // }
    })
    .then(({
      data
    }) => {
      typeof data === 'string' && (data = JSON.parse(data))
      console.log('accounts', data.data.accounts)

      this.$store.commit('SET_ACCOUNTS', data.data.accounts)
      this.getAccountLoading = true
      this.checkHeaderLoading()
    }).catch((err) => {
      console.log('err', err)
    });
  return
}

// 获取配置信息
root.methods.getSystemArgs = function () {
  this.$http.send('GET_SYSTEM_ARGS').then(({data}) => {
    // console.log(data.data,"获取配置信息");
    let currenciesConf1 = data.data && data.data.currenciesConf1 || {};
    let USDTCurrenciesConf1 = currenciesConf1.USDT || {};

    this.inputMinNum = USDTCurrenciesConf1.min > 0 ? USDTCurrenciesConf1.min : this.inputMinNum;
    this.inputMaxNum = USDTCurrenciesConf1.max > 0 ? USDTCurrenciesConf1.max : this.inputMaxNum;

    this.feeRate = USDTCurrenciesConf1.feeRate || 0
    // this.loading = false;
  }).catch((err) => {
    // this.popOpen = true;
    // this.popText = '请稍后重试';
  });
}

// 获取银行列表
root.methods.getBankList = function () {
  return this.$http.send('GET_BANK')
    .then(({data}) => {
      // console.log(data)
      typeof data === 'string' && (data = JSON.parse(data))
      let bankList = data.data || []
      this.defaultBank = bankList.find(v=>{
        v.hiddenBankNumber = v.bankNumber && v.bankNumber.slice(v.bankNumber.length-4 || 0)
        return v.isShow
      }) || {}
      console.log('获取银行列表', this.defaultBank)
    })
    .catch(err => {
      // console.warn('获取银行列表出错', err)
    })
}

// 获取顶部信息
/*root.methods.postBusinessBaseInfo = function () {
  this.$http.send('POST_BUSINESS_BASE_INFO', {
      params: {
        userId: this.userId,
      }
    })
    .then(({
      data
    }) => {
      typeof data === 'string' && (data = JSON.parse(data))
      console.log('baseInfo', data)
      if (data.result === 'FAIL' || data.errorCode) {
        //返回值只用到了错误码判断，以下情况需要返回申请页面
        switch (data.errorCode) {
          case 2:
            this.popOpen = true
            this.popType = 0
            this.popText = '没有该记录或者申请状态不对'
            // todo 上生产前放开
            this.$router.push({
              name: 'BusinessApplication'
            })

            // this.postBusinessBaseInfoLoading = true
            // this.checkHeaderLoading()
            break;
          case 3:
            this.popOpen = true
            this.popType = 0
            this.popText = '商户的状态不对'
            // todo
            this.$router.push({
              name: 'BusinessApplication'
            })

            // this.postBusinessBaseInfoLoading = true
            // this.checkHeaderLoading()
            break;
        }
        return
      }
      //以下变量暂时没用到，应该是和费率、挂单价格限制、支付方式有关的
      this.ctcFee = data.dataMap.ctcFee
      this.lowestBuyPrice = data.dataMap.lowestBuyPrice
      this.lowestSellPrice = data.dataMap.lowestSellPrice
      if (data.dataMap.bankName) {
        this.bankPay = true
        this.bankName = data.dataMap.bankName
        this.buyCheckboxBankPay = true
        this.sellCheckboxBankPay = true
      }
      if (data.dataMap.aliPay) {
        this.aliPay = true
        this.buyCheckboxAliPay = true
        this.sellCheckboxAliPay = true
      }
      this.postBusinessBaseInfoLoading = true
      this.checkHeaderLoading()
    }).catch((err) => {
      console.log('err', err)
    });
  return
}*/

// 获取部分挂单列表
root.methods.getPartPosterOrderList = function () {
  this.getPartPosterOrderListLoading = true
  // this.$http.send('GET_PART_POSTER_ORDER_LIST')
  //   .then(({
  //     data
  //   }) => {
  //     typeof data === 'string' && (data = JSON.parse(data))
  //     console.log(data)
  //     this.sectionPendingList = data.dataMap.posterOrderList
  //     this.getPartPosterOrderListLoading = false
  //   }).catch((err) => {
  //     console.log('err', err)
  //   });
  return
}



root.methods.SUBMIT = function () {
  console.log('sumbit: ', this.test)

}
// 切换页签
root.methods.ORDER_TAB = function (type) {
  this.order_tab = type;
  this.isRouterAlive=true
}
// 选中效果
root.methods.FOCUS = function (e) {
  let input_parent = e.target.parentNode;
  if (this.$globalFunc.HAS_CLASS(input_parent, 'buy')) {
    this.$globalFunc.ADD_CLASS(input_parent, 'buy_border');
  } else {
    this.$globalFunc.ADD_CLASS(input_parent, 'sell_border');
  }
}
// 取消选中效果
root.methods.BLUR = function (e) {
  let input_parent = e.target.parentNode;
  if (this.$globalFunc.HAS_CLASS(input_parent, 'buy')) {
    this.$globalFunc.REMOVE_CLASS(input_parent, 'buy_border');
  } else {
    this.$globalFunc.REMOVE_CLASS(input_parent, 'sell_border');
  }
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/**---------认证弹窗部分-----*/
// 清空认证状态弹窗
// root.methods.clearAuthStatePopupWindow = function () {
//   this.authStatePopupType = 1
// }

// 打开认证状态弹窗
root.methods.openAuthStatePopupWindow = function () {
  console.log(this.identity, "实名认证")
  if (!this.identity) {
    this.authStatePopupType = 1
    this.authStatePopupWindow = true
    return false
  }
  if (!this.bindGa && !this.bindMobile) {
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
  if (this.isMobile) {
    window.location.replace(this.$store.state.download_app);
  } else {
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
root.methods.getUserAuthInfo = function () {
  // if (this.$store.state.authState) {
  //   // this.authStateReady = true
  //   // if (this.bindMobile) {
  //   //   this.picked = 'bindMobile'
  //   // }
  //   // if (this.bindGa) {
  //   //   this.picked = 'bindGA'
  //   // }
  //   return
  // }
  this.$http.send('GET_USER_AUTH_INFO')
    .then(({
      data
    }) => {
      // console.log(data,'手机认证状态')
      typeof data === 'string' && (data = JSON.parse(data))
      if (!data) return
      this.$store.commit('SET_AUTH_STATE', data.data)

      let auth_info = data.data;
      // -1 未申请，0 审核中，1 驳回，2 普通商家
      if (auth_info.audits != 2) {
        this.popOpen = true
        this.popType = 0
        this.popText = '商户状态不对'

        this.$router.push({name: 'BusinessCenter'});
      }

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

root.methods.closeRateTips= function (type) {
  $(".fee-tips-box-"+type).attr("style","display:none");
}

root.methods.openRateTips = function (type) {
  $(".fee-tips-box-"+type).attr("style","display:block");
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
