const root = {};
root.name = "TransactionBuy";
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'BasePageBar': resolve => require(['@/components/BasePageBar/BasePageBar.vue'], resolve),
  'BasePopupWindow': resolve => require(['@/components/BasePopupWindow/BasePopupWindow.vue'], resolve),
  // loading
  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
}
root.data = function () {
  return {
    // loading
    loading: true,

    // 当前页币种
    currency: 'USDT',
    // 分页
    maxPage: 1,
    selectIndex: 1,

    // 获取本页页面数据
    offset: 0,
    maxResults: 3,

    // 页面数据显示
    pendingList: [],

    // 第一次点买入时候的输入
    inputNum: '',
    aInputNum: '',
    inputCNY: '',
    // 判断点入名字
    aKeyUserName: false,
    // ----------- 弹框信息 start ----------
    // 是否弹框
    popWindowOpen: false,
    // 弹框标题
    popWindowTitle: 'title',
    // 弹框内容
    popWindowContent: ['文字1', '文字2'],
    // 弹框按钮文字
    popWindowBtnText: 'btn',
    // 弹框内容是否居中
    popWindowContentCenter: false,
    // 弹框内容整体居中
    popWindowContentAllCenter: false,
    // 弹框点击btn方法
    // popWindowClickBtn
    // 弹框点击右上角叉号
    // popWindowGoAhead


    // ----------- 弹框信息 end ----------

    // ----------- 弹框买入信息 start ----------

    buyToastOpen: false,

    buyItem: '',


    buyCommitToastOpen: false,

    // ----------- 弹框买入信息 end ----------

    // ----------- 二级认证弹窗 start ----------
    // 二级认证弹窗
    verificationToastOpen: false,

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

    // ----------- 二级认证弹窗 end ----------

    popOpen: false,
    popType: 0,
    popText: '',

    // 如果用户被禁止交易的错误提示
    userCanNotTradeInfo: '',

    // 请求pageList接口
    pageListAjaxLoading: false,

    // 请求用户是否不符合交易须知要求接口
    getUserCanTradeLoading: false,

    // 点击确认下单时
    submitBtnAjaxFlag: false,

    //---------超时弹窗开始-------
    //超时弹窗是否显示
    refreshPageFlag: false,
    //回调函数
    refreshPageFunc: () => {},

    //---------超时弹窗结束-------

    //-----------自定义购买金额
    input2: '',
    isStatus:'',
    isSocket:true,
    options: [{
      value: '选项1',
      label: '按金额购买'
    }, {
      value: '选项2',
      label: '按数量购买'
    },
    ],
    value: '选项1',
    isBuyItem: false,
    // 显示银行卡信息
    pay_info:'',

    accounts:[]//账户余额
  }
};
root.created = function () {

  // this.setPopWindowContentForVerification()
  // this.popWindowOpen = true

  this.getAuthState()
  // 获取用户是否不符合交易须知要求
  this.getUserCanTrade()
  // 获取本页的列表
  this.getPageList()

  // console.log(this.pendingList,'测试')
}


root.computed = {}



// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

// 判断是否有商家挂单
// root.computed.isBusiness = function () {
//   if(this.pendingList.length<1){
//     return false
//   }else{
//     return true
//   }
// }
// 判断是否登录
root.computed.isLogin = function () {
  return this.$store.state.isLogin;
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
	return this.$store.state.authState.userId;
}

root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

// 用户USDT的可用余额
root.computed.USDTAvailable = function () {
  let USDTAccount = this.$store.state.currency.get("USDT") || {}
  return USDTAccount.available || 0
}

// 判断用户是否实名认证
root.computed.identityVerification = function () {
  return this.$store.state.authState.identity
}

// 判断用户是否绑定手机号
root.computed.bindSms = function () {
  return this.$store.state.authState.sms
}

// 判断用户是否绑定邮箱
root.computed.bindMail = function () {
  return this.$store.state.authState.mail
}

//判断用户是否绑定谷歌
root.computed.bindChrome = function () {
  return this.$store.state.authState.ga
}

