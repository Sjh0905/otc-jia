const urlHead = '/otc'

const address = {}


address.TEST_RUL = {url: '/apis/', method: 'get', timeout: null, responseType: null}  //demo
address.TEST_A_COOKIES = {url: '/user/test', method: 'get', timeout: null, responseType: null}  //demo
address.TEST_B_COOKIES = {url: urlHead + '/user/setCookies', method: 'get', timeout: null, responseType: null}  //demo

address.TEST_RUL = {url: '/otc/', method: 'get', timeout: null, responseType: 'json'}  //demo
address.TEST_COOKIES = {url: urlHead + '/user/test', method: 'post', timeout: null, responseType: 'json'}  //demo

// 无极验版 登录 测试使用
address.SIGN_TEST = {url: urlHead + '/user/signInForTest', method: 'post', timeout: null, responseType: 'json'};

// 判断登录状态 checkLoginForC2C
// address.CHECK_LOGIN = {url: '/otc/user/checkLoginForC2C', method: 'post', timeout: null, responseType: 'json'};

// 申请商家时候获取当前用户认证状态 getUserAuthInfo
address.GET_USER_AUTO_INFO = {url: urlHead + '/user/getUserAuthInfo', method: 'get', timeout: null, responseType: 'json'}

// 2018-8-14 申请成为商家
address.APPLY_BUSINESS = {url: urlHead + '/user/submissionForSeller', method: 'post', timeout: null, responseType: 'json'}

// 我的订单 接口 /user/getListOfCtcOrders
// address.GET_LIST_ORDERS = {url: urlHead + '/user/getListOfCtcOrders', method: 'post', timeout: null, responseType: 'json'}
address.GET_LIST_ORDERS = {url: urlHead + '/orders/getOtcOrders', method: 'get', timeout: null, responseType: 'json'}

// 2018-8-21 otc首页请求列表
// address.GET_LIST_OF_LISTS= {url: urlHead + '/user/getListOfLists', method: 'get', timeout: null, responseType: 'json'}
//2020-4-26sss   otc首页请求列表
address.GET_LIST_OF_LISTS= {url: urlHead + '/advert/tradeIndex', method: 'get', timeout: null, responseType: 'json'}

// 我的订单 确认付款
// address.COMFIRM_PAYMENT = {url: urlHead + '/user/toConfirmPayment', method: 'post', timeout: null, responseType: 'json'}
address.COMFIRM_PAYMENT = {url: urlHead + '/orders/confirmPayment', method: 'post', timeout: null, responseType: 'json'}

// 我的订单 确认已收
// address.COMFIRM_RECEIVED = {url: urlHead + '/user/toConfirmReceived', method: 'post', timeout: null, responseType: 'json'}
address.COMFIRM_RECEIVED = {url: urlHead + '/orders/confirmCollection', method: 'post', timeout: null, responseType: 'json'}

// 订单详情 getCtcOrderDetail
address.CTC_ORDER_DETAIL = {url: urlHead + '/user/getOtcOrderDetail', method: 'post', timeout: null, responseType: 'json'}

// 获取服务器时间 /user/getServerTime
address.GET_SEVER_TIME = {url: urlHead + '/user/getServerTime', method: 'get', timeout: null, responseType: 'json'}

// 进入详情页时候判断用户支付方式有无变化  validateUserPayInfo
address.USER_PAY_INFO = {url: urlHead + '/user/validateUserPayInfo', method: 'post', timeout: null, responseType: 'json'}

// 获取用户的认证状态
// address.GET_AUTH_STATE = {url: urlHead + '/auth/getAuthsForC2C', method: 'post', timeout: null, responseType: 'json'}
address.GET_AUTH_STATE = {url: urlHead + '/user/getUserAuthInfo', method: 'get', timeout: null, responseType: 'json'}
// 获取用户的usdt资产
// address.ACCOUNTS = {url: urlHead + '/user/userAccounts', method: 'get'}
address.ACCOUNTS = {url: urlHead + '/accounts/userAccounts', method: 'get'}

// 确认下单接口
// address.PLACE_AN_ORDER = {url: urlHead + '/user/placeAnOrder', method: 'post', timeout: null, responseType: 'json'}
//2020-4-26sss 确认下单接口
address.PLACE_AN_ORDER = {url: urlHead + '/orders/placeAnOrder', method: 'post', timeout: null, responseType: 'json'}

// 商户下单接口
// address.CREATE_POSTER_ORDER = {url: urlHead + '/user/createPostersOrder', method: 'post', timeout: null, responseType: 'json'}
//2020-4-26sss 商户下单接口
address.CREATE_POSTER_ORDER = {url: urlHead + '/advert/releaseIndex', method: 'post', timeout: null, responseType: 'json'}


