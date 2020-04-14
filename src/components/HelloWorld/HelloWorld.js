const root = {}
root.name = 'HelloWorld'


/*------------------------------- 组件 -------------------------------*/
root.components = {
  'testComponent': resolve => require(['../vue/HelloWorld'], resolve),
}
/*------------------------------- data -------------------------------*/


root.data = function () {
  return {
    msg: 'Welcome to Your Vue.js App'
  }
}


/*------------------------------- 计算 -------------------------------*/
root.computed = {}


/*------------------------------- 观察 -------------------------------*/
root.watch = {}


/*------------------------------- 生命周期 -------------------------------*/
root.created = function () {
  // this.testNetwork()
  // this.testSocket()
}

root.mounted = function () {

}

root.beforeDestroy = function () {

}

/*------------------------------- 方法 -------------------------------*/
root.methods = {}

root.methods.aNetwork = function () {
  this.$http.send('TEST_A_COOKIES').then(({data}) => {
    console.warn('a 请求返回的结果', data)

  }).catch((err) => {
    console.warn('a 请求出错', err)
  })
}

root.methods.bNetwork = function () {
  this.$http.send('TEST_B_COOKIES').then(({data}) => {
    console.warn('b 请求返回的结果', data)

  }).catch((err) => {
    console.warn('b 请求出错', err)
  })
}

root.methods.click_aNetwork = function () {
  this.aNetwork()
}

root.methods.click_bNetwork = function () {
  this.bNetwork()
}


export default root