// 判断用户是否绑定银行卡
root.computed.bindBankCard = function () {
  return this.$store.state.authState.method
}

// socket推过来的值
root.computed.result_socket = function () {
  return this.$store.state.result_socket;
}

root.watch = {}
// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
  // console.log('this.USDTAvailable-=-=-=-=-=-=-=-=-=',this.USDTAvailable);
}
root.watch.result_socket = function (newValue, oldValue) {
  let user_id = newValue.data.userId;
  let operation = newValue.data.operation;
  if (user_id != this.userId || newValue.key != 'c2corder' || !operation) return;
  if (newValue.data.result === 0) {

    //清空定时器
    clearTimeout(this.st)

    this.popOpen = true
    this.popType = 1
    this.popText = '下单成功'
    this.buyCommitToastOpen = false
    this.submitBtnAjaxFlag = false
    this.isSocket=false
    this.$router.push({
      name: 'OrderDetails',
      query: {
        type: 1,
        orderId: newValue.data.orderId,
        orderType: 'BUY'
      }
    })
    return
  }
  if (newValue.data.result != 0) {
    this.popOpen = true;
    this.popType = 0
    this.popText = newValue.data.message;
  }
}



root.methods = {}

// 获取订单详情
root.methods.GET_ORDER_DETAIL = function () {

  let str =this.buyItem.payId? this.buyItem.payId:this.buyItem.payIds
  console.log(str)
  let a = str.split(',')
  let byId = a[0]
  // console.log(byId)
  // this.pay_info={"dataMap":{"payinfo":{"bankAddr":"开发区支行","bankId":2,"bankName":"中国银行","bankStyle":"3","cardNumber":"7089090909090909","createdAt":1570780070814,"id":125,"infoLife":"INUSE","isDefault":1,"mark":"备注","status":1,"type":"BANKCARD","updatedAt":1570780070814,"userId":333359,"username":"测试一号","version":0}},"errorCode":0,"result":"SUCCESS"}

  this.$http.send('GET_DASH_BUTTON', {
		query: {
			// userId: this.userId,
			// c2cOrderType: "BUY",
      //获取订单色ID就行
			payId: byId,
		}
	}).then(({data}) => {
    console.log('hahahahah000000000',data)
    this.pay_info= data

	}).catch((err) => {

	});
}




root.methods.checkLoading = function () {
  if (this.isLogin) {
    this.loading = !(this.pageListAjaxLoading && this.getUserCanTradeLoading)
    return
  }
  this.loading = !this.pageListAjaxLoading
}

// 输入框只能输入数字，小数点只能保留后两位
root.methods.inputNumbers = function (val) {
  let value = val.replace(/[^0-9.]/g, '').replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

  if (value.toString().split(".")[1]) {
    if (value.toString().split(".")[1].length < 7) {
      return value
    } else {
      return this.toFixed(value, 6)
    }
  } else {
    return value
  }
}


// 获取用户的购买权限
root.methods.getUserCanTrade = function () {
  this.$http.send('VALIDATE_USER_CAN_TRADE')
    .then(({
      data
    }) => {
      typeof data === 'string' && (data = JSON.parse(data))
      if (data.errorCode) {
        this.getUserCanTradeLoading = true
        this.checkLoading()
        switch (data.errorCode) {
          case 0:
            this.userCanNotTradeInfo = ''
            break;
          case 1:
            this.userCanNotTradeInfo = '未登录'
            // window.location.reload();
            break;
          case 8:
            this.userCanNotTradeInfo = '有一个订单未完成，暂停继续下单，完成后恢复'
            break;
          case 9:
            this.userCanNotTradeInfo = '24H内超过3笔取消订单'
            break;
        }
        return
      }
      this.getUserCanTradeLoading = true
      this.checkLoading()
    }).catch((err) => {
      console.log('err', err)
    });
  return
}


// 获取用户的绑定信息
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE')
      .then(({
        data
      }) => {
        typeof data === 'string' && (data = JSON.parse(data))
        if (!data) return

        this.$store.commit('SET_AUTH_STATE', data.data)
      }).catch((err) => {
        console.log('err', err)
      });
    return
  }
}

