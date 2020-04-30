import id from "element-ui/src/locale/lang/id";

const root = {}
root.name = 'PaymentSet'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Toggle': resolve => require(['../BaseToggle/BaseToggle.vue'], resolve),
  'Radio': resolve => require(['../BaseSimpleRadio/BaseSimpleRadio.vue'], resolve),
  'PopupWindow': resolve => require(['../BasePopupWindow/BasePopupWindow.vue'], resolve),
  'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    initReady: false, // 初始化成功
    authStateReady: false, // 获取状态成功

    authStatePopupWindow: false, // 提示绑定状态弹窗
    authStatePopupType: 1,// 提示绑定状态弹窗 1为身份认证，2为谷歌或者手机认证

    aLiPayEmpty: true,
    aLiPayInfo: null,// 支付宝绑定信息
    // bankList: [],
    defaultList: [], //已添加银行卡列表
    bankSelectList: [], // 下拉银行列表
    bankSelectListReady: false, // 下拉银行列表ready


    // 是否开启支付宝
    aLiPayToggle: false,
    aLiPayToggleIng: false,
    // 是否开启银行支付
    bankPayToggle: false,
    bankPayToggleIng: false,

    // 绑定支付宝
    bindALiPayPopupWindowOpen: false,
    bindALiPayPopupWindowStep: 1, // 第一步 1 输入 第二步 2 确认

    aLiPayName: '', // 支付宝姓名
    aLiPayNameWrong: '', // 支付宝姓名有误
    aLiPayAccount: '', // 支付宝账号
    aLiPayAccountWrong: '', // 支付宝账号有误
    aLiPayCodeImg: '', // 支付宝收款码
    aLiPayCodeImgWrong: '', // 支付宝收款码有误
    aLiPayCodeImgType: '',//支付宝收款码类型
    aLiPayPrompt: '', // 支付宝备注
    aLiPayPromptWrong: '', // 支付宝备注有误
    echoImgResult: null, // 支付照片回显
    maxImgSize: 2048, // 最大图片支持
    aLiPayBinding: false, // 绑定中 or 修改中
    aLiPayCodeId: '', // 支付宝id
    aLiPayType: 0, // 绑定或修改 0为绑定 1为修改


    confirmDeleteALiPay: false, // 确认删除支付宝
    deleteALiPayIng: false, // 正在删除支付宝
    deleteALiPayName: '', // 删除的支付宝账号
    deleteALiPayId: '', // 删除的支付宝id
    deleteALiPayAccount: '', // 删除的支付宝账号名

    // 绑定银行卡
    bindBankPopupWindowOpen: false,
    bindBankPopupWindowStep: 1, // 第一步 1 输入 第二步 2 确认

    // bankAccount: '', // 银行卡账户名
    bankAccountWrong: '', // 银行卡账户名错误
    bankName: '', // 银行卡开户行
    bankNameWrong: '', // 银行卡开户行错误
    bankCardId: '', // 银行卡id
    bankBranchName: '', // 银行卡开户支行
    bankBranchNameWrong: '', // 银行卡开户支行错误
    bankCard: '', // 银行卡号
    bankCardWrong: '', // 银行卡号错误
    bankDefault: false, // 是否默认
    bankDefaultWrong: '', // 是否默认错误
    bankMark: '', // 默认信息
    bankMarkWrong: '', // 默认信息错误
    bankPayBinding: false, // 正在绑定中
    bankId: '', // 修改的id
    bankType: 0, // 绑定或修改 0为绑定 1为修改


    confirmDeleteBank: false, // 确认删除银行卡
    deleteBankIng: false, // 正在删除银行卡
    deleteBankName: '', // 删除的银行
    deleteBankCard: '', // 删除的银行卡号
    deleteBankId: '', // 删除的银行卡id
    deleteBankAccount: '', // 删除的银行卡账号名

    modifyDefaultBankId: 0, // 修改默认的银行卡

    // 显示提示
    popOpen: false,
    popText: '',
    popType: 1,
    waitTime: 2800,

    // 二次验证
    secondVerifyOpen: false,
    emailCode: '', // 邮箱验证码
    verificationCode: '', // 手机验证码
    verificationCodeWA: '', // 手机验证码出错
    GACode: '', // 谷歌验证码
    GACodeWA: '',// 谷歌验证码错误
    verifyStep: 1, // 二次验证的步骤，1为第一步，2为第二步
    getVerificationCode: false, // 点击手机验证码
    getVerificationCodeCountdown: 60, // 手机验证码倒计时
    getVerifyCountdownInterval: null, // 手机验证码倒计时计时器
    picked: '', // 选择方式
    sending: false, // 点击确定
    verifyType: 1, // 验证方式 1 2 3 4 1为绑定支付宝 2为修改支付宝 3为绑定银行卡 4为修改银行卡
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 初始化
  this.initData()
  // 获取认证状态
  this.getAuthState()

  // console.log(this.selectedBankName,'hahhahaahh')
  // console.log(this.bankSelectList)
  // console.log(this.selectBankName)
  this.getBankList()
  // console.log(this.bankSelectList)
}
root.mounted = function () {

}
root.beforeDestroy = function () {
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}