// 买入详情，取消订单 /cancelCtcOrder
address.CANCEL_CTC_ORDER = {url: urlHead + '/user/cancelCtcOrder', method: 'post', timeout: null, responseType: 'json'}

// 发送邮箱/短信验证码
address.ORDER_MAIL_CODE = {url: urlHead + '/auth/getVerificationCodeForC2C', method: 'post', timeout: null, responseType: 'json'}

// 验证短信/邮箱验证码 commonAuthForotc
address.COMMEN_AUTH_FORCTC = {url: urlHead + '/auth/commonAuthForC2C', method: 'post', timeout: null, responseType: 'json'}

// 2018-8-20 支付设置部分
// 支付设置初始化
// address.PAYMENT_SET_INIT = {url: urlHead + '/payInf/showPayInfo', method: 'get'}
address.PAYMENT_SET_INIT = {url: urlHead + '/common/systemArgs', method: 'get'}

// 获取支持交易的银行
// address.GET_BANK = {url: urlHead + '/payInf/getBanks', method: 'get'}
// 获取交易银行卡列表
address.GET_BANK = {url: urlHead + '/accounts/userPayments', method: 'get'}

// 添加支付信息
address.ADD_PAYMENT_INFO = {url: urlHead + '/user/addPayInfo', method: 'post'}

// 修改支付信息
address.CHANGE_PAYMENT_INFO = {url: urlHead + '/user/modifyPayInfo', method: 'post'}

// 修改启用状态
address.CHANGE_PAYMENT_STATUS = {url: urlHead + '/payInf/modifyStatus', method: 'get'}

// 删除支付信息
address.DELETE_PAYMENT_INFO = {url: urlHead + '/user/deletePayInfo', method: 'get'}

// 设置默认支付
address.SET_DEFAULT_PAYMENT = {url: urlHead + '/user/modifyStatus', method: 'get'}

// 发送手机验证码
address.SEND_MOBILE_VERIFY_CODE = {url:urlHead + '/user/SendCode',method:'get'}

// 商家中心
// 商家中心顶部接口
address.POST_BUSINESS_BASE_INFO = {url: urlHead + '/user/getBusinessBaseInfo', method: 'post', timeout: null, responseType: 'json'}
// 商户部分挂单接口
address.GET_PART_POSTER_ORDER_LIST = {url: urlHead + '/user/getPartPosterOrderList', method: 'post', timeout: null, responseType: 'json'}

// 我的商家订单
address.GET_BUSINESS_ORDER_LIST = {url: urlHead + '/user/getBusinessOrderList', method: 'post', timeout: null, responseType: 'json'}

// 我的商家撤单
address.CANCEL_POSTER_ORDER = {url: urlHead + '/user/cancelPostersOrder', method: 'post', timeout: null, responseType: 'json'}

// // 登出 signoutForC2C
// address.SIGNOUT_CTC = {url: urlHead + '/user/signoutForC2C', method: 'post', timeout: null, responseType: 'json'}
//
// 检测用户是否被禁止交易2020-4-26
// address.VALIDATE_USER_CAN_TRADE = {url: urlHead + '/user/validateUserCanTrade', method: 'post', timeout: null, responseType: 'json'}
address.VALIDATE_USER_CAN_TRADE = {url: urlHead + '/accounts/validateUserCanTrade', method: 'get', timeout: null, responseType: 'json'}


// 点击关闭c2c首次弹框2020-4-26
address.CONFIRM_MARKET_RULES_RECORD = {url: urlHead + '/accounts/confirmMarketRulesRecord', method: 'post', timeout: null, responseType: 'json'}

// 首次进入c2c是否显示弹框2020-4-26
// address.IS_FIRST_VISIT = {url: urlHead + '/user/isFirstVisit', method: 'post', timeout: null, responseType: 'json'}
address.IS_FIRST_VISIT = {url: urlHead + '/accounts/isFirstVisit', method: 'get', timeout: null, responseType: 'json'}

// 点击一键购买
address.POST_DASH_BUTTON={url: urlHead + '/user/quickBuy', method: 'post', timeout: null, responseType: 'json'}
address.POST_DASH_BUTTON_QUICKSELL={url: urlHead + '/user/quickSell', method: 'post', timeout: null, responseType: 'json'}

// 查询全局配置信息
address.GET_SYSTEM_ARGS={url: urlHead + '/common/systemArgs', method: 'get', timeout: null, responseType: 'json'}


// 获取银行卡信息2020-4-26
// address.GET_DASH_BUTTON={url: urlHead + '/user/payInfo', method: 'get', timeout: null, responseType: 'json'}
address.GET_DASH_BUTTON={url: urlHead + '/accounts/userPayInfo', method: 'get', timeout: null, responseType: 'json'}

export default address