// 获取用户的资产 请求结束后，重新请求一下
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
      this.$store.commit('SET_ACCOUNTS', data.data.accounts)
    }).catch((err) => {
      console.log('err', err)
    });
  return
}


// 请求页面数据
root.methods.getPageList = function () {
  this.pageListAjaxLoading = false
  this.loading = true
  this.$http.send('GET_LIST_OF_LISTS', {
    query: {
      offset: this.offset,
      maxResults: this.maxResults,
      side: 'SELL',
      currency: this.currency,
    }
  }).then(({
    data
  }) => {
    // console.log('data',data)
    // this.loading = false
    this.pageListAjaxLoading = true
    this.checkLoading()
    this.pendingList = data.data
    // this.maxPage = Math.ceil(this.accDiv(data.data, this.maxResults))
    this.maxPage = this.maxResults
    console.info('this.maxPage=========ooooo',this.maxPage)

  }).catch((err) => {
    console.log('err', err)
  });
}

// 一键购买 (待定)
root.methods.aKeyToBuy = function (item) {
  // this.pageListAjaxLoading = false
  // this.loading = true
  // console.log('aaaaa')
  // if(this.inputNum<100){
  //   return
  // }
  return this.$http.send('POST_DASH_BUTTON', {
    params: {
      // type:"price",
      // paras:30,
      // type:"amount",
      // paras:9999,
      type: this.value == '选项1' ? "price" : "amount",
      paras: this.value == '选项1' ? (this.inputCNY < 1 ? 1 : this.inputCNY) : (this.inputNum < 10 ? 10 : this.inputNum),
    }
  }).then(({
    data
  }) => {
    console.log(data,'aaa')
    // this.loading = false
    // this.pageListAjaxLoading = true
    // this.checkLoading()
    // this.pendingList = data.dataMap.orders
    // this.maxPage = Math.ceil(this.accDiv(data.dataMap.totalPage,this.maxResults))
    // console.log(data)
    this.isStatus=data.status
    this.buyItem = data.orderId
    this.aKeyUserName = true;
    this.isBuyItem = true;
    // console.log('ccc',this.buyItem)
    // if(this.inputCNY!=0){
    //   this.inputCNY = this.inputNumbers(this.inputCNY)
    // this.inputNum = this.toFixed(this.accDiv(this.inputCNY,this.buyItem.price),0)}
    this.GET_ORDER_DETAIL()
  }).catch((err) => {
    console.log('err', err)
  });
}


// 弹框时候，输入框绑定另一个值的改变
root.methods.abindInputNum = async function () {
  if (!this.inputNum) {
    this.inputCNY = '';
    return
  }
  await this.aKeyToBuy().then(data => {
    if (!this.isBuyItem) {
      return
    }
    this.inputNum = this.inputNumbers(this.inputNum)

    if (this.buyItem.fixedPrice === 0) {
      return
    }

    this.inputCNY = this.toFixed(this.accMul(this.inputNum, this.buyItem.fixedPrice), 2)

  })


}
root.methods.abindInputCNY = async function () {
  if (!this.inputCNY) {
    this.inputNum = '';
    return
  }
  await this.aKeyToBuy().then(data => {
    if (!this.isBuyItem) {
      return
    }
    this.inputCNY = this.inputNumbers(this.inputCNY)
    if (this.buyItem.fixedPrice === 0) {
      return
    }
    // console.log(this.buyItem, 'aaa')
    this.inputNum = this.toFixed(this.accDiv(this.inputCNY, this.buyItem.fixedPrice), 0)
    // console.log(this.inputNum, 'bbb')
  })

}

// 弹框时候，输入框绑定另一个值的改变
root.methods.bindInputNum = async function () {
  if (!this.inputNum) {
    this.inputCNY = '';
    return
  }
  this.inputNum = this.inputNumbers(this.inputNum)
  this.inputCNY = this.toFixed(this.accMul(this.inputNum, this.buyItem.fixedPrice), 2)
}