// 获取用户名
root.computed.bankAccount = function () {
  return this.$store.state.authState.name
}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// // 银行卡列表行数
// root.computed.bankRow = function () {
//   return Math.ceil(this.removeDefaultBankCardList.length / 3)
// }
// 支付宝备注长度
root.computed.aLiPayPromptLength = function () {
  return this.aLiPayPrompt.length
}
// 银行备注长度
root.computed.bankPromptLength = function () {
  return this.bankMark.length
}
// 语言
root.computed.lang = function () {
  return 'CH'
}
// 选择银行名称的依据（中英文）
root.computed.selectBankName = function () {
  return this.lang === 'CH' ? 'cnName' : 'enName'
}
// 选择的银行名称
root.computed.selectedBankName = function () {
  return this.bankName && this.bankName[this.selectBankName] || ''
}
// 选择的银行id
root.computed.selectedBankId = function () {
  return this.bankName && this.bankName.id || ''
}
// 去除默认银行卡的银行卡列表 （不是默认的）
root.computed.removeDefaultBankCardList = function () {
  let newArr = this.bankList.slice(0).filter(v => {
    return v.isShow === true
  })
  console.info('newArr=====',newArr)
  return newArr
  // return [
  //   // {
  //   //   bankStyle:2,
  //   //   bankICO:'',
  //   //   bankNameCN:'中国工商银行',
  //   //   bankNameEN:'ICBC',
  //   //   cardNumber:'1123456765434356',
  //   //   id:1
  //   // } ,
  //   // {
  //   //   bankStyle:1,
  //   //   bankICO:'',
  //   //   bankNameCN:'中国工商银行',
  //   //   bankNameEN:'ICBC',
  //   //   cardNumber:'3123211321321321',
  //   //   id:1
  //   // }
  // ]
}
// 银行卡 type: 1代表银行卡
root.computed.bankList = function () {
  // console.log('this.defaultList=====',this.defaultList)
  return this.defaultList.filter(v => {
    return v.bankType == 1
  })
}
// 默认银行卡
root.computed.defaultBank = function () {
  console.log('this.bankList===',this.bankList)
  let defaultBank
  for (let i = 0; i < this.bankList.length; i++) {
    if (this.bankList[i].isShow) {
      return defaultBank = this.bankList[i]
    }
  }
  // console.log('defaultBank=====',defaultBank)
  // return defaultBank
}

// 默认银行卡id
root.computed.defaultBankId = function () {
  return this.defaultBank && this.defaultBank.id || null
}

// 是否第一次绑定银行卡
root.computed.isFirstBindBank = function () {
  return this.bankList.length <= 0 ? true : false
}

// 是否只有一张银行卡
root.computed.hasOnlyOneBank = function () {
  return this.bankList.length <= 1 ? true : false
}

// 认证状态-实名认证
root.computed.identity = function () {
  return this.$store.state.authState && this.$store.state.authState.identity
}

// 认证状态-ga
root.computed.bindGa = function () {
  return this.$store.state.authState && this.$store.state.authState.gaAuth
}

// 认证状态-mobile
root.computed.bindMobile = function () {
  return this.$store.state.authState && this.$store.state.authState.mobile
}

// 认证状态-显示选择
root.computed.showPicked = function () {
  return this.picked == 'bindGA' && this.picked == 'bindMobile'
}

// 页面加载中
root.computed.loading = function () {
  return !(this.initReady && this.authStateReady)
}


/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.bankList = function (oldVal , newVal) {
  console.log('oldVal====',oldVal)
  console.log('newVal====',newVal)
}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 初始化获取数据
root.methods.initData = function () {
  if (this.bankSelectListReady) return
  return this.$http.send('PAYMENT_SET_INIT')
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('支付方式初始化', data)
      if (!data) return
      if (data.errorCode) {
        return
      }
      this.initReady = true
      this.bankSelectListReady = true
      // this.aLiPayToggle = this.$globalFunc.arrayHaveItem(data.isUse, "ALIPAY")
      // this.bankPayToggle = this.$globalFunc.arrayHaveItem(data.isUse, "BANKCARD")
      // this.defaultList = data.data.payments
      this.bankSelectList = data.data.payments
      // console.info('this.defaultList======',this.defaultList)
      // this.aLiPayEmpty = true
      // this.aLiPayInfo = {}
      // data.payments.forEach(v => {
      //   if (v.type === 'ALIPAY') {
      //     this.aLiPayInfo = v
      //     this.aLiPayEmpty = false
      //   }
      // })
    })
    .catch(err => {
      // console.warn('初始化失败', err)
    })
}

// 获取认证状态
root.methods.getAuthState = function () {
  if (this.$store.state.authState) {
    this.authStateReady = true
    if (this.bindMobile) {
      this.picked = 'bindMobile'
    }
    if (this.bindGa) {
      this.picked = 'bindGA'
    }
    return
  }
  this.$http.send('GET_AUTH_INFO')
    .then(({data}) => {
      // console.log(data,'手机认证状态')
      typeof data === 'string' && (data = JSON.parse(data))
      if (!data) return
      this.$store.commit('GET_USER_AUTO_INFO', data.data)
      // this.bankAccount = this.$store.state.authState.name
      if (data.data.mobile) {
        this.picked = 'bindMobile'
      }
      if (data.data.gaAuth) {
        this.picked = 'bindGA'
      }
      this.authStateReady = true
    })
    .catch(err => {

    })
}

