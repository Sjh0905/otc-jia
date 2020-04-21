export default function ($route, $event, $store, $http, $cookies) {
	$route.beforeEach(function (to, from, next) {
		// 要求登录查看
		// if (to.meta.requireLogin) {
		// 	// console.log("userId------"+$store.state.authMessage.userId);
		// 	// console.log('是否登录',$store.state.isLogin)
	  //     if (!$store.state.authMessage.userId) {
	  //       next('/index/SignPageLogin');
	  //       return
	  //     }
		// 	}
			let isLogin = $store.state.isLogin
			// console.log(isLogin,'aaa')
		// if(!isLogin){
		// 	window.location.replace('https://www.2020.exchange/index/sign/login');
		// 	next();
		// }
		next();
	})
}
