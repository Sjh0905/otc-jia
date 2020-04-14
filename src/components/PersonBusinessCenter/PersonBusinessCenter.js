const root = {}
root.name = 'PersonBusinessCenter'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  // 进行中
  'BusinessOrderConduct': resolve => require(['../BusinessOrderConduct/BusinessOrderConduct.vue'], resolve),
  // 已完成
  'BusinessOrderComplete': resolve => require(['../BusinessOrderComplete/BusinessOrderComplete.vue'], resolve),
  // 已撤单
  'BusinessOrderCannel': resolve => require(['../BusinessOrderCannel/BusinessOrderCannel.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    // 选中支付方式
    pay_type: false,
    // 订单页签
    order_tab: 1,
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
}
root.mounted = function () {
}
root.beforeDestroy = function () {
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.changeSelected = function () {
  // console.log(123)
}
// 切换页签
root.methods.ORDER_TAB = function (type) {
  this.order_tab = type;
}

export default root
