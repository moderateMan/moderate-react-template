import React from "react";
import { observer, inject } from "mobx-react";
import { Button } from "antd";
import { injectIntl,WrappedComponentProps } from "react-intl";
import styles from './index.module.scss'
import { AnimateWrapper } from "@COMMON/components/animateWha";
import { ACCESS_TOKEN } from "@COMMON/constants";
import Storage from "@COMMON/storage";
import "./index.scss";
import {openNotificationWithIcon,game} from "@COMMON/utils";
import FetchRequest from '@DATA_MANAGER/netTrans/myReuqest'
import { getPath } from "@ROUTES/index";
import dataMgrHoc from '@DATA_MANAGER/dataMgrHoc';

let isDev = true;
type PropsT = {
  [key:string]:any
}&WrappedComponentProps

type StateT = {
  [key:string]:any
}

class LoginPage extends React.Component<PropsT,StateT> {
  private isStart:boolean;
  constructor(props:PropsT) {
    super(props);
    this.isStart = false;
    this.state = {
      codeImage: "",
      collapsed: false
    };
    
  }

  //登录之后的回调
  loginCallback = () => {
    const {
      global: { loginFn },
    } = this.props;
    loginFn("123", "123", "aaaa", "zh").then(() => {
      this.props.history.push(getPath("intro"));
    });
  };

  componentWillUnmount() {
    if (isDev) {
      if (this.isStart) {
        document.getElementById("gameRoot")!.style.display = "none";
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
      return this.props.history.push(getPath("start"));
    }
    this.changeCodeImage();
    if (isDev) {
      this.isStart = true;
      game("hello");
      document.addEventListener("completeFromGame", (data:any) => {
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
      .then((res:any) => {
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
  textBecomeImg = (code:string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 30;
    const context = canvas.getContext("2d")!;
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
  /**
   * 组件render方法
   * @returns {*}
   * 获取props里表单的属性
   * 渲染antd组件，并放入对应的数据
   * 当有数据更改的时候，会重新render
   */
  render() {
    const {
      global: { locale, changeLocale },
      intl: { formatMessage },
    } = this.props;
    const { collapsed } = this.state;
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


export default dataMgrHoc("global")(injectIntl(LoginPage));
