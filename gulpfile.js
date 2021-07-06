const { series, parallel, src, dest } = require("gulp");
var exec = require("child_process").exec;
var del = require("del");

function cleanGame(cb) {
  return del([
    "build/web-mobile",
    // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
  ]).then(() => {
    cb();
    process.exit();
  });
}

// 删除本地调试的引擎文件
function delDevCocosJs(cb) {
  return del(["build/web-mobile/cocos2d-js.js"]).then(() => {
    cb();
  });
}

// 拷贝发布版本的引擎文件
function copyProductCocosJs() {
  return src("src/assets/cocos2d-js.js").pipe(dest("build/web-mobile/"));
}

function end(cb) {
  cb();
  process.exit(0);
}

function cleanGame(cb) {
  return del([
    "build/web-mobile",
    // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
  ]).then(() => {
    cb();
    process.exit();
  });
}


function githubPull(cb) {
  let data = process.argv.slice(2);
  let type = data[1];
  let param = data[2];
  let branchTemp;
  if (type === "-b") {
    branchTemp = param;
  }
  return exec("git pull", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(err);
    cb(err);
  });
}

function giteePull(cb) {
  let data = process.argv.slice(2);
  let type = data[1];
  let param = data[2];
  let branchTemp;
  if (type === "-b") {
    branchTemp = param;
  }
  return exec(
    `git pull gitee ${branchTemp || "main"}`,
    function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    }
  );
}

// electron任务
exports.delDevCocosJs = delDevCocosJs;
// electron任务
exports.processGame = series(delDevCocosJs, copyProductCocosJs, end);
exports.pull = series(githubPull, giteePull, end);
// 正常打包的任务
exports.cleanGame = cleanGame;
