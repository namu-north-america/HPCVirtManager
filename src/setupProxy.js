const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/server",
    createProxyMiddleware({
      target: "http://15.157.153.228:8001",
      changeOrigin: true,
      pathRewrite: {
        "^/server": "", // Remove '/server' from the request URL
      },
    })
  );
};
