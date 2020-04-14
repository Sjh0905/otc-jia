const Wsocket = {};

	Wsocket.config = {
		//链接地址
		url: '',
	};

	Wsocket.init=function(config) {
		this.config = config;
		return this;
	};

	/**
	 * 连接webcocket
	 */
	Wsocket.connect = function() {
		// var protocol = (window.location.protocol == 'http:') ? 'ws:' : 'wss:';//TODO:连接测试用这个
		var protocol = 'wss:';//TODO:连接生产用这个
		this.host = protocol + this.config.url;

		window.WebSocket = window.WebSocket || window.MozWebSocket;
		if(!window.WebSocket) { // 检测浏览器支持
			this.error('Error: WebSocket is not supported .');
			return;
		}
		this.socket = new WebSocket(this.host); // 创建连接并注册响应函数
		this.socket.onopen = function() {
			Wsocket.onopen();
		};
		this.socket.onmessage = function(message) {
			Wsocket.onmessage(message);
		};
		this.socket.onclose = function() {
			Wsocket.onclose();
			Wsocket.socket = null; // 清理
		};
		this.socket.onerror = function(errorMsg) {
			Wsocket.onerror(errorMsg);
		}
		return this;
	}

	/**
	 * 自定义异常函数
	 * @param {Object} errorMsg
	 */
	Wsocket.error = function(errorMsg) {
		this.onerror(errorMsg);
	}

	/**
	 * 消息发送
	 */
	Wsocket.send = function(message) {
		if(this.socket) {
			this.socket.send(message);
			return true;
		}
		this.error('please connect to the server first !!!');
		return false;
	}

	Wsocket.close = function() {
		if(this.socket != undefined && this.socket != null) {
			this.socket.close();
		} else {
			this.error("this socket is not available");
		}
	}

	/**
	 * 消息回調
	 * @param {Object} message
	 */
	Wsocket.onmessage = function(message) {

	}

	/**
	 * 链接回调函数
	 */
	Wsocket.onopen = function() {

	}

	/**
	 * 关闭回调
	 */
	Wsocket.onclose = function() {

	}

	/**
	 * 异常回调
	 */
	Wsocket.onerror = function() {

	}



export default Wsocket;