root.methods.bindInputCNY = async function () {
  if (!this.inputCNY) {
    this.inputNum = '';
    return
  }
  this.inputCNY = this.inputNumbers(this.inputCNY)
  if (this.buyItem.fixedPrice === 0) {
    return
  }
  this.inputNum = this.toFixed(this.accDiv(this.inputCNY, this.buyItem.fixedPrice), 6)
}

// 点击买入按钮
root.methods.clickToBuy = function (item) {
  // console.log(item)
  this.buyItem = '';
  this.inputNum = '';
  this.inputCNY = '';


  // 是否登录
  // if (!this.isLogin) {
  //   this.$router.push({
  //     name: 'SignPageLogin'
  //   });
  //   return
  // }


  //sss屏蔽
  // // 是否登录
  // if (!this.isLogin) {
  //   window.location.replace(this.$store.state.domain_url + 'index/sign/login?ani=1&toUrl=c2c_url');
  //   return
  // }
  // // 没有身份认证 并 没有绑定手机或没有绑定邮箱 并 没有绑定银行卡
  // if ((!this.identityVerification) && (!((this.bindChrome || this.bindSms) && this.bindMail)) && (!this.bindBankCard)) {
  //   this.setPopWindowContentForJoin()
  //   this.popWindowOpen = true
  //   return
  // }
  //
  // // 没有身份认证
  // if (!this.identityVerification) {
  //   this.setPopWindowContentForVerification()
  //   this.popWindowOpen = true
  //   return
  // }
  // // 没有绑定手机或者谷歌
  // if (!this.bindSms && !this.bindChrome) {
  //   this.setPopWindowContentForBindMobile()
  //   this.popWindowOpen = true
  //   return
  // }
  // // 没有绑定邮箱
  // if (!this.bindMail) {
  //   this.setPopWindowContentForBindMail()
  //   this.popWindowOpen = true
  //   return
  // }
  // // 没有绑定银行卡
  // if (!this.bindBankCard) {
  //   this.setPopWindowContentForBindBankCard()
  //   this.popWindowOpen = true
  //   return
  // }

  //sss屏蔽结束
  if (this.userCanNotTradeInfo) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.userCanNotTradeInfo
  }


  this.buyToastOpen = true;
  this.buyItem = item
  console.log('小',item)
  this.GET_ORDER_DETAIL()
}

// 点击买入按钮
root.methods.clickToConfirmBuy = function () {
  // console.log(this.buyItem)

  //sss屏蔽
  // // 是否登录
  // if (!this.isLogin) {
  //   // this.$router.push({
  //   //   name: '/sign/login'
  //   // });
  //   window.location.replace(this.$store.state.domain_url + 'index/sign/login?ani=1&toUrl=c2c_url');
  //   return
  // }
  // // 没有身份认证 并 没有绑定手机或没有绑定邮箱 并 没有绑定银行卡
  // if ((!this.identityVerification) && (!((this.bindChrome || this.bindSms) && this.bindMail)) && (!this.bindBankCard)) {
  //   this.setPopWindowContentForJoin()
  //   this.popWindowOpen = true
  //   return
  // }
  //
  // // 没有身份认证
  // if (!this.identityVerification) {
  //   this.setPopWindowContentForVerification()
  //   this.popWindowOpen = true
  //   return
  // }
  // // 没有绑定手机或者谷歌
  // if (!this.bindSms && !this.bindChrome) {
  //   this.setPopWindowContentForBindMobile()
  //   this.popWindowOpen = true
  //   return
  // }
  // // 没有绑定邮箱
  // if (!this.bindMail) {
  //   this.setPopWindowContentForBindMail()
  //   this.popWindowOpen = true
  //   return
  // }
  // // 没有绑定银行卡
  // if (!this.bindBankCard) {
  //   this.setPopWindowContentForBindBankCard()
  //   this.popWindowOpen = true
  //   return
  // }

  //sss屏蔽结束
  if(this.inputNum==''&&this.value=='选项2'){
    this.popOpen = true
    this.popType = 0
    this.popText = '请输入购买数量'
    return
  }
  if(this.inputCNY ==''&&this.value=='选项1'){
    this.popOpen = true
    this.popType = 0
    this.popText = '请输入购买金额'
    return
  }
  if (this.userCanNotTradeInfo) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.userCanNotTradeInfo
  }
  if (this.inputCNY * 1 < this.buyItem.minAmount * 1 * this.buyItem.fixedPrice) {
    this.popOpen = true
    this.popType = 0
    this.popText = '不足最小下单金额' + this.buyItem.minAmount * this.buyItem.fixedPrice

    return
  }
  // console.log(this.isStatus,'cc')
  if(this.isStatus=="PART"){
    this.popOpen = true
    this.popType = 0
    this.popText = '下单数量超出商家最大挂单数量'
    return
  }
  if (this.inputCNY * 1 > this.buyItem.maxAmount * 1 * this.buyItem.fixedPrice) {
    this.popOpen = true
    this.popType = 0
    this.popText = '超出最大下单金额' + this.buyItem.maxAmount * this.buyItem.fixedPrice
    return
  }

  if (this.inputNum * 1 > this.buyItem.amount * 1) {
    this.popOpen = true
    this.popType = 0
    this.popText = '下单数量超过可购买数量'
    return
  }

  this.buyToastOpen = false;
  this.buyCommitToastOpen = true;
  this.aKeyUserName = false
}

