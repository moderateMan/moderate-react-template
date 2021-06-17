const { series, parallel ,watch} = require('gulp');
const watcher = watch(['src/docs/*.md']);
var browserSync = require('browser-sync').create();// 静态服务器

// gulp.task('browser-sync', function() {
//     var files = [
//        'pages/*.html',
//        'css/*.css',
//        'js/*.js'
//     ];
//    browserSync.init({
//      server: { baseDir: "./" } 
//    });
// });// 代理
// gulp.task('browser-sync', function() {
//  browserSync.init({ proxy: "http://localhost:3000/login" });
// });//这个可以注释掉，不写也行。目前我还没有发现这个的用法
// gulp.task('default', function () {
//    gulp.watch([
//         './src/docs/*'
//    ], ['browser-sync']);
//  });
// gulp.task('default', ['browser-sync','watch']);

// function clean(cb) {
//     // body omitted
//     cb();
//   }
  
//   function css(cb) {
//     // body omitted
//     cb();
//   }
  
//   function javascript(cb) {
//     // body omitted
//     cb();
//   }

//   exports.build = series(clean, parallel(css, javascript));


function test(cb) {
    browserSync.init({ proxy: "http://localhost:3000/login" });
    watcher.on('add', function(path, stats) {
        console.log(`File ${path} was changed`);
        browserSync.reload()
   });}


  exports.default = test;