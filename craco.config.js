module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const rules = webpackConfig.module.rules;
      const { oneOf } = rules[rules.length - 1];
      oneOf[oneOf.length - 1].exclude.push(/\.ya?ml$/);

      webpackConfig.module.rules.unshift({
        test: /\.ya?ml$/,
        loader: "raw-loader",
      });

      webpackConfig.module.rules[1].exclude = [webpackConfig.module.rules[1].exclude, /node_modules\/monaco-yaml/];

      return webpackConfig;
    },
  },
};
