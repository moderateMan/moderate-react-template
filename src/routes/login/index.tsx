import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Form, Input, Button, Select, Radio, Col, Row } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from "react-intl";
import styles from "./index.module.scss";
import { AnimateWrapper } from "@COMMON/components/animateWha";
import { ACCESS_TOKEN } from "@COMMON/constants";
import Storage from "@COMMON/storage";
import "./index.scss";
import openNotificationWithIcon from "@COMMON/utils/notification";
import FetchRequest from "@DATA_MANAGER/netTrans/myReuqest";
import { getPath } from "@ROUTES/index";
let gameFloag = 0;
const FormItem = Form.Item;
let isDev =
  process.env.NODE_ENV === "development" || process.env.ELECTRON === "electron";

type LoginProps = {
  [key: string]: any;
} & RouteComponentProps &
  WrappedComponentProps;
let Login: React.FC<LoginProps> = (props) => {
  const [codeImage, setCodeImage] = useState<string>("");
  const [isStart,setIsStart] = useState<boolean>(false)
  //验证码图片生成方法
  let textBecomeImg = (code: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 30;
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    const codeArr = code.split("");
    if (context) {
      for (let i = 0, l = codeArr.length; i < l; i++) {
        const deg = Math.random() - 0.5;
        const x = 10 + i * 20;
        const y = 20 + Math.random() * 8;
        context.font = "bold 24px arial";
        context.translate(x, y);
        context.rotate(deg);
        context.fillStyle = randomColor();
        context.fillText(codeArr[i], 0, 0);
        context.rotate(-deg);
        context.translate(-x, -y);
      }
      for (let i = 0; i <= 5; i++) {
        context.strokeStyle = randomColor();
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
        context.strokeStyle = randomColor();
        context.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
      }
    }
    return canvas.toDataURL("image/jpg");
  };
  let changeCodeImage = () => {
    const {
      intl: { formatMessage },
    } = props;
    FetchRequest.post("/getCode")
      .then((res: any) => {
        const { message } = res;
        if (res.code === "200") {
          setCodeImage(textBecomeImg(res.data));
        } else {
          openNotificationWithIcon("warning", message);
        }
      })
      .catch(() => {});
  };

  let randomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  function loadScript(moduleName:string, cb:()=>any) {
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

  let boot = () => {
    var settings = Reflect.get(window,"_CCSettings");
    Reflect.set(window,"_CCSettings",undefined)
    var onProgress:any = null;

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
  useEffect(() => {
    let token = Storage.getStorage(ACCESS_TOKEN);
    if (token) {
      return props.history.push(getPath("lightHome"));
    }
    changeCodeImage();
    if (isDev) {
      setIsStart(true)
      let gameRoot = document.getElementById("gameRoot");
      if(gameRoot){
        gameRoot.style.display = "block";
      }
      
      let self = this;
      let a = 1000;
      if (gameFloag === 0 && !document.getElementById("Cocos2dGameContainer")) {
        gameFloag = 1;
        loadScript("./web-mobile/src/settings.js", function () {
          {
            loadScript("./web-mobile/main.js", function () {
              {
                loadScript("./web-mobile/cocos2d-js.js", function () {
                  {
                    self.boot();
                  }
                });
              }
            });
          }
        });
      } else {
        cc.game.resume();
      }
      document.addEventListener("completeFromGame", (data) => {
        if (data.detail.status === 1) {
          this.setState({
            collapsed: false,
          });
        } else {
          this.setState({
            collapsed: true,
          });
        }
      });
    }
  }, []);
  return <div>login</div>;
};

Login = injectIntl(Login);
Login = inject("global")(Login);
Login = observer(Login);
export default Login;
