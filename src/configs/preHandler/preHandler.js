import wss from '../../../static/js/Wsocekt'

export default async function ($http, $store, $cookie, $i18n) {

	// 检测登录状态
	// async function checkLogin () {
	// 	await $http.send('CHECK_LOGIN').then(({data}) => {
	// 		typeof(data) === 'string' && (data = JSON.stringify(data));
	// 		if (data.errorCode == 0) {
	// 			let res = data.dataMap.userProfile;
	// 			// commit 个人信息
	// 			$store.commit('SET_AUTH_MESSAGE', res);
	// 			// commit socket
	// 			let socket = data.dataMap.socket;
	// 			$store.commit('SET_AUTH_SOCKET', socket);
	// 			// 初始化socekt
	// 			INIT_SOCKET(socket);
	// 		}
	// 	}).catch((err)=>{
	// 		console.log(err)
	// 	})
	// }

	// 连接socket
	// function INIT_SOCKET (socket) {
	// 	let socket_url = socket.url + '?key=' + socket.data.key + '&unid=' + socket.data.unid + '&time=' + socket.data.time;
  //
	// 	wss.init({
	// 		url: socket_url // 后台接口地址
	// 	}).connect();
  //
	// 	wss.onmessage = function(message) {
	// 		let data = message.data;
	// 		// 如果断掉，需要重连上
	// 		if (!!data && JSON.parse(data).messageKey == 'close') {
	// 			checkLogin();
	// 		}
	// 		$store.commit('SET_RESULT_SOCKET', JSON.parse(data));
	// 	}
	// }

	// 获取服务器时间
	async function getServerTime() {
		await $http.send('GET_SEVER_TIME').then(({data})=>{
			typeof data === 'string' && (data = JSON.parse(data))
	    	$store.commit('SET_SERVER_TIME', data)
		}).catch((err) => {
			console.log(err)
		})
	}





	// await Promise.all([checkLogin(), getServerTime()]).then(res => {
  //   	// console.warn('')
  // 	})

  // do someThing
}
