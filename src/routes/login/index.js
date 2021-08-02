import React from "react";
import { observer, inject } from "mobx-react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Select, Radio, Col, Row } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import styles from './index.module.scss'
import { CommonAnimateWha as AnimateWrapper} from "COMMON/components";
import { ACCESS_TOKEN } from "COMMON/constants";
import Storage from "COMMON/storage";
import "./index.scss";
import openNotificationWithIcon from "COMMON/utils/notification";
import FetchRequest from 'SRC/dataManager/netTrans/request'
import { getPath } from "ROUTES";
let gameFloag = 0;
const FormItem = Form.Item;
let isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON === 'electron';
@injectIntl
@inject("global")
@observer
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.isStart = false;
    this.state = {
      codeImage: "",
      collapsed: true
    };
  }
  /**
   * 登录提交的方法
   * @param e
   * 阻止表单默认提交
   * 获取表单的username字段
   * 获取表单的password字段
   * 设置请求数据
   * 根据数据发送请求
   * 如果请求成功
   * 缓存token
   * 路由跳转到console页
   * 如果请求失败
   * 弹出错误提示框，并给出错误信息
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      form: { validateFields },
      global: { loginFn },
    } = this.props;
    
    // validateFields({ force: true }, (error, values) => {
    //   if (!error) {
    //     const { username, password, code, language } = values;
    //     loginFn(username, password, code, language).then(() => {
    //       this.loginCallback()
    //     });
    //   }
    // });
   
  };

  //登录之后的回调
  loginCallback = () => {
    const {
      form: { validateFields },
      global: { loginFn },
    } = this.props;
    loginFn("123", "123", "aaaa", "zh").then(() => {
      this.props.history.push(getPath("intro"));
    });
  };

  componentWillUnmount() {
    if (isDev) {
      if (this.isStart) {
        document.getElementById("gameRoot").style.display = "none";
        cc.game.pause()
        this.isStart = false
      }
    }
  }
  /**
   * 组件挂载之后执行的方法
   * 显示提示信息
   */
  componentDidMount() {
    let token = Storage.getStorage(ACCESS_TOKEN);
    if (token) {
      return this.props.history.push(getPath("lightHome"));
    }
    this.changeCodeImage();
    if (isDev) {
      this.isStart = true;
      // document.getElementById("GameCanvas").style.width = `${document.documentElement.clientWidth - 278
      //   }px`;

      document.getElementById("gameRoot").style.display = "block";
      function loadScript(moduleName, cb) {
        function scriptLoaded() {
          document.body.removeChild(domScript);
          domScript.removeEventListener("load", scriptLoaded, false);
          cb && cb();
        }
        var domScript = document.createElement("script");
        domScript.async = true;
        domScript.src = moduleName;
        domScript.addEventListener("load", scriptLoaded, false);
        document.body.appendChild(domScript);
      }
      let self = this;
      let a = 1000;
      if (
        gameFloag === 0 &&
        !document.getElementById("Cocos2dGameContainer")
      ) {
        gameFloag = 1;
        loadScript(
          "./web-mobile/src/settings.js",
          function () {
            {
              loadScript(
                "./web-mobile/main.js",
                function () {
                  {
                    loadScript(
                      "./web-mobile/cocos2d-js.js",
                      function () {
                        {
                          self.boot();
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        cc.game.resume()
      }
      document.addEventListener("completeFromGame", (data) => {
        if (data.detail.status === 1) {
          this.setState({
            collapsed: false
          })
        } else {
          this.setState({
            collapsed: true
          })
        }

      })
    }

  }

  changeCodeImage = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    FetchRequest.post("/getCode")
      .then((res) => {
        const { message } = res;
        if (res.code === "200") {
          this.setState({
            codeImage: this.textBecomeImg(res.data),
          });
        } else {
          openNotificationWithIcon("warning", message);
        }
      })
      .catch(() => {
      });
  };

  //验证码图片生成方法
  textBecomeImg = (code) => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 30;
    const context = canvas.getContext("2d");
    const codeArr = code.split("");
    for (let i = 0, l = codeArr.length; i < l; i++) {
      const deg = Math.random() - 0.5;
      const x = 10 + i * 20;
      const y = 20 + Math.random() * 8;
      context.font = "bold 24px arial";
      context.translate(x, y);
      context.rotate(deg);
      context.fillStyle = this.randomColor();
      context.fillText(codeArr[i], 0, 0);
      context.rotate(-deg);
      context.translate(-x, -y);
    }
    for (let i = 0; i <= 5; i++) {
      context.strokeStyle = this.randomColor();
      context.beginPath();
      context.moveTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      context.lineTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      context.stroke();
    }
    for (let i = 0; i <= 30; i++) {
      context.strokeStyle = this.randomColor();
      context.beginPath();
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }
    return canvas.toDataURL("image/jpg");
  };

  randomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  boot = () => {
    let self = this;
    var settings = window._CCSettings;
    window._CCSettings = undefined;
    var onProgress = null;

    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;
    function setLoadingDisplay() {
      // // // Loading splash scene
      var gameRoot = document.getElementById("gameRoot");
      var splash = document.getElementById("splash");
      var progressBar = splash.querySelector(".progress-bar span");
      onProgress = function (finish, total) {
        var percent = (100 * finish) / total;
        if (progressBar) {
          progressBar.style.width = percent.toFixed(2) + "%";
        }
      };
      // splash.style.display = "block";
      // progressBar.style.width = "0%";
      cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        // gameRoot.style.display = "block";
        splash.style.display = "none";
      });
    }

    var onStart = function () {
      cc.view.enableRetina(true);
      cc.view.resizeWithBrowserSize(true);

      if (cc.sys.isBrowser) {
        setLoadingDisplay();
      }

      if (cc.sys.isMobile) {
        if (settings.orientation === "landscape") {
          cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        } else if (settings.orientation === "portrait") {
          cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        }
        cc.view.enableAutoFullScreen(
          [
            cc.sys.BROWSER_TYPE_BAIDU,
            cc.sys.BROWSER_TYPE_BAIDU_APP,
            cc.sys.BROWSER_TYPE_WECHAT,
            cc.sys.BROWSER_TYPE_MOBILE_QQ,
            cc.sys.BROWSER_TYPE_MIUI,
            cc.sys.BROWSER_TYPE_HUAWEI,
            cc.sys.BROWSER_TYPE_UC,
          ].indexOf(cc.sys.browserType) < 0
        );
      }

      // Limit downloading max concurrent task to 2,
      // more tasks simultaneously may cause performance draw back on some android system / browsers.
      // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
      if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
        cc.assetManager.downloader.maxConcurrency = 2;
        cc.assetManager.downloader.maxRequestsPerFrame = 2;
      }

      var launchScene = settings.launchScene;
      var bundle = cc.assetManager.bundles.find(function (b) {
        return b.getSceneInfo(launchScene);
      });

      bundle.loadScene(
        launchScene,
        null,
        onProgress,
        function (err, scene) {
          if (!err) {
            cc.director.runSceneImmediate(scene);
            if (cc.sys.isBrowser) {
              // show canvas
              var canvas = document.getElementById("GameCanvas");
              canvas && (canvas.style.visibility = "");
              var div = document.getElementById("GameDiv");
              if (div) {
                div.style.backgroundImage = "";
              }
              console.log(
                "Success to load scene: " + launchScene
              );
            }
          }
        }
      );
    };

    var option = {
      id: "GameCanvas",
      debugMode: settings.debug
        ? cc.debug.DebugMode.INFO
        : cc.debug.DebugMode.ERROR,
      showFPS: settings.debug,
      frameRate: 60,
      groupList: settings.groupList,
      collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({
      bundleVers: settings.bundleVers,
      remoteBundles: settings.remoteBundles,
      server: settings.server,
    });

    var bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;
    function cb(err) {
      if (err) return console.error(err.message, err.stack);
      count++;
      if (count === bundleRoot.length + 1) {
        cc.assetManager.loadBundle(MAIN, function (err) {
          if (!err) cc.game.run(option, onStart);
        });
      }
    }

    cc.assetManager.loadScript(
      settings.jsList.map(function (x) {
        return "src/" + x;
      }),
      cb
    );

    for (var i = 0; i < bundleRoot.length; i++) {
      cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
  };
  /**
   * 组件render方法
   * @returns {*}
   * 获取props里表单的属性
   * 渲染antd组件，并放入对应的数据
   * 当有数据更改的时候，会重新render
   */
  render() {
    const {
      form: { getFieldDecorator },
      global: { locale, changeLocale },
      intl: { formatMessage },
    } = this.props;
    const { codeImage, collapsed } = this.state;
    const usernamePlaceholder = formatMessage({ id: "login.username" });
    const usernameEmpty = formatMessage({ id: "login.usernameEmpty" });
    const passwordPlaceholder = formatMessage({ id: "login.password" });
    const passwordEmpty = formatMessage({ id: "login.passwordEmpty" });
    const codePlaceholder = formatMessage({ id: "login.code" });
    const maxLength = formatMessage({ id: "login.maxLength" });
    const pwdMaxLength = formatMessage({ id: "header_pwdMaxLength" });
    const codeEmpty = formatMessage({ id: "login.codeEmpty" });
    return (
      <div className="loginpagewrap">
        <div className="box">
          {<AnimateWrapper className={styles.logoFade}
            toggleClass={styles.logoShow}
            action={collapsed}><div className={styles.logoE}></div></AnimateWrapper>}
          {<AnimateWrapper className={styles.fade}
            toggleClass={styles.show}
            action={collapsed}>Moderate</AnimateWrapper>}
        </div>
        {<AnimateWrapper className={styles.fade}
          toggleClass={styles.show}
          action={collapsed}> <Button shape='round' type="primary" onClick={this.loginCallback} className="loginBtn">
            开始吧
          </Button></AnimateWrapper>}

      </div>
    );
  }
}

const Login = Form.create()(LoginPage);

export default Login;
