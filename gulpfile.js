const { series, parallel, src, dest } = require('gulp');
var del = require('del');

function cleanGame(cb) {
    return del([
        'build/web-mobile',
        // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
    ]).then(() => {
        cb()
        process.exit();
    });
}

// 删除本地调试的引擎文件
function delDevCocosJs(cb) {
    return del([
        'build/web-mobile/cocos2d-js.js',
    ]).then(() => {
        cb()
    });
}

// 拷贝发布版本的引擎文件
function copyProductCocosJs() {
    return src('src/assets/cocos2d-js.js').pipe(dest('build/web-mobile/'));
}

function end(cb) {
    cb();
    process.exit(0)
}


// electron任务
exports.delDevCocosJs = delDevCocosJs;
// electron任务
exports.processGame = series(delDevCocosJs,copyProductCocosJs, end);

// 正常打包的任务
exports.cleanGame = cleanGame;