// 清空支付宝信息
root.methods.clearALiPayData = function () {
  this.aLiPayName = '' // 支付宝姓名
  this.aLiPayNameWrong = '' // 支付宝姓名有误
  this.aLiPayAccount = '' // 支付宝账号
  this.aLiPayAccountWrong = '' // 支付宝账号有误
  this.aLiPayCodeImg = '' // 支付宝收款码
  this.aLiPayCodeImgWrong = '' // 支付宝收款码有误
  this.aLiPayCodeImgType = '' //支付宝收款码类型
  this.aLiPayPrompt = '' // 支付宝备注
  this.aLiPayPromptWrong = '' // 支付宝备注有误
  this.echoImgResult = null // 支付照片回显
  this.aLiPayBinding = false // 绑定中 or 修改中
  this.aLiPayCodeId = ''
}

// 清空银行信息
root.methods.clearBankData = function () {
  // this.bankAccount = '' // 银行卡账户名
  this.bankAccountWrong = ''
  this.bankName = '' // 银行卡开户行
  this.bankNameWrong = ''
  this.bankCardId = '' // 银行卡id
  this.bankBranchName = '' // 银行卡开户支行
  this.bankBranchNameWrong = ''
  this.bankCard = '' // 银行卡号
  this.bankCardWrong = ''
  this.bankDefault = false // 是否默认
  this.bankDefaultWrong = ''
  this.bankMark = '' // 默认信息
  this.bankMarkWrong = ''
  this.bankId = ''
}

// 支付宝的表单验证
// 验证支付宝用户名
root.methods.testALiPayName = function () {
  this.aLiPayNameWrong = ''
  if (this.aLiPayName === '') {
    return false
  }
  return true
}
// 验证支付宝账户
root.methods.testALiPayAccount = function () {
  this.aLiPayAccountWrong = ''
  if (this.aLiPayAccount === '') {
    return false
  }
  return true
}
// 验证支付宝图片
root.methods.testALiPayCodeImg = function () {
  this.aLiPayCodeImgWrong = ''
  if (!this.aLiPayCodeImg) {
    return false
  }
  return true
}
// 验证支付宝提示
root.methods.testALiPayPrompt = function () {
  this.aLiPayPromptWrong = ''
  if (this.aLiPayPrompt === '') {
    return false
  }
  if (this.aLiPayPrompt.length > 50) {
    this.aLiPayPromptWrong = '请输入50字以内'
    return false
  }
  if (this.$globalFunc.testIllegalCharacter(this.aLiPayPrompt)) {
    this.aLiPayPromptWrong = '包含非法字符'
    return false
  }
  return true
}
// 是否可以进入下一步
root.methods.testALiPay = function () {
  let canSend = true
  canSend = this.testALiPayName() && canSend
  canSend = this.testALiPayAccount() && canSend
  canSend = this.testALiPayCodeImg() && canSend
  canSend = this.testALiPayPrompt() && canSend
  if (this.aLiPayName === '') {
    this.aLiPayNameWrong = '请填写姓名'
  }
  if (this.aLiPayAccount === '') {
    this.aLiPayAccountWrong = '请填写账户'
  }
  if (!this.aLiPayCodeImg) {
    this.aLiPayCodeImgWrong = '请添加图片'
  }
  if (this.aLiPayPrompt === '') {
    this.aLiPayPromptWrong = '请填写备注'
  }
  return canSend
}

// 点击解绑支付宝
root.methods.clickReleaseALiPay = function () {
  this.deleteALiPayIng = false
  this.confirmDeleteALiPay = true
  this.deleteALiPayId = this.aLiPayInfo.id
  this.deleteALiPayAccount = this.aLiPayInfo.cardNumber
  this.deleteALiPayName = this.aLiPayInfo.username
}

// 确定解绑支付宝
root.methods.confirmReleaseALiPay = function () {
  let id = this.deleteALiPayId
  this.deleteALiPayIng = true
  this.$http.send('DELETE_PAYMENT_INFO', {
    query: {
      id: id
    }
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('删除支付宝信息', data)
      if (data) {
        this.aLiPayEmpty = true
        this.aLiPayInfo = null// 支付宝绑定信息
        this.closeAllPromptWindow()
      }
      if (!data) {
        this.openPop('删除失败，可能有未完成的订单或挂单', 0)
      }
      this.deleteALiPayIng = false

    })
    .catch(err => {
      // console.warn('删除支付宝出错', err)
      this.deleteALiPayIng = false
    })
}

// 点击添加支付宝支付
root.methods.clickAddALiPay = function () {
  if (!this.openAuthStatePopupWindow()) return
  this.bindALiPayPopupWindowOpen = true
  this.bindALiPayPopupWindowStep = 1
  this.aLiPayType = 0
}

// 点击修改支付宝支付
root.methods.clickChangeALiPay = function () {
  if (!this.openAuthStatePopupWindow()) return

  this.bindALiPayPopupWindowOpen = true
  this.bindALiPayPopupWindowStep = 1
  this.aLiPayType = 1

  this.aLiPayName = this.aLiPayInfo.username // 支付宝姓名
  this.aLiPayNameWrong = '' // 支付宝姓名有误
  this.aLiPayAccount = this.aLiPayInfo.cardNumber // 支付宝账号
  this.aLiPayAccountWrong = '' // 支付宝账号有误
  this.aLiPayCodeImg = this.aLiPayInfo.url // 支付宝收款码
  this.aLiPayCodeImgWrong = '' // 支付宝收款码有误
  this.aLiPayCodeImgType = '' //支付宝收款码类型
  this.aLiPayPrompt = this.aLiPayInfo.mark // 支付宝备注
  this.aLiPayPromptWrong = '' // 支付宝备注有误
  this.echoImgResult = this.aLiPayInfo.url // 支付照片回显
  this.aLiPayCodeId = this.aLiPayInfo.id // 支付宝id
}

