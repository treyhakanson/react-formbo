const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entrypoint = path.resolve(__dirname, "./src/index.ts");
const outputDir = path.resolve(__dirname, "./dist");

module.exports = {
  mode: "development",
  entry: entrypoint,
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: outputDir
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
};
