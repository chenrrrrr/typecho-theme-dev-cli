// gulp-plugins
const gulp = require("gulp");
const { series, parallel } = require("gulp");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const inject = require("gulp-inject");
const babel = require("gulp-babel");
const browserify = require("gulp-browserify");
const less = require("gulp-less");
const LessAutoprefix = require("less-plugin-autoprefix");
const autoprefix = new LessAutoprefix({ browsers: ["last 2 versions"] });
const csso = require("gulp-csso");
const uglify = require("gulp-uglify");
const watch = require("gulp-watch");

// 发版配置文件
let config = require("./release-config");

// 基础路径
const SRC_LESS = "./less/main.less";
const SRC_JS = "./js/main.js";
const DIST_ROOT = "./dist" + config.release_version;
const DIST_CSS = DIST_ROOT + "/css";
const DIST_JS = DIST_ROOT + "/js";

// 环境
let env = config.env;

/**
 * 清除dir目录
 * @param {*} cb
 */
function cleanDir(cb) {
  return gulp.src(DIST_ROOT + "/*", { read: false }).pipe(clean());
  cb();
}

/**
 * less编译压缩css
 * @param {*} cb
 */
function c_less(cb) {
  return gulp
    .src(SRC_LESS)
    .pipe(
      less({
        plugins: [autoprefix]
      })
    )
    .pipe(csso())
    .pipe(
      rename({
        prefix: config.theme_name + "-",
        basename: `main-${config.release_version}`,
        extname: `.css`
      })
    )
    .pipe(gulp.dest(DIST_CSS));
  cb();
}

/**
 * js压缩混淆
 * @param {*} cb
 */
function c_js(cb) {
  return gulp
    .src(SRC_JS)
    .pipe(babel())
    .pipe(browserify({ transform: ["babelify"] }))
    .pipe(
      rename({
        prefix: config.theme_name + "-",
        basename: `main-${config.release_version}`,
        suffix: ".min",
        extname: ".js"
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(DIST_JS));
  cb();
}

/**
 * css插入php
 * @param {*} cb
 */
function css_php(cb) {
  var target = gulp.src("./header.php");
  var sources = gulp.src([
    DIST_ROOT +
      "/css/" +
      config.theme_name +
      "-" +
      "main-" +
      config.release_version +
      ".css"
  ]);
  return target
    .pipe(
      inject(sources, {
        starttag: "<!-- inject:typecho -->",
        transform: function(filePath) {
          let fileName;
          let htmlTagInphp;
          if (env === "prod") {
            fileName = filePath.split(`/dist${config.release_version}`)[1];
            htmlTagInphp = `<link rel="stylesheet" href="<?php $this->options->themeUrl('${fileName}'); ?>">`;
          } else if (env === "dev") {
            htmlTagInphp = `<link rel="stylesheet" href="<?php $this->options->themeUrl('${filePath}'); ?>">`;
          }
          return htmlTagInphp;
        }
      })
    )
    .pipe(gulp.dest(env === "prod" ? DIST_ROOT : "./"));
  cb();
}

/**
 * js插入footer.php
 * @param {*} cb
 */
function js_php(cb) {
  var target = gulp.src("./footer.php");
  var sources = gulp.src([
    DIST_ROOT +
      "/js/" +
      config.theme_name +
      "-" +
      "main-" +
      config.release_version +
      ".min" +
      ".js"
  ]);
  return target
    .pipe(
      inject(sources, {
        starttag: "<!-- inject:typecho -->",
        transform: function(filePath) {
          let fileName;
          let htmlTagInphp;
          if (env === "prod") {
            fileName = filePath.split(`/dist${config.release_version}`)[1];
            htmlTagInphp = `<script src="<?php $this->options->themeUrl('${fileName}'); ?>"></script>`;
          } else if (env === "dev") {
            htmlTagInphp = `<script src="<?php $this->options->themeUrl('${filePath}'); ?>"></script>`;
          }
          return htmlTagInphp;
        }
      })
    )
    .pipe(gulp.dest(env === "prod" ? DIST_ROOT : "./"));
  cb();
}

/**
 * 复制其余php文件到dist，排除footer.php和header.php
 * @param {*} cb
 */
function copy_php(cb) {
  return gulp
    .src(["./*.php", "!footer.php", "!header.php"])
    .pipe(gulp.dest(DIST_ROOT));
  cb();
}

/**
 * dev
 * @param {*} cb
 */
function dev(cb) {
  watch("./less/**/*.less", () => {
    c_less();
  });
  watch("./js/**/*.js", () => {
    c_js();
  });
  cb();
}

/**
 * 打包
 */
switch (env) {
  case "dev":
    exports.default = series(dev, parallel(c_less, c_js), css_php, js_php);
    break;
  case "prod":
    exports.default = series(
      cleanDir,
      parallel(c_less, c_js),
      css_php,
      js_php,
      copy_php
    );
    break;
  default:
    console.log(`环境变量配置错误`);
    break;
}
