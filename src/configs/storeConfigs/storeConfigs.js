const store = {}

store.state = {}

store.state.test = ''

store.state.lang = 'CH'

// 跳转域名
// store.state.domain_url = 'http://www.2020.exchange/';
store.state.domain_url = process.env.DOMAIN || 'http://www.2020-ex.com/'
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

store.state.account = null;


/**
 * 认证状态
 * sms: false,  手机
 * ga: false,   谷歌验证
 * identity: false, 身份认证
 * capital: false,  资金密码
 * email: false 邮箱
 * @type {null}
 */

store.state.authState = null

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
  state.authState = info
}

// 修改顶部usdt余额
store.mutations.SET_ACCOUNT = (state, info) => {
  state.account = info
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
  state.authMessage = {
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
