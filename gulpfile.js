const { series, parallel, watch } = require('gulp');
var del = require('del');
const watcher = watch(['src/docs/*.md']);
var browserSync = require('browser-sync').create();// 静态服务器

function test(cb) {
    browserSync.init({ proxy: "http://localhost:3000/login" });
    watcher.on('add', function (path, stats) {
        console.log(`File ${path} was changed`);
        browserSync.reload()
    });
}

function cleanGame(cb) {
    return del([
        'build/web-mobile',
        // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
    ]).then(() => {
        cb()
        process.exit();
    });
}

exports.default = cleanGame;