// 关闭买卖弹框
root.methods.closeBuyBox = function () {
  this.buyToastOpen = false;
  this.initInputBox();
}

// 关闭确认下单弹框
root.methods.closeBuyComfirmBox = function () {
  this.buyCommitToastOpen = false
  this.initInputBox();
}

// 点击确认下单按钮
root.methods.clickConfirmBtn = function () {
  if (this.submitBtnAjaxFlag === true) {
    return
  }

  this.submitBtnAjaxFlag = true;

  //todo:生成定时器
  this.st = setTimeout(() => {
    //改变状态,和watch监听里边一致
    // this.status = false
    this.buyCommitToastOpen = false
    this.submitBtnAjaxFlag = false;

    console.log('进入定时器，已经超过4s，状态帮你改为', this.submitBtnAjaxFlag, new Date());

    //回调函数
    this.refreshPageFunc = () => {
      this.refreshPageFlag = false;
      this.$router.go(0)
    };
    //显示弹窗
    this.refreshPageFlag = true;

  }, 4000)

  this.$http.send('PLACE_AN_ORDER', {
    params: {
      id: this.buyItem.id,
      amount: this.inputNum,
      cny: this.inputCNY,
    }
  }).then(({
    data
  }) => {
    console.log(data, "aaa啊啊")
    if (data.code) {
      this.submitBtnAjaxFlag = false;


      if (data.code == 200) {
        this.buyCommitToastOpen = false
        this.popOpen = true
        this.popType = 1
        this.popText = '已提交'
        setTimeout(()=>{
          if(this.isSocket){
            // this.$router.push({
            // name: 'OrderDetails',
            // query: {
            //     type: 1,
            //     orderId:this.buyItem.id,
            //     orderType: 'BUY'}})}
            this.$router.push({
              name:'Order',
            })}
        },3000)
        return;
      }

      switch (data.code) {
        case 1:
          window.location.reload();
          break;
        case 2:
          this.popOpen = true
          this.popType = 0
          this.popText = '24H内超过3笔取消订单将禁止1天OTC交易'
          break;
        case 3:
          this.popOpen = true
          this.popType = 0
          this.popText = '无此订单'
          break;
        case 4:
          this.popOpen = true
          this.popType = 0
          this.popText = '不在限额内'
          break;
        case 5:
          this.popOpen = true
          this.popType = 0
          this.popText = '账户余额不足'
          break;
        case 6:
          this.popOpen = true
          this.popType = 0
          this.popText = '购买数量超过上限'
          break;
        case 1050:
          this.popOpen = true
          this.popType = 0
          this.popText = '有一个订单未完成，暂停继续下单，完成后恢复'
          break;
        case 1053:
          this.popOpen = true
          this.popType = 0
          this.popText = '余额不足'
          break;
        case 9:
          this.popOpen = true
          this.popType = 0
          this.popText = '24H内超过3笔取消订单将禁止1天OTC交易'
          break;
        case 1052:
          this.popOpen = true
          this.popType = 0
          this.popText = '您不能购买自己的挂单'
          break;
        case 1020:
          this.popOpen = true
          this.popType = 0
          this.popText = '购买数量大于商家剩余数量'
          break;
        case 15:
          this.popOpen = true
          this.popType = 0
          this.popText = '您没有绑定手机或者谷歌'
          break;
        case 12:
          this.popOpen = true
          this.popType = 0
          this.popText = '您没有实名认证'
          break;
        case 13:
          this.popOpen = true
          this.popType = 0
          this.popText = '您没有绑定银行卡'
          break;
        case 110:
          this.popOpen = true
          this.popType = 0
          this.popText = '用户被禁用'
          break;
        case 1017:
          this.popOpen = true
          this.popType = 0
          this.popText = '由于广告被广告方修改,该广告已失效,请刷新重试'
          break;
        default:
          this.popOpen = true
          this.popType = 0
          this.popText = '其余错误'
      }
      return
    }


  }).catch((err) => {
    this.submitBtnAjaxFlag = false
    this.buyCommitToastOpen = false
    console.log('测试', err)
  });
}

