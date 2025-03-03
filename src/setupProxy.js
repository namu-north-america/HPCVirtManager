const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/server",
    createProxyMiddleware({
      target: "http://15.235.45.17:8001",
      // target: "http://172.22.48.1:8001",
      //target: "http://127.0.0.1:8001",
      changeOrigin: true,
      pathRewrite: {
        "^/server": "", // remove /server prefix
      },
      timeout: 3000,
    })
  );
  app.use(
    "/server1",
    createProxyMiddleware({
      //  target: "http://15.157.153.228:8001",
      target: "http://15.235.45.17:30555",
      changeOrigin: true,
      pathRewrite: {
        "^/server1": "", // remove /server prefix
      },
      timeout: 3000,
    })
  );
};
