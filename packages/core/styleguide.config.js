const path = require("path");
const glob = require("glob");

const ReactDocgen = require("react-docgen");
const ReactDocgenTypescript = require("react-docgen-typescript");

const webpackConfig = require("./webpack.config.js");
const componentDir = path.resolve(__dirname, "src/components/**/*.tsx");
const tsConfigPath = path.resolve(__dirname, "../../tsconfig.json");
const moduleRegex = /\/[A-Z]\w*\.tsx$/;

module.exports = {
  title: "react-formbo",
  webpackConfig,
  components: () =>
    glob.sync(componentDir).filter(module => moduleRegex.test(module)),
  resolver: ReactDocgen.resolver.findAllComponentDefinitions,
  propsParser: ReactDocgenTypescript.withCustomConfig(tsConfigPath).parse
};