// 初始化inputBox

root.methods.initInputBox = function () {
  this.buyItem = '';
  this.inputNum = '';
  this.inputCNY = '';
}


// 弹框右上角点击叉号
root.methods.popWindowGoAhead = function () {
  this.popWindowOpen = false;
}
// 弹框中间的按钮
root.methods.clickToastBtn = function () {

}



// 设置弹窗样式 --- 参与OTC交易需要满足以下条件
root.methods.setPopWindowContentForJoin = function () {
// <<<<<<< HEAD
//   this.popWindowTitle = '参与C2C交易需要满足以下条件：';
//   this.popWindowContent = ['1、注册二零二零，并完成实名认证', '2、绑定您本人手机号或谷歌', '3、至少绑定一张本人银行卡'];
// =======
  this.popWindowTitle = '参与OTC交易需要满足以下条件：';
  this.popWindowContent = ['1、注册二零二零，并完成实名认证', '2、绑定您本人手机号或谷歌', '3、至少绑定一张本人银行卡'];
// >>>>>>> 2e1f9a079c7bcdeb6ea8f876f91c91f9f2073ae6
  this.popWindowBtnText = '去设置';
  this.popWindowContentCenter = false;
  this.popWindowContentAllCenter = true;
  this.clickToastBtn = this.popWindowClickBtnForJoin
  this.popWindowGoAhead = this.popWindowCloseForJoin

}

// 设置点击弹窗按钮方法 --- 参与OTC交易需要满足以下条件
root.methods.popWindowClickBtnForJoin = function () {
  window.location.replace(this.$store.state.domain_url + 'index/personal/auth/authentication');
}
// 设置点击弹窗关闭按钮方法 --- 参与OTC交易需要满足以下条件
root.methods.popWindowCloseForJoin = function () {
  this.popWindowOpen = false
}

// 设置弹窗样式 --- 参与OTC交易需要实名认证
root.methods.setPopWindowContentForVerification = function () {
  this.popWindowTitle = '身份认证';
  this.popWindowContent = ['法币交易前请先进行身份认证并绑定本人手机号才能够进行交易，您尚未完成实名认证，不能进行法币交易，请先完成实名认证。'];
  this.popWindowBtnText = this.isMobile && '去app认证' || '立即认证';
  this.popWindowContentCenter = true;
  this.popWindowContentAllCenter = false;
  this.clickToastBtn = this.popWindowClickBtnForVerification
  this.popWindowGoAhead = this.popWindowCloseForVerification

}

