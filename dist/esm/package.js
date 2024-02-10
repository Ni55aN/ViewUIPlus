const name = "view-ui-plus-es";
const version = "1.3.16";
const title = "ViewUIPlus";
const description = "A high quality UI components Library with Vue.js 3";
const homepage = "http://www.iviewui.com";
const keywords = [
  "iview",
  "vue",
  "viewui",
  "viewuiplus",
  "vue.js",
  "component",
  "components",
  "ui",
  "framework"
];
const main = "dist/viewuiplus.min.js";
const exports = {
  ".": {
    types: "./types/index.d.ts",
    "import": "./dist/esm/index.js",
    require: "./dist/viewuiplus.min.js"
  },
  "./*": "./*.js",
  "./*.json": "./*.json"
};
const typings = "types/index.d.ts";
const files = [
  "dist",
  "src",
  "types"
];
const scripts = {
  dev: "vue-cli-service serve",
  build: "npm run build:prod && npm run build:esm && npm run build:style && npm run build:lang",
  "build:style": "gulp --gulpfile build/build-style.js",
  "build:prod": "vite build",
  "build:lang": "vite build --config build/vite.lang.config.js",
  "build:esm": "vite build --config build/vite.esm.config.js",
  lint: "vue-cli-service lint --fix"
};
const repository = {
  type: "git",
  url: "https://github.com/view-design/ViewUIPlus"
};
const author = "Aresn";
const license = "MIT";
const bugs = {
  url: "https://github.com/view-design/ViewUIPlus/issues"
};
const dependencies = {
  "async-validator": "^3.3.0",
  "countup.js": "^1.9.3",
  dayjs: "^1.11.0",
  deepmerge: "^2.2.1",
  "element-resize-detector": "^1.2.0",
  "js-calendar": "^1.2.3",
  "lodash.chunk": "^4.2.0",
  "lodash.throttle": "^4.1.1",
  numeral: "^2.0.6",
  "popper.js": "^1.14.6",
  select: "^1.1.2",
  tinycolor2: "^1.4.1",
  "v-click-outside-x": "^3.7.1"
};
const devDependencies = {
  "@vitejs/plugin-vue": "^1.9.3",
  "@vue/cli-plugin-babel": "~4.5.0",
  "@vue/cli-plugin-eslint": "~4.5.0",
  "@vue/cli-service": "~4.5.0",
  "@vue/compiler-sfc": "^3.0.0",
  "babel-eslint": "^10.1.0",
  "babel-plugin-import": "^1.13.3",
  chai: "^4.2.0",
  "copy-webpack-plugin": "^6.4.1",
  "cross-env": "^5.2.0",
  eslint: "^6.7.2",
  "eslint-plugin-vue": "^7.0.0-0",
  gulp: "^4.0.2",
  "gulp-autoprefixer": "^8.0.0",
  "gulp-clean-css": "^4.3.0",
  "gulp-less": "^4.0.1",
  "gulp-rename": "^2.0.0",
  karma: "^2.0.5",
  "karma-chrome-launcher": "^2.2.0",
  "karma-coverage": "^1.1.1",
  "karma-mocha": "^1.3.0",
  "karma-sinon-chai": "^1.3.3",
  "karma-sourcemap-loader": "^0.3.7",
  "karma-spec-reporter": "^0.0.32",
  "karma-webpack": "^2.0.13",
  less: "^2.7.3",
  "less-loader": "^4.1.0",
  "lint-staged": "^10.5.4",
  lolex: "^2.7.5",
  mocha: "^5.0.4",
  sinon: "^4.4.2",
  "sinon-chai": "^3.3.0",
  "style-loader": "^0.20.2",
  tslint: "^5.14.0",
  typescript: "^3.3.4000",
  "uglifyjs-webpack-plugin": "^1.3.0",
  "url-loader": "^1.1.2",
  vite: "^2.6.4",
  vue: "^3.2.47",
  "vue-hot-reload-api": "^2.3.4",
  "vue-html-loader": "^1.2.4",
  "vue-loader": "^17.0.0",
  "vue-router": "^4.0.14",
  "vue-style-loader": "^4.1.3",
  "vue-template-compiler": "^2.6.14"
};
var pkg = {
  name,
  version,
  title,
  description,
  homepage,
  keywords,
  main,
  exports,
  typings,
  files,
  scripts,
  repository,
  author,
  license,
  bugs,
  dependencies,
  devDependencies
};
export { author, bugs, pkg as default, dependencies, description, devDependencies, exports, files, homepage, keywords, license, main, name, repository, scripts, title, typings, version };