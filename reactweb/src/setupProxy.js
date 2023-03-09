const {createProxyMiddleware} = require('http-proxy-middleware')

// 로컬테스트에서만 사용되는 프록시임..
// 실제 운용서버에는 nginx 의 설정파일에서 프록시 설정을 해줘야함..
module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://localhost:5001/',
            changeOrigin: true,
            pathRewrite: { '^/api': '/' },   // api 부분을 삭제해주는것..
        }),
    );
};