import * as BusinessOrderData from "../MockData/BusinessOrderData";

const root = {}
root.name = 'BusinessOrderComplete'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
 'BasePageBar': resolve => require(['@/components/BasePageBar/BasePageBar.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
  	// loading
  	loading: true,
    // 分页
    maxPage: 1,
    selectIndex: 1,

    offset: 1,
    maxResults: 20,

    // 页面数据
    pageList: '',
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getPartPosterOrderList()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY.MM.DD hh:mm:ss')
}
// 获取进行中列表
root.methods.getPartPosterOrderList = function () {

  this.loading = true
  this.$http.send('GET_BUSINESS_ORDER_LIST',{
    query:{
      // binessUserId: this.userId,
      status: 3,//1 进行中 2 已取消 3 已完成
      offset: this.offset,
      maxResults: this.maxResults
    }
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      this.pageList = data.data;
      // console.log('orderLista',data)
      /*// data.dataMap.ctcOrderList.results = BusinessOrderData.getBusinessOrderData().dataMap.posterOrderList
      let pageList = data.dataMap.ctcOrderList.results
      let transactionsMap = data.dataMap.transactionsMap

      // console.log('orderList', data)

      for (let i = 0; i < pageList.length; i++) {
        pageList[i].deal = transactionsMap[pageList[i].id]
      }
      // console.log('获取的pageList数据',pageList)

      this.pageList = pageList
      this.maxPage = data.dataMap.ctcOrderList.page.totalPages*/
      this.loading = false
      // this.sectionPendingList = data.dataMap.posterOrderList
    }).catch((err) => {
    console.log('err', err)
  });
  return
}



// 切换页码
root.methods.clickChangePage = function (page) {
	this.selectIndex = page;
  this.offset = page
  if(this.offset<1){
    this.offset = 1
  }
  this.getPartPosterOrderList()
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



export default root
