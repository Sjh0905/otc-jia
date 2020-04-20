const root = {}
root.mode = 'history'
root.fallback = true
root.base = '/'

root.routes = []

// 404页面
root.routes.push({
  path:'*',
  redirect: '/index',
  meta: {
    requireLogin: false,
  },
  caseSensitive: true,
})

// 首页
// root.routes.push({
// 	path: '',
//   redirect: '/index/Transaction/TransactionBuy',
//   component: resolve => require(['@/components/IndexHome/IndexHome.vue'], resolve),
// })

root.routes.push({
  path: '/index',
  name: 'index',
  redirect: '/index/Transaction/TransactionBuy',
  component: resolve => require(['@/components/IndexHome/IndexHome.vue'], resolve),
  children: [
  	// 用户界面
  	{
      path: 'Transaction',
      name: 'Transaction',
      meta: {
      	requireLogin: false,
      },
      redirect: 'Transaction/TransactionBuy',
      component: resolve => require(['@/components/Transaction/Transaction.vue'], resolve),
      children: [
      	// 用户买入
      	{
      		path: 'TransactionBuy',
      		name: 'TransactionBuy',
      		meta: {
      			requireLogin: false,
      		},
      		component: resolve => require(['@/components/TransactionBuy/TransactionBuy.vue'], resolve),
      	},
      	// 用户卖出
      	{
      		path: 'TransactionSell',
      		name: 'TransactionSell',
      		meta: {
      			requireLogin: false,
      		},
      		component: resolve => require(['@/components/TransactionSell/TransactionSell.vue'], resolve),
      	}
      ]
    },
    // 订单
    {
    	path: 'Order',
    	name: 'Order',
    	redirect: 'Order/OrderConduct',
    	meta: {
	      	requireLogin: true,
      	},
      	component: resolve => require(['@/components/Order/Order.vue'], resolve),
      	children: [
      		// 进行中
      		{
	      		path: 'OrderConduct',
	      		name: 'OrderConduct',
	      		meta: {
	      			requireLogin: true,
	      		},
	      		component: resolve => require(['@/components/OrderConduct/OrderConduct.vue'], resolve),
	      	},
	      	// 已完成
	      	{
	      		path: 'OrderComplete',
	      		name: 'OrderComplete',
	      		meta: {
	      			requireLogin: true,
	      		},
	      		component: resolve => require(['@/components/OrderComplete/OrderComplete.vue'], resolve),
	      	},
	      	// 已取消
	      	{
	      		path: 'OrderCancel',
	      		name: 'OrderCancel',
	      		meta: {
	      			requireLogin: true,
	      		},
	      		component: resolve => require(['@/components/OrderCancel/OrderCancel.vue'], resolve),
	      	},
          // 其他
          {
            path: 'OrderOther',
            name: 'OrderOther',
            meta: {
              requireLogin: true,
            },
            component: resolve => require(['@/components/OrderOther/OrderOther.vue'], resolve),
          },
      	]
    },
    // 订单详情
    {
      path: 'Order/OrderDetails',
      name: 'OrderDetails',
      meta: {
        requireLogin: true,
      },
      component: resolve => require(['@/components/OrderDetails/OrderDetails.vue'], resolve),
    },

    {
    	path: 'PersonCenter',
    	name: 'PersonCenter',
    	redirect: 'PersonCenter/PaymentSet',
    	meta: {
	      	requireLogin: true,
      	},
      	component: resolve => require(['@/components/PersonCenter/PersonCenter.vue'], resolve),
      	children: [
      		// 个人中心-支付设置
		    {
		    	path: 'PaymentSet',
		    	name: 'PaymentSet',
		    	meta: {
			      	requireLogin: true,
		      	},
		      	component: resolve => require(['@/components/PaymentSet/PaymentSet.vue'], resolve),
		    },
		    // 个人中心-商户中心
		    {
		    	path: 'PersonBusinessCenter',
		    	name: 'PersonBusinessCenter',
		    	meta: {
			      	requireLogin: true,
		      	},
		      	component: resolve => require(['@/components/PersonBusinessCenter/PersonBusinessCenter.vue'], resolve),
		    },
      	]
    },
  	// 登录
    {
      path: 'SignPageLogin',
      name: 'SignPageLogin',
      meta: {
      	requireLogin: false,
      },
      component: resolve => require(['@/components/SignPageLogin/SignPageLogin.vue'], resolve),
    },
    // 注册
    {
      path: 'Register',
      name: 'Register',
      meta: {
      	requireLogin: false,
      },
      component: resolve => require(['@/components/Register/Register.vue'], resolve),
    },
    // 商家
    {
      path: 'Business',
      name: 'Business',
      redirect: 'Business/BusinessApplication',
      meta: {
        requireLogin: true,
      },
      component: resolve => require(['@/components/Business/Business.vue'], resolve),
      children: [
        // 商户申请
        {
          path: 'BusinessApplication',
          name: 'BusinessApplication',
          meta: {
            requireLogin: true,
          },
          component: resolve => require(['@/components/BusinessApplication/BusinessApplication.vue'], resolve),
        },
        // 商户中心
        {
          path: 'BusinessCenter',
          name: 'BusinessCenter',
          meta: {
            requireLogin: false,
          },
          component: resolve => require(['@/components/BusinessCenter/BusinessCenter.vue'], resolve),
        },
      ]
    },
    // 商家认证协议
    {

        path: 'MerchantsProtocol',
        name: 'MerchantsProtocol',
        meta: {
          requireLogin: false,
        },
        component: resolve => require(['@/components/MerchantsProtocol/MerchantsProtocol.vue'], resolve),

    }
  ]
})


export default root