// 点击添加支付宝支付第二步
root.methods.goToALiPayStep2 = function () {
  if (!this.testALiPay()) {
    return
  }
  this.bindALiPayPopupWindowStep = 2
}

// 返回修改支付宝第一步
root.methods.goToALiPayStep1 = function () {
  this.bindALiPayPopupWindowStep = 1
}


// 请求添加支付宝支付
root.methods.addALiPay = function (method, code) {
  if (this.aLiPayBinding) return
  this.aLiPayBinding = true
  let formData = new FormData()
  formData.append('userPayInfoBean', JSON.stringify({
    'type': 'ALIPAY',
    'mark': this.aLiPayPrompt,
    'username': this.aLiPayName,
    'cardNumber': this.aLiPayAccount,
    'url': !this.aLiPayCodeImgType && this.aLiPayCodeImg || null,
    'isDefault': 1,
    'method': method,
    'code': code
  }))

  this.aLiPayCodeImgType && formData.append('image', this.aLiPayCodeImg, 'ALIPAY.' + this.aLiPayCodeImgType)

  this.$http.sendFile('ADD_PAYMENT_INFO', formData)
    .then(async ({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('绑定支付宝', data)
      if (data.resultCode) {
        this.openPop(data.message || '绑定失败', 0)
        this.aLiPayBinding = false
        this.sending = false
        return
      }
      await this.initData()
      this.aLiPayBinding = false
      this.sending = false
      this.closeAllPromptWindow()
    })
    .catch(err => {
      // console.warn('绑定支付宝出错', err)
      this.aLiPayBinding = false
      this.sending = false
      this.openPop('绑定失败', 0)
    })
}

root.methods.modifyALiPay = function (method, code) {
  if (this.aLiPayBinding) return
  this.aLiPayBinding = true
  let formData = new FormData()
  formData.append('userPayInfoBean', JSON.stringify({
    'type': 'ALIPAY',
    'mark': this.aLiPayPrompt,
    'username': this.aLiPayName,
    'cardNumber': this.aLiPayAccount,
    'url': !this.aLiPayCodeImgType && this.aLiPayCodeImg || null,
    'id': this.aLiPayCodeId,
    'isDefault': 1,
    'method': method,
    'code': code
  }))

  this.aLiPayCodeImgType && formData.append('image', this.aLiPayCodeImg, 'ALIPAY.' + this.aLiPayCodeImgType)

  this.$http.sendFile('CHANGE_PAYMENT_INFO', formData)
    .then(async ({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('绑定支付宝', data)
      if (data.resultCode) {
        this.openPop(data.message || '绑定失败', 0)
        this.aLiPayBinding = false
        this.sending = false
        return
      }
      await this.initData()
      this.aLiPayBinding = false
      this.sending = false
      this.closeAllPromptWindow()
    })
    .catch(err => {
      // console.warn('绑定支付宝出错', err)
      this.aLiPayBinding = false
      this.sending = false
      this.openPop('绑定失败', 0)
    })
}

// 关闭确认解绑支付宝弹窗
root.methods.closeConfirmDeleteALiPay = function () {
  this.confirmDeleteALiPay = false
  this.deleteALiPayIng = false
}
// 关闭确认解绑银行卡弹窗
root.methods.closeConfirmDeleteBank = function () {
  this.confirmDeleteBank = false
  this.deleteBankIng = false
}

// 关闭所有弹窗
root.methods.closeAllPromptWindow = function () {
  this.closeConfirmDeleteBank()
  this.closeConfirmDeleteALiPay()
  this.closeBindALiPayPopupWindow()
  this.closeBindBankPopupWindow()
  this.closeSecondVerify()
}

// 获取银行列表
root.methods.getBankList = function () {
  if (this.bankSelectListReady) return
  return this.$http.send('GET_BANK')
    .then(({data}) => {
      // console.log(data)
      typeof data === 'string' && (data = JSON.parse(data))
      console.warn('获取银行列表', data)
      this.defaultList = data.data

      this.bankSelectListReady = true
    })
    .catch(err => {
      // console.warn('获取银行列表出错', err)
    })
}

// 银行卡输入表单验证
root.methods.changeBankCard = function (card) {
  let number = card.slice(-4)
  let beforeLength, afterLength = 4, beforeChart = ''
  beforeLength = Math.max(card.length - afterLength, 0)
  for (let i = 0; i < beforeLength; i++) {
    if (i % 4 === 0 && i !== 0 && i !== beforeLength - 1) {
      beforeChart += ' '
    }
    beforeChart += '*'
  }
  return `${beforeChart} ${number}`
}

// 检验银行卡号
root.methods.testBankAccount = function () {
  this.bankAccountWrong = ''
  if (this.bankAccount === '') {
    return false
  }
  return true
}
// 检验开户行
root.methods.testBankName = function () {
  this.bankNameWrong = ''
  if (!this.selectedBankName) {
    return false
  }
  return true
}
// 检验开户支行
root.methods.testBankBranchName = function () {
  this.bankBranchNameWrong = ''
  if (this.bankBranchName === '') {
    return false
  }
  return true
}
// 检验银行卡号
root.methods.testBankCard = function () {
  this.bankCardWrong = ''
  if (this.bankCard === '') {
    return false
  }
  if (!this.$globalFunc.testNumber(this.bankCard)) {
    this.bankCardWrong = '请输入正确的银行卡号'
    return false
  }
  return true
}
// 检测默认收款银行
root.methods.testBankDefault = function () {
  return true
}
// 检测备注信息
root.methods.testBankMark = function () {
  this.bankMarkWrong = ''
  if (this.bankMark === '') {
    return false
  }
  if (this.bankMark.length > 50) {
    this.bankMarkWrong = '请输入50字以内'
    return false
  }
  if (this.$globalFunc.testIllegalCharacter(this.bankMark)) {
    this.bankMarkWrong = '包含非法字符'
    return false
  }
  return true
}
// 检测是否可以发送
root.methods.canSendBank = function () {
  let canSend = true
  // canSend = this.testBankAccount() && canSend
  canSend = this.testBankName() && canSend
  canSend = this.testBankBranchName() && canSend
  canSend = this.testBankCard() && canSend
  canSend = this.testBankDefault() && canSend
  // canSend = this.testBankMark() && canSend
// console.log("----111111111111-------------"+this.testBankAccount());
//   if (this.bankAccount === '') {
//     this.bankAccountWrong = '请输入账户名'
//     canSend = false
//   }
  // console.log("----22222222222222222-------------"+this.testBankName());
  if (!this.selectedBankName) {
    this.bankNameWrong = '请选择开户行'
    canSend = false
  }
  // console.log("----3333333333333333-------------"+this.testBankBranchName());
  if (this.bankBranchName === '') {
    this.bankBranchNameWrong = '请选择开户支行'
    canSend = false
  }
  // console.log("----44444444444444-------------"+this.testBankCard());
  if (this.bankCard === '') {
    this.bankCardWrong = '请输入银行卡号'
    canSend = false
  }
  // console.log("----5555555555555555555-------------"+this.testBankDefault());
  // if (this.bankMark === '') {
  //   this.bankMarkWrong = '请输入备注信息'
  //   canSend = false
  // }
  return canSend
}

// 点击选择开户行
root.methods.clickSelectBankName = function (val) {
  console.log('val=====',val)
  this.bankName = val
  if (val) this.testBankName()
}

// 点击解绑银行卡bankName
root.methods.clickReleaseBank = function (item) {
  this.deleteBankIng = false
  this.confirmDeleteBank = true
  this.deleteBankId = item.id
  this.deleteBankCard = item.bankNumber
  this.deleteBankAccount = item.userName
  this.deleteBankName = item.bankName
}

// 确认解绑银行卡
root.methods.confirmReleaseBank = function () {
  let id = this.deleteBankId
  this.deleteBankIng = true
  this.$http.send('DELETE_PAYMENT_INFO', {
    query: {
      id: id
    }
  })
    .then(async ({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('删除银行卡信息', data)
      if (data) {
        data.code && data.code== 200 && this.openPop('删除银行卡成功',1)
        await this.getBankList()
        this.closeAllPromptWindow()

      }
      if (!data) {
        this.openPop('删除失败，可能有未完成的订单或挂单', 0)
      }
      this.deleteBankIng = false
      this.defaultList = data.data
    })
    .catch(err => {
      // console.warn('删除支付宝出错', err)
      this.deleteBankIng = false
    })
}


// 点击添加银行卡支付
root.methods.clickAddBankPay = function () {
  // if (!this.openAuthStatePopupWindow()) return

  this.bindBankPopupWindowOpen = true
  this.bindBankPopupWindowStep = 1
  this.bankPayBinding = false
  this.bankType = 0
  if (this.isFirstBindBank) {
    this.bankDefault = true
  }
  this.getBankList()
}

// 点击修改银行卡支付
root.methods.clickModifyBankPay = async function (item) {
  // if (!this.openAuthStatePopupWindow()) return
  this.bindBankPopupWindowOpen = true
  this.bindBankPopupWindowStep = 1
  this.bankAccount = item.userName
  this.bankAccountWrong = ''
  this.bankNameWrong = ''
  this.bankBranchName = item.bankAddress
  this.bankBranchNameWrong = ''
  this.bankCard = item.bankNumber
  this.bankCardWrong = ''
  this.bankDefault = item.isShow == 1 ? true : false
  this.bankDefaultWrong = ''
  // this.bankMark = item.mark
  // this.bankMarkWrong = ''
  this.bankId = item.id
  this.bankType = 1
  this.bankPayBinding = false
  await this.getBankList()
  this.bankName = this.findBankFormSelectList(item.bankName)
}

// 寻找银行
root.methods.findBankFormSelectList = function (bankName) {
  return this.bankSelectList.filter(v => {
    return v.cnName === bankName || v.enName === bankName
  }).pop()
}


// 添加银行卡支付
root.methods.addBankPay = function (method, code) {
  if (this.bankPayBinding) return
  this.bankPayBinding = true

  let formData = new FormData()
  formData.append('userPayInfoBean', JSON.stringify({
    'bankType': 1, //  1 银行卡 2 支付宝 3 微信
    // 'mark': this.bankMark,
    'userName': this.bankAccount,  // TODO ：账户名默认显示出来
    'bankName': this.selectedBankName,
    // 'bankId': this.selectedBankId,
    'bankAddress': this.bankBranchName,
    'bankNumber': this.bankCard,
    'isShow': this.bankDefault ? 1 : 0,
    'method': method,
    'code': code,
  }))
  console.info('formData======',formData)

  this.$http.sendFile('ADD_PAYMENT_INFO', formData)
    .then(async ({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      console.warn('绑定银行卡', data)
      if (data.code) {
        let message = ''
        switch (data.code) {
          case 1001:
            message = '用户未绑定手机'
            break;
          case 1003:
            message = '验证码过期'
            break;
          case 1004:
            message = '验证码错误'
            break;
          case 1005:
            message = '用户名不一致'
            break;
          case 1006:
            message = '填写完整信息'
            break;
          case 1009:
            message = '图片上传失败'
            break;
          case 1040:
            message = '卡号已存在'
            break;
          case 200:
            message = '添加银行卡成功'
            break;
          // case 8:
          //   message = '上传图片不是jpg格式'
          //   break;
          // case 9:
          //   message = '您的银行卡开户名，和在本网站账户实名认证姓名不一致或未实名认证'
          //   break;
          // case 10:
          //   message = ''
          //   if (method === 'ga') {
          //     this.GACodeWA = '验证码错误'
          //   }
          //   if (method === 'sms') {
          //     this.verificationCodeWA = '验证码错误'
          //   }
          //   break;
          // case 11:
          //   message = '您未绑定谷歌验证或手机'
          //   break;
          // case 20:
          //   message = '您有未完成的订单或挂单，不能重置默认收款银行卡'
          //   break;
          default:
            message = '暂不可用'
        }
        data.code !=200 && message && this.openPop(message || '暂不可用', 0)
        if(data.code == 200){
          message && this.openPop(message || '添加成功')
          // 关闭弹窗
          this.bindBankPopupWindowOpen = false
          this.secondVerifyOpen = false
          // 获取银行卡信息
          this.getBankList()
          this.defaultList = data.data
        }
        this.bankPayBinding = false
        this.sending = false
        return
      }
      // // 如果是第一次绑定，打开银行转账按钮
      await this.initData()
      this.bankPayBinding = false
      this.sending = false
      this.closeAllPromptWindow()
    })
    .catch(err => {
      console.warn('绑定银行卡出错', err)
      this.bankPayBinding = false
      this.sending = false
      this.openPop('绑定失败', 0)
    })
}

// 修改银行卡支付
root.methods.modifyBankPay = function (method, code) {
  if (this.bankPayBinding) return
  this.bankPayBinding = true

  let formData = new FormData()
  formData.append('userPayInfoBean', JSON.stringify({
    // 'type': 'BANKCARD',
    // 'mark': this.bankMark,
    // 'username': this.bankAccount,
    // 'bankName': this.selectedBankName,
    // 'bankId': this.selectedBankId,
    // 'bankAddr': this.bankBranchName,
    // 'cardNumber': this.bankCard,
    // 'isDefault': this.bankDefault ? 1 : 0,
    // 'id': this.bankId,
    // 'method': method,
    // 'code': code

    'bankType': 1, //  1 银行卡 2 支付宝 3 微信
    // 'mark': this.bankMark,
    'userName': this.bankAccount,  // TODO ：账户名默认显示出来
    'bankName': this.selectedBankName,
    'id': this.bankId,
    // 'bankId': this.selectedBankId,
    'bankAddress': this.bankBranchName,
    'bankNumber': this.bankCard,
    'isShow': this.bankDefault ? 1 : 0,
    'method': method,
    'code': code,
  }))
  // console.log(formData.get("userPayInfoBean"),'formdata')
  this.$http.sendFile('CHANGE_PAYMENT_INFO', formData)
    .then(async ({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('修改银行卡', data)
      if (data.code) {
        let message = ''
        switch (data.code) {
          // case 1:
          //   message = '失败，请重试'
          //   break;
          // case 2:
          //   message = '暂不支持该银行卡'
          //   break;
          // case 9:
          //   message = '您的银行卡开户名，和在本网站账户实名认证姓名不一致或未实名认证'
          //   break;
          // case 10:
          //   message = ''
          //   if (method === 'ga') {
          //     this.GACodeWA = '验证码错误'
          //   }
          //   if (method === 'sms') {
          //     this.verificationCodeWA = '验证码错误'
          //   }
          //   break;
          // case 11:
          //   message = '修改失败，可能有未完成的订单或挂单'
          //   break;
          // case 20:
          //   message = '您有未完成的订单或挂单，不能重置默认收款银行卡'
          //   break;
          case 1001:
            message = '用户未绑定手机'
            break;
          case 1003:
            message = '验证码过期'
            break;
          case 1004:
            message = '验证码错误'
            break;
          case 1005:
            message = '用户名不一致'
            break;
          case 1006:
            message = '填写完整信息'
            break;
          case 1009:
            message = '图片上传失败'
            break;
          case 1040:
            message = '卡号已存在'
            break;
          case 200:
            message = '修改成功'
            break;
          default:
            message = '暂不可用'
        }
        message && this.openPop(message || '暂不可用', 0)
        data.code && data.code== 200 && this.openPop(message || '修改成功', 1 )
        // 关闭弹窗
        this.bindBankPopupWindowOpen = false
        this.secondVerifyOpen = false
        // 重新获取列表
        this.defaultList = data.data
        this.bankPayBinding = false
        this.sending = false
        return
      }
      // // 如果是第一次绑定，打开银行转账按钮
      await this.initData()
      this.bankPayBinding = false
      this.sending = false
      this.closeAllPromptWindow()
    })
    .catch(err => {
      // console.warn('修改银行卡出错', err)
      this.bankPayBinding = false
      this.sending = false
      this.openPop('修改失败', 0)
    })
}


// 点击添加、修改选择银行卡
root.methods.addChoseDefaultBank = function () {
  if (this.isFirstBindBank || this.bankId === this.defaultBankId) {
    return
  }
  this.bankDefault = !this.bankDefault
}

// 绑定银行卡第二步
root.methods.goToBankStep2 = function () {
  // console.log(this.defaultList,'yinhang')
  // console.log(this.$store.state.authMessage)
  this.GACode = ''
  let isData = [];
  this.defaultList.forEach(item=>{
    isData.push(item.bankNumber)})
  if(isData.indexOf(this.bankName)!=-1){
    this.openPop('银行卡号已存在', 0)
    return
  }
  if (!this.canSendBank()) return
  this.bindBankPopupWindowStep = 2
  // console.log("----------------11111111111111111");

}
// 绑定银行卡第一步
root.methods.goToBankStep1 = function () {
  this.bindBankPopupWindowStep = 1
}


// 选择默认银行卡
root.methods.clickToChoseDefaultBank = function (item) {
  this.modifyDefaultBankId = item.id
  this.confirmChoseDefaultBank()
}

// 确认选择默认银行卡
root.methods.confirmChoseDefaultBank = function () {
  this.$http.send('SET_DEFAULT_PAYMENT', {
    query: {
      id: this.modifyDefaultBankId,
      type: true
    }
  })
    .then( ({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('修改默认的银行卡', data)
      if (data) {
        this.defaultList = data.data
      }
      if (!data) {
        this.openPop('您有未完成的订单或挂单，不能重置默认收款银行卡', 0)
      }
      // this.initData()
      this.getBankList()
    })
    .catch(err => {
      // console.warn('修改默认的银行卡失败', err)
    })
}

// 切换支付宝支付
root.methods.switchALiPayToggle = function () {
  if (this.aLiPayToggleIng) return
  this.aLiPayToggleIng = true
  this.$http.send('CHANGE_PAYMENT_STATUS', {
    query: {
      type: 'ALIPAY'
    }
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    // console.warn('修改支付宝启用状态', data)
    if (data) {
      this.aLiPayToggle = !this.aLiPayToggle
    }
    if (!data) {
      this.openPop('修改失败，可能有未完成的订单或挂单', 0)
    }
    this.aLiPayToggleIng = false
  }).catch(err => {
    // console.warn('修改支付宝启用状态失败!', err)
    this.aLiPayToggleIng = false
    this.openPop('修改状态失败', 0)
  })
}

// 切换银行支付
root.methods.switchBankPayToggle = function () {
  if (this.bankPayToggleIng) return
  this.bankPayToggleIng = true
  this.$http.send('CHANGE_PAYMENT_STATUS', {
    query: {
      type: 'BANKCARD'
    }
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    // console.warn('修改银行卡启用状态', data)
    if (data) {
      this.bankPayToggle = !this.bankPayToggle
    }
    if (!data) {
      this.openPop('修改失败，可能有未完成的订单或挂单', 0)
    }
    this.bankPayToggleIng = false
  }).catch(err => {
    // console.warn('修改支付宝启用状态失败!', err)
    this.bankPayToggleIng = false
    this.openPop('修改状态失败', 0)
  })

}

// 关闭绑定支付宝的弹窗
root.methods.closeBindALiPayPopupWindow = function () {
  this.bindALiPayPopupWindowOpen = false
  this.clearALiPayData()
}

// 关闭绑定银行卡的弹窗
root.methods.closeBindBankPopupWindow = function () {
  this.bindBankPopupWindowOpen = false
  this.clearBankData()
}


// 开始二次验证弹窗  验证方式 1 2 3 4 1为绑定支付宝 2为修改支付宝 3为绑定银行卡 4为修改银行卡
root.methods.beginVerify = function (type) {
  this.GACode = ''
  this.verifyType = type
  this.secondVerifyOpen = true
  this.click_send()
}

// 开始倒计时
root.methods.beginGetVerificationCodeCountdown = function () {
  this.getVerifyCountdownInterval && clearInterval(this.getVerifyCountdownInterval)
  this.getVerificationCode = true
  this.getVerifyCountdownInterval = setInterval(() => {
    this.getVerificationCodeCountdown--
    if (this.getVerificationCodeCountdown <= 0) {
      this.getVerifyCountdownInterval && clearInterval(this.getVerifyCountdownInterval)
      this.getVerificationCodeCountdown = 60
      this.getVerificationCode = false
    }
  }, 1000)
}

// 结束倒计时
root.methods.endGetVerificationCodeCountdown = function () {
  this.getVerifyCountdownInterval && clearInterval(this.getVerifyCountdownInterval)
  this.getVerificationCodeCountdown = 60
  this.getVerificationCode = false
}

// 点击获取手机验证码
root.methods.click_getVerificationCode = function () {
  this.beginGetVerificationCodeCountdown()
  this.$http.send('SEND_MOBILE_VERIFY_CODE',{
    query: {
      'bankType': 1
    }
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('发送手机验证码', data)
      if (data.errorCode) {
        switch (data.errorCode) {
          case 1:
            this.verificationCodeWA = '请刷新重试'
            break;
          default:
            this.verificationCodeWA = '暂不可用'
        }
        return
      }
    })
    .catch(err => {
      // console.warn('发送手机验证码失败', err)
    })
}

// 检验谷歌验证
root.methods.testGACode = function () {
  this.GACodeWA = ''
  if (this.GACode === '') {
    return false
  }
  return true
}

// 检验手机验证码
root.methods.testVerificationCode = function () {
  this.verificationCodeWA = ''
  if (this.verificationCode === '') {
    return false
  }
  return true
}

// 检验二次验证通过
root.methods.verifyCanSend = function () {
  let canSend = true
  if (this.picked === 'bindGA') {
    canSend = this.testGACode() && canSend
    if (this.GACode === '') {
      this.GACodeWA = '请输入谷歌验证码'
      canSend = false
    }
  }
  if (this.picked === 'bindMobile') {
    canSend = this.testVerificationCode() && canSend
    if (this.verificationCode === '') {
      this.verificationCodeWA = '请输入手机验证码'
      canSend = false
    }
  }
  return canSend
}
// 发送添加银行卡表单
root.methods.click_send = function () {
  if (!this.verifyCanSend()) return
  this.sending = true
  let method, code
  if (this.picked === 'bindGA') {
    method = 'ga'
    code = this.GACode
  }
  if (this.picked === 'bindMobile') {
    method = 'sms'
    code = this.verificationCode
  }
  // console.warn('this is picked', this.picked, this.verifyType, this.verifyType === 3, this.verifyType === 4)
  // 绑定支付宝
  if (this.verifyType === 1) {
    this.addALiPay(method, code)
  }
  // 修改支付宝
  if (this.verifyType === 2) {
    this.modifyALiPay(method, code)
  }
  // 绑定银行卡
  if (this.verifyType === 3) {
    this.addBankPay(method, code)
    return;
  }
  // 修改银行卡
  if (this.verifyType === 4) {
    this.modifyBankPay(method, code)
  }

}


// 关闭二次验证弹窗
root.methods.closeSecondVerify = function () {
  this.secondVerifyOpen = false
  this.clearSecondVerify()
}

// 清空二次验证弹窗
root.methods.clearSecondVerify = function () {
  this.verificationCodeWA = ''
  this.verificationCode = ''
  this.GACodeWA = ''
  this.GACode = ''
  this.sending = false
  if (this.bindMobile) {
    this.picked = 'bindMobile'
  }
  if (this.bindGa) {
    this.picked = 'bindGA'
  }
  this.endGetVerificationCodeCountdown()
}

// 打开认证状态弹窗
root.methods.openAuthStatePopupWindow = function () {
  // if (!this.identity) {
  //   this.authStatePopupType = 1
  //   this.authStatePopupWindow = true
  //   return false
  // }
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

// 关闭验证弹窗
root.methods.CLOSE_GA_SMS_DIALOG = function () {
  this.secondVerifyOpen = false
}

// 清空认证状态弹窗
root.methods.clearAuthStatePopupWindow = function () {
  this.authStatePopupType = 1
}


// 点击上传支付宝收款码
root.methods.clickFileInput = function () {
  this.aLiPayCodeImgWrong = ''
  this.$refs.fileInput.click()
}


// 清空file输入框
root.methods.resetFileInput = function () {

}

// 显示弹窗小提示
root.methods.openPop = function (popText, popType = 1) {
  this.popOpen = false
  this.popText = popText
  this.popType = popType
  setTimeout(() => {
    this.popOpen = true
  }, 100)
}

// 关闭弹窗提示
root.methods.popClose = function () {
  this.popOpen = false
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

// 检测图片
root.methods.testImg = function (file) {
  if (!file) {
    return '请上传图片'
  }
  if (!/image\/\w+/.test(file.type)) {
    return '请上传正确的图片'
  }
  if (file.type.split('/')[1] !== 'jpg' && file.type.split('/')[1] !== 'jpeg') {
    return '图片格式不正确'
  }
  return ''
}


// 检测图片大小
root.methods.testImgSize = function (blob) {
  if (!blob.size) return false
  if (blob.size / 1024 > this.maxImgSize) {
    this.openPop('图片过大', 1)
    return false
  }
  return true
}


// 上传照片
root.methods.getFileInput = function () {
  let file = this.$refs.fileInput.files[0]
  if (!file) return
  let testImgTxt = this.testImg(file)
  if (testImgTxt !== '') {
    this.resetFileInput()
    this.openPop(testImgTxt, 1)
    return
  }
  // 处理照片中
  this.readFile(file, this.loadImgComplete)
}


// 图片reader
root.methods.readFile = function (file, callBack) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    callBack && callBack(this.result, file.size, file.type)
  }
}

// reader结束后回调
root.methods.loadImgComplete = function (file, size, type) {
  this.compressImg(file, size, type, this.compressImgComplete)
}


// 压缩完毕回调
root.methods.compressImgComplete = function (blob, type, file) {
  // 图片处理中关闭
  // 重置输入框
  this.resetFileInput()
  if (!this.testImgSize(blob)) return
  this.echoImgResult = file
  this.aLiPayCodeImg = blob
  this.aLiPayCodeImgType = type
}


// 图片压缩
root.methods.compressImg = function (file, size, type, callBack) {
  let that = this
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  let img = new Image()
  img.onload = function () {
    let originWidth = this.width;
    let originHeight = this.height;
    canvas.width = originWidth;
    canvas.height = originWidth * (originHeight / originWidth);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    // 压缩比例
    let k = 0.3
    if (size / 1000 > 3000) k = 0.2
    if (size / 1000 > 4000) k = 0.1
    let base64 = canvas.toDataURL(type, k)
    let blob = that.changeBase64(base64)
    callBack && callBack(blob, type, file)
  }
  img.src = file
}

// 转base64
root.methods.changeBase64 = function (dataURI) {
  let byteString = window.atob(dataURI.split(',')[1])
  let ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  let bb = new window.Blob([ab])
  return bb
}


export default root
