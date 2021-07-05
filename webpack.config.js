const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

const dev = process.env.NODE_ENV === "development";

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: dev ? "[name].js" : "[name].[contenthash].js",
    path: resolve(__dirname, "dist"),
  },
  mode: dev ? "development" : "production",
  devtool: dev ? "inline-source-map" : false,
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "The Maze",
    }),
    new MiniCssExtractPlugin({
      filename: dev ? "[name].css" : "[name].[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "url-loader",
        options: {
          limit: 1024 * 8,
        },
      },
    ],
  },
  optimization: {
    minimizer: ["...", new CssMinimizerWebpackPlugin()],
  },
};
