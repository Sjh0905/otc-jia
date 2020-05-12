const store = {}

store.state = {}

store.state.test = ''

store.state.lang = 'CH'

// 跳转域名
// store.state.domain_url = 'http://www.2020.exchange/';
store.state.domain_url = process.env.DOMAIN || 'http://transfer.2020-ex.com/'
// store.state.domain_url = process.env.DOMAIN || 'http://sss.2020.exchange:8085/'


store.state.download_app = process.env.DOWN_APP || 'https://download.2020.exchange'
// 是否登录 false
store.state.isLogin = false;
//是否是移动端
store.state.isMobile = ''

/**
 * 服务器时间
 * @type {string}
 */
store.state.serverTime = 0
store.state.serverTimeInterval = null

// 是否实名认证
store.state.authState = null;

/**
 * 身份信息
 * @type {{userId: string, city: string, country: string, createdAt: string, email: string, id: string, idCode: string, name: string, province: string, street: string, updatedAt: string, version: string, zipcode: string}}
 */
store.state.authMessage = {
  userId: '',
  city: '',
  country: '',
  createdAt: '',
  email: '',
  id: '',
  idCode: '',
  name: '',
  province: '',
  street: '',
  updatedAt: '',
  version: '',
  zipcode: ''
}

store.state.accounts = null;

/**
 * 货币种类
 * @type {{}}
 */
store.state.currency = new Map()
store.state.currencyChange = 0 // 币种信息发送变化

/**
 * 认证状态
 * sms: false,  手机
 * ga: false,   谷歌验证
 * identity: false, 身份认证
 * capital: false,  资金密码
 * email: false 邮箱
 * @type {null}
 */

// store.state.authState = null
store.state.authState = {};

// 连接 socket 信息
store.state.socket = {};

// 接收soceket返回信息
store.state.result_socket = {};

/**
 * 同步修改state
 * @type {{}}
 */
store.mutations = {}
store.mutations.testFunc = (state, info) => {
  state.test = info
}
/**
 * 修改语言
 * @param state
 * @param lang
 */
store.mutations.CHANGE_LANG = (state, lang) => {
  state.lang = lang
}

/**
 * 更改用户信息
 * @param state
 * @param info
 * capital:资金密码
 * sms:手机
 * ga:谷歌验证
 * identity:身份验证
 * @constructor
 */
store.mutations.SET_AUTH_MESSAGE = (state, info) => {
  if (!info) return;
  state.authMessage = info;
  state.isLogin = info.userId ? true : false

}

// 更新服务器时间
store.mutations.SET_SERVER_TIME = (state, time) => {
  state.serverTime = time
  state.serverTimeInterval && clearInterval(state.serverTimeInterval)
  state.serverTimeInterval = setInterval(() => {
    state.serverTime += 1000
  }, 1000)

}

/**
 * 修改认证状态
 * @param state
 * @param info
 * @constructor
 */
store.mutations.SET_AUTH_STATE = (state, info) => {
  // state.authState = info
  if (!info) return;
  state.authState = info;
  state.isLogin = info.userId ? true : false
}

// 修改顶部资产余额
store.mutations.SET_ACCOUNTS = (state, accounts) => {
  state.accounts = accounts

  // 如果获取到的信息没有或者不是数组，直接退出即可
  if (!accounts || accounts instanceof Array === false) return
  // 扩充account
  for (let i = 0; i < accounts.length; i++) {
    // 如果没有currency这个属性，跳过即可
    if (!accounts[i].currency) {
      continue
    }
    // 获取Map币种对应的对象
    let target = state.currency.get(accounts[i].currency)

    // 如果不存在这个属性，新建一个
    if (!target) {
      state.currency.set(accounts[i].currency, target = {
        currency: accounts[i].currency,
        // total: accounts[i].total || 0,
        available: accounts[i].available || 0,
        frozen: accounts[i].frozen || 0,
        locked: accounts[i].locked || 0,
      })
    }

    // 修改总值
    // target.total = parseFloat(GlobalFunc.accAdd(target.available, target.frozen))

    console.log('state.currency',state.currency);
  }

  // 因为Map对象并不会触发vuex和watch的检测，所以使用另外的属性进行检测，每次变动，对currencyChange进行修改，观测currencyChange即可
  state.currencyChange++
  if (state.currencyChange > 100) state.currencyChange = 0

}

// socket 信息
store.mutations.SET_AUTH_SOCKET = (state, socket) => {
  state.socket = socket;
}

// 获取socekt信息
store.mutations.SET_RESULT_SOCKET = (state, socket_info) => {
  state.result_socket = socket_info;
}

// 登出
store.mutations.LOGIN_OUT = (state, info) => {
  state.authState = {
    userId: '',
    city: '',
    country: '',
    createdAt: '',
    email: '',
    id: '',
    idCode: '',
    name: '',
    province: '',
    street: '',
    updatedAt: '',
    version: '',
    zipcode: ''
  }
  state.isLogin = false
}

/**
 * 屏幕响应式
 */
store.mutations.changeIsMobile = (state, data) => {
  state.isMobile = data
}

/**
 * 异步修改state
 * @type {{}}
 */
store.actions = {}

store.getters = {}


export default store
