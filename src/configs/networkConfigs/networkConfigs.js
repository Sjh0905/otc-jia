const server = {}

// server.baseURL = 'http://192.168.2.192:8080'
// http://192.168.2.166:8080 欧
server.baseURL = '';
server.timeout = 15000
server.headers = {'X-Requested-With': 'XMLHttpRequest'}

// server.env = 'dev'   // 开发环境
// server.env = ''  // 生产环境
server.env = ''

export default server
