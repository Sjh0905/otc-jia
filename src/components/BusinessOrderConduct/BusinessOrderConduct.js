import * as BusinessOrderData from '../MockData/BusinessOrderData'
const root = {}
root.name = 'BusinessOrderConduct'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'BasePageBar': resolve => require(['@/components/BasePageBar/BasePageBar.vue'], resolve),
  // 弹框提示
  'PopupPrompt': resolve => require(['../PopupPrompt/PopupPrompt.vue'], resolve),
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

    // list
    pageList: '',


    // 撤销弹框

    itemContainer: '',

    cancelBuyBoxFlag: false,


    popOpen: false,
    popType: 0,
    popText: '',


    ajaxFlag: false,
    // 判断socket
    isSocket:true
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 临时loading

  this.getPartPosterOrderList()

  this.$eventBus.listen(this, 'SET_BUSINESS_ORDER_SUCCESS', this.getPartPosterOrderList);

}
root.mounted = function () {
}
root.beforeDestroy = function () {
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

root.computed.userId = function () {
  return this.$store.state.authState.userId
}

// socket推过来的值
root.computed.result_socket = function () {
  return this.$store.state.result_socket;
}

root.watch = {}

root.watch.result_socket = function (newValue, oldValue) {
  // let user_id = newValue.data.userId;
  // if (user_id != this.userId || newValue.key != 'cancelPostersOrder') return;
  // // console.log('watchSocket', newValue)
  // if (newValue.data.result == 0) {
  //   this.popOpen = true
  //   this.popType = 1
  //   this.popText = '撤单成功'
  //   this.cancelBuyBoxFlag = false
  //   this.ajaxFlag = false
  //   this.getPartPosterOrderList()
  //   this.isSocket = false
  //   this.st = setTimeout(()=>{
  //   this.$router.go(0)},2000)
  //   return
  // }
  // if (newValue.data.result != 0) {
  //   this.popOpen = true;
  //   this.popType = 0
  //   this.popText = newValue.data.message;
  //   this.ajaxFlag = false
  //   this.st = setTimeout(()=>{
  //   this.$router.go(0)},2000)
  // }
}


/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY.MM.DD hh:mm:ss')
}

// 获取进行中列表
root.methods.getPartPosterOrderList = function () {

  this.loading = true
  this.$http.send('GET_BUSINESS_ORDER_LIST', {
    query: {
      // binessUserId: this.userId,
      status: 1,//1 进行中 2 已取消 3 已完成
      offset: this.offset,
      maxResults: this.maxResults
    }
  })
    .then(({data}) => {
      // console.log('dataaaa',data)
      if(typeof data === 'string'){
        data = JSON.parse(data)
      }
      this.pageList = data.data
      // data.dataMap.ctcOrderList.results = BusinessOrderData.getBusinessOrderData().dataMap.posterOrderList
      /*if (data.dataMap.ctcOrderList.results.length === 0 && data.dataMap.ctcOrderList.page.totalItems != 0) {
        this.offset = this.accMinus(this.offset, 1)
        this.getPartPosterOrderList()
        return
      }


      let pageList = data.dataMap.ctcOrderList.results
      let transactionsMap = data.dataMap.transactionsMap
      let lockMap = data.dataMap.lockMap

      for (let i = 0; i < pageList.length; i++) {
        pageList[i].deal = transactionsMap[pageList[i].id]
        pageList[i].locking = lockMap[pageList[i].id]
      }

      this.pageList = pageList
      this.maxPage = data.dataMap.ctcOrderList.page.totalPages*/
      this.loading = false
    }).catch((err) => {
      console.log('err', err)
  });
  return
}

root.methods.openCancelBox = function (item) {

  let frozenVolume = item.frozenVolume;//冻结数量

  if(frozenVolume > 0){
    this.popOpen = true
    this.popType = 0
    this.popText = '存在未完成订单,无法撤单'
    return
  }
  /*let volume = item.volume;//全部数量
  let tradingVolume = item.tradingVolume;//已成交数量
  let feeRate = item.feeRate || 0.001;//费率
  let feeAccuracy = ((feeRate || '.') + '').split('.')[1].length//和''拼接的目的是变成字符串

  //可撤回数量 = 全部数量 - 成交数量 * (1+费率)
  let withdrawable = this.accMinus(volume,
    this.accMul(tradingVolume,this.accAdd(1,feeRate))
  )

  item.withdrawable =this.toFixed(withdrawable,(feeAccuracy || 0)+2)*/
  this.itemContainer = item

  // console.log('itemContainer', this.itemContainer)
  this.cancelBuyBoxFlag = true
  // window.reload()
}

root.methods.closeCancelBox = function () {
  this.cancelBuyBoxFlag = false
}

root.methods.cancelPosterOrder = function () {

}
root.inject=['reload']
root.methods.submitCancelPosterOrder = function () {
  if(this.ajaxFlag === true) {
    return
  }
  this.ajaxFlag = true
  this.$http.send('CANCEL_POSTER_ORDER', {
    params: {
      id: this.itemContainer.id,
    }
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      this.cancelBuyBoxFlag = true

      if (data.result === 'FAIL' || data.code) {
        // 1015 未找到相关广告单
        // 1033 用户正在下单无法撤单
        // 1036 存在未完成订单,无法下架
        // 1034 广告下架失败
        switch (data.code) {
          case 1015://未找到相关广告单
            this.popOpen = true
            this.popType = 0
            this.popText = '未找到相关广告单'
            break;
          case 1033://用户正在下单无法撤单
            this.popOpen = true
            this.popType = 0
            this.popText = '用户正在下单无法撤单'
            break;
          case 1036://存在未完成订单,无法下架
            this.popOpen = true
            this.popType = 0
            this.popText = '存在未完成订单,无法撤单'
            break;
          case 1034://广告下架失败
            this.popOpen = true
            this.popType = 0
            this.popText = '撤单失败'
            break;
        }
        return
      }

      this.popOpen = true
      this.popType = 1
      this.popText = '已提交'
      this.cancelBuyBoxFlag = false
      // window.location.reload()
      this.st = setTimeout(()=>{
      // if(this.isSocket){
      this.$router.go(0)
      // }
      },1000)
    }).catch((err) => {
    console.log('err', err)
    this.cancelBuyBoxFlag = false
  });

  return
}


// 切换页码
root.methods.clickChangePage = function (page) {
  this.selectIndex = page;
  this.offset = page
  if (this.offset * 1 < 1) {
    this.offset = 1
  }
  this.getPartPosterOrderList()
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

export default root
