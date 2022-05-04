import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import webpack from "webpack";

export const WEBPACK_CONFIG: webpack.Configuration = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    host: "0.0.0.0",
    historyApiFallback: true,
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: new RegExp("node_modules|server.ts"),
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: "asset/resource",
      // },
    ],
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  entry: ["./server.ts", "webpack-hot-middleware/client"],
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./web/index.html"),
      favicon: "./src/favicon/favicon.ico",
    }),
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin()
    // new webpack.DefinePlugin(buildConfig.environmentVariables),
    // new BundleAnalyzerPlugin(),
  ],
};
