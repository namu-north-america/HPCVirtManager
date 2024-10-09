const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/server",
    createProxyMiddleware({
      //  target: "http://15.157.153.228:8001",
      target: "http://52.156.107.111:8001",
      changeOrigin: true,
      pathRewrite: {
        "^/server": "", // remove /server prefix
      },
    })
  );
  app.use(
    "/server1",
    createProxyMiddleware({
      //  target: "http://15.157.153.228:8001",
      target: "http://52.156.107.111:8001",
      changeOrigin: true,
      pathRewrite: {
        "^/server1": "", // remove /server prefix
      },
    })
  );
};
