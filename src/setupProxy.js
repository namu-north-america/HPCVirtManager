const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/server",
    createProxyMiddleware({
    //  target: "http://15.157.153.228:8001",
    target: "http://127.0.0.1:8080",
      changeOrigin: true,
      pathRewrite: {
        "^/server": "", // remove /server prefix
      },
    })
  );
};
