'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const fs = require('fs');
var bodyParser = require('body-parser')
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
var childProcess = require('child_process');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const semver = require('semver');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const getClientEnvironment = require('../config/env');
const react = require(require.resolve('react', { paths: [paths.appPath] }));

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;
var jsonParser = bodyParser.json()
// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log(
    `If this was unintentional, check that you haven't mistakenly set it in your shell.`
  );
  console.log(
    `Learn more here: ${chalk.yellow('https://cra.link/advanced-config')}`
  );
  console.log();
}

let getAll = function (level, dir) {
  let path = require('path');
  var filesNameArr = []
  let cur = 0
  // 用个hash队列保存每个目录的深度
  var mapDeep = {}
  mapDeep[dir] = 0
  // 先遍历一遍给其建立深度索引
  function getMap(dir, curIndex) {
    var files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
    files.map(function (file) {
      //var subPath = path.resolve(dir, file) //拼接为绝对路径
      var subPath = path.join(dir, file) //拼接为相对路径
      var stats = fs.statSync(subPath) //拿到文件信息对象
      // 必须过滤掉node_modules文件夹
      if (file != 'node_modules') {
        mapDeep[file] = curIndex + 1
        if (stats.isDirectory()) { //判断是否为文件夹类型
          return getMap(subPath, mapDeep[file]) //递归读取文件夹
        }
      }
    })
  }
  getMap(dir, mapDeep[dir])
  function readdirs(dir, folderName) {
    var result = { //构造文件夹数据
      path: dir,
      title: path.basename(dir),
      type: 'directory',
      deep: mapDeep[folderName]
    }
    var files = fs.readdirSync(dir) //同步拿到文件目录下的所有文件名
    result.children = files.map(function (file) {
      //var subPath = path.resolve(dir, file) //拼接为绝对路径
      var subPath = path.join(dir, file) //拼接为相对路径
      var stats = fs.statSync(subPath) //拿到文件信息对象
      if (stats.isDirectory()) { //判断是否为文件夹类型
        return readdirs(subPath, file, file) //递归读取文件夹
      }
      return { //构造文件数据
        path: subPath,
        name: file,
        type: 'file'
      }
    })
    return result //返回数据
  }
  filesNameArr.push(readdirs(dir, dir))
  fs.writeFile(paths.appSrc + '/docs/docsCongfig.json', JSON.stringify(filesNameArr), err => {
    if (err) throw err
    console.log('docsCongfig文件已被写入')
  })
  return filesNameArr
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;

    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
    const urls = prepareUrls(
      protocol,
      HOST,
      port,
      paths.publicUrlOrPath.slice(0, -1)
    );
    const devSocket = {
      warnings: warnings =>
        devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: errors =>
        devServer.sockWrite(devServer.sockets, 'errors', errors),
    };
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      tscCompileOnError,
      webpack,
    });
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(
      proxySetting,
      paths.appPublic,
      paths.publicUrlOrPath
    );
    // Serve webpack assets generated by the compiler over a web server.
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      if (env.raw.FAST_REFRESH && semver.lt(react.version, '16.10.0')) {
        console.log(
          chalk.yellow(
            `Fast Refresh requires React 16.10 or higher. You are using React ${react.version}.`
          )
        );
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
      //   childProcess.exec("gulp", function(error, stdout, stderr) {
      //     console.log("error:"+error);
      //     console.log("stdout:"+stdout);
      //     console.log("stderr:"+stderr);
      // });
    });

    devServer.app.post("/api/test", jsonParser, (req, res) => {
      // var spawn = require('child_process').spawn;
      // var child = spawn('git pull', [
      //   '-v', 'builds/pdf/book.html',
      //   '-o', 'builds/pdf/book.pdf'
      // ]);

      // child.stdout.on('data', function (chunk) {
      //   // output will be here in chunks
      // });

      // // or if you want to send output elsewhere
      // child.stdout.pipe(paths.appSrc+'/docs');
      let temp = req.body.data;
      const { remoteMenuData = [], localMenuData = [] } = temp;
      if (Array.isArray(remoteMenuData) && remoteMenuData.length) {
        fs.writeFile(paths.appSrc + '/routes/menuRemoteConfig.json', JSON.stringify(remoteMenuData), err => {
          if (err) throw err
          console.log('menuRemoteConfig文件已被写入')
        })
      }
      if (Array.isArray(localMenuData) && localMenuData.length) {
        fs.writeFile(paths.appSrc + '/routes/menuLocalConfig.json', JSON.stringify(localMenuData), err => {
          if (err) throw err
          console.log('menuLocalConfig文件已被写入')
        })
      }
    });

    devServer.app.post("/api/getMd", jsonParser, (req, res) => {
      res.json(getAll("", paths.appSrc + '/docs'))
    });


    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', function () {
        devServer.close();
        process.exit();
      });
    }
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