// 设置点击弹窗按钮方法 --- 参与OTC交易需要实名认证
root.methods.popWindowClickBtnForVerification = function () {
  if (this.isMobile) {
    window.location.replace(this.$store.state.download_app);
  } else {
    window.location.replace(this.$store.state.domain_url + 'index/personal/auth/authenticate');
  }
}
// 设置点击弹窗关闭按钮方法 --- 参与OTC交易需要实名认证
root.methods.popWindowCloseForVerification = function () {
  this.popWindowOpen = false
}

// 设置弹窗样式 --- 参与OTC交易需要绑定手机号
root.methods.setPopWindowContentForBindMobile = function () {
  this.popWindowTitle = '安全认证';
  this.popWindowContent = ['法币交易前请先进行手机认证或者谷歌认证。'];
  this.popWindowBtnText = '去认证';
  this.popWindowContentCenter = true;
  this.popWindowContentAllCenter = false;
  this.clickToastBtn = this.popWindowClickBtnForBindMobile
  this.popWindowGoAhead = this.popWindowCloseForBindMobile

}

// 设置点击弹窗按钮方法 --- 参与OTC交易需要绑定手机号
root.methods.popWindowClickBtnForBindMobile = function () {
  window.location.replace(this.$store.state.domain_url + 'index/personal/securityCenter/bindMobile');
}
// 设置点击弹窗关闭按钮方法 --- 参与OTC交易需要绑定手机号
root.methods.popWindowCloseForBindMobile = function () {
  this.popWindowOpen = false
}

// 设置弹窗样式 --- 参与OTC交易需要绑定邮箱
root.methods.setPopWindowContentForBindMail = function () {
  this.popWindowTitle = 'OTC交易需要完成实名认证并绑定本人邮箱才能进行交易';
  this.popWindowContent = ['您尚未绑定您本人邮箱，不能进行OTC交易操作，请先绑定本人邮箱。'];
  this.popWindowBtnText = '绑定邮箱';
  this.popWindowContentCenter = true;
  this.popWindowContentAllCenter = false;
  this.clickToastBtn = this.popWindowClickBtnForBindMail
  this.popWindowGoAhead = this.popWindowCloseForBindMail

}

// 设置点击弹窗按钮方法 --- 参与OTC交易需要绑定手机号
root.methods.popWindowClickBtnForBindMail = function () {
  window.location.replace(this.$store.state.domain_url + 'index/personal/securityCenter/bindEmail');
}
// 设置点击弹窗关闭按钮方法 --- 参与OTC交易需要绑定手机号
root.methods.popWindowCloseForBindMail = function () {
  this.popWindowOpen = false
}

// 设置弹窗样式 --- 参与OTC交易需要绑定银行卡
root.methods.setPopWindowContentForBindBankCard = function () {
  this.popWindowTitle = '绑定银行卡';
  this.popWindowContent = ['您还没有绑定银行卡，不能进行OTC交易，请先绑定一张银行卡，至少绑定一张本人银行卡。'];
  this.popWindowBtnText = '去绑定';
  this.popWindowContentCenter = false;
  this.popWindowContentAllCenter = false;
  this.clickToastBtn = this.popWindowClickBtnForBindBankCard
  this.popWindowGoAhead = this.popWindowCloseForBindBankCard

}

// 设置点击弹窗按钮方法 --- 参与OTC交易需要绑定银行卡
root.methods.popWindowClickBtnForBindBankCard = function () {
  this.$router.push({
    name: 'PaymentSet'
  })
}
// 设置点击弹窗关闭按钮方法 --- 参与OTC交易需要绑定银行卡
root.methods.popWindowCloseForBindBankCard = function () {
  this.popWindowOpen = false
}


// 切换页码
root.methods.clickChangePage = function (page) {
  if (this.pageListAjaxLoading === false) {
    return
  }
  this.selectIndex = page;
  this.offset = (page - 1) * this.maxResults
  if (this.offset < 0) {
    this.offset = 0
  }
  // this.loading = true
  this.getPageList()
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
