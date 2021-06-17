window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Notification: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "02039ZP/URBDqOEAyLdcYUn", "Notification");
    "use strict";
    window.GameEvent = {
      GOAL_BULLET: "GOAL_BULLET"
    };
    window.Notification = {
      _eventMap: [],
      on: function on(type, callback, target) {
        void 0 === this._eventMap[type] && (this._eventMap[type] = []);
        this._eventMap[type].push({
          callback: callback,
          target: target,
          isonce: false
        });
      },
      once: function once(type, callback, target) {
        void 0 === this._eventMap[type] && (this._eventMap[type] = []);
        this._eventMap[type].push({
          callback: callback,
          target: target,
          isonce: true
        });
      },
      emit: function emit(type, parameter) {
        var array = this._eventMap[type];
        if (void 0 === array) return;
        for (var i = 0; i < array.length; i++) {
          var element = array[i];
          if (element) {
            element.callback.call(element.target, parameter);
            element.isonce && this.off(type, element.callback);
          }
        }
      },
      off: function off(type, callback) {
        var array = this._eventMap[type];
        if (void 0 === array) return;
        for (var i = 0; i < array.length; i++) {
          var element = array[i];
          if (element && element.callback === callback) {
            array[i] = void 0;
            break;
          }
        }
      },
      offType: function offType(type) {
        this._eventMap[type] = void 0;
      }
    };
    cc._RF.pop();
  }, {} ],
  WxSDKAPI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "626f7o9XLJDiqOlE6hzMVSP", "WxSDKAPI");
    "use strict";
    var _this4 = void 0;
    var WxSDKAPI = cc.Class({
      ctor: function ctor() {
        this._videoCall = null;
        this._video = null;
        this.btnNode = null;
        this._bannerAd = null;
      },
      cloudInit: function cloudInit() {
        wx.cloud.init();
      },
      init: function init(btnNode, startCallF) {
        var _this = this;
        this.btnNode = btnNode;
        wx.loadSubpackage({
          name: "subRes",
          success: function success(res) {
            g_Log("yse!!!");
            window.boot();
          },
          fail: function fail(res) {}
        });
        wx.showShareMenu({
          withShareTicket: true
        });
        wx.updateShareMenu({
          withShareTicket: true
        });
        wx.onShareAppMessage(function() {
          var shareVo = {
            imgType: 1,
            text: "\u6709\u4eba@\u6211 \u70b9\u6211\u5c31\u80fd\u559c\u63d0\u540e\u5bab\u4f73\u4e3d\u4e09\u5343\u4eba\uff01",
            imgName: "https://minigame-cdn.binglue.com/gameHGRYZ/1.jpg"
          };
          return {
            title: shareVo.text,
            imageUrl: shareVo.imgURL
          };
        });
        this.onAppOpen();
        wx.getSystemInfo({
          success: function success(res) {
            g_Log("\u521b\u5efa\u767b\u9646\u6309\u94ae");
            _this.createAuthorizeBtn(startCallF);
          }
        });
      },
      onAppOpen: function onAppOpen() {
        wx.onShow(function(res) {
          g_Log("onshow data" + res.query);
        });
        wx.onHide(function() {});
      },
      updateApp: function updateApp() {
        var updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          g_Log("\u8bf7\u6c42\u5b8c\u65b0\u7248\u672c\u4fe1\u606f\u7684\u56de\u8c03", res.hasUpdate);
        });
        updateManager.onUpdateReady(function() {
          wx.showModal({
            title: "\u66f4\u65b0\u63d0\u793a",
            content: "\u65b0\u7248\u672c\u5df2\u7ecf\u51c6\u5907\u597d\uff0c\u662f\u5426\u91cd\u542f\u5e94\u7528\uff1f",
            success: function success(res) {
              res.confirm && updateManager.applyUpdate();
            }
          });
        });
        updateManager.onUpdateFailed(function() {
          g_Log("\u65b0\u7684\u7248\u672c\u4e0b\u8f7d\u5931\u8d25");
        });
      },
      createAuthorizeBtn: function createAuthorizeBtn(callFunc) {
        void 0 === callFunc && (callFunc = function callFunc() {
          g_Log("\u672a\u914d\u7f6e\u56de\u8c03");
        });
        var btnSize = cc.size(this.btnNode.width + 10, this.btnNode.height + 10);
        var frameSize = cc.view.getFrameSize();
        var winSize = cc.director.getWinSize();
        var left = (.5 * winSize.width + this.btnNode.x - .5 * btnSize.width) / winSize.width * frameSize.width;
        var top = (.5 * winSize.height - this.btnNode.y - .5 * btnSize.height) / winSize.height * frameSize.height;
        var width = btnSize.width / winSize.width * frameSize.width;
        var height = btnSize.height / winSize.height * frameSize.height;
        g_Log("left" + left);
        var self = this;
        self.btnAuthorize = wx.createUserInfoButton({
          type: "text",
          text: "",
          style: {
            left: left,
            top: top,
            width: width,
            height: height,
            lineHeight: 0,
            textAlign: "center",
            fontSize: 16,
            borderRadius: 4
          }
        });
        self.btnAuthorize.onTap(function(uinfo) {
          self.btnAuthorize.hide();
          self.btnAuthorize.destroy();
          self.reLogin(callFunc);
        });
      },
      reLogin: function reLogin(callFunc) {
        g_Log("\u7528\u6237\u767b\u5f55");
        this.getOpenId();
        wx.getSetting({
          success: function success(res) {
            var authSetting = res.authSetting;
            if (true === authSetting["scope.userInfo"]) {
              g_Log("\u5df2\u7ecf\u6388\u6743");
              callFunc();
            } else {
              g_Log("\u62d2\u7edd\u6388\u6743");
              self.createAuthorizeBtn(callFunc);
            }
          }
        });
      },
      getUserInfo: function getUserInfo(callBack) {
        void 0 === callBack && (callBack = function callBack(res) {
          g_Log("\u6ca1\u8bbe\u7f6e\u56de\u8c03\u51fd\u6570");
        });
        wx.getUserInfo({
          success: function success(res) {
            Object.assign(g_UserData, res.userInfo);
            callBack(res);
          }
        });
      },
      login: function login(code) {
        if (DEBUG) {
          window.g_openId = Date.now();
          g_GAME.serverMgr.send_login({
            code: code,
            testID: g_openId
          });
        } else g_GAME.serverMgr.send_login({
          code: code
        });
      },
      getOpenId: function getOpenId() {
        var _this2 = this;
        DEBUG ? this.login("debug") : wx.login({
          success: function success(res) {
            if (res.code) {
              g_Log("res.code!" + res.code);
              _this2.login(res.code);
            }
          }
        });
      },
      showBannerAdvertisement: function showBannerAdvertisement(id, width, callBack) {
        if ("" == id) return;
        this._bannerAd = wx.createBannerAd({
          adUnitId: id,
          style: {
            left: 0,
            top: 0,
            width: width,
            height: 0
          }
        });
        this._bannerAd.onError(function(err) {
          g_Log("banner \u5e7f\u544a\u52a0\u8f7d\u5931\u8d25", err);
        });
        this._bannerAd.onLoad(function() {});
        this._bannerAd.show();
        return this._bannerAd;
      },
      closeBannerAdvertisement: function closeBannerAdvertisement() {
        if (this._bannerAd) {
          this._bannerAd.destory();
          this._bannerAd = null;
        }
      },
      share: function share(shareVo) {
        wx.shareAppMessage({
          title: shareVo.text,
          imageUrl: shareVo.imgURL,
          query: shareVo.query
        });
      },
      showVideoAdvertisement: function showVideoAdvertisement(id, callBack) {
        var _this3 = this;
        if (this._video && this._videoCall) {
          g_Log("remove pre video!!!");
          this._video.offLoad(this.onVideoLoad);
          this._video.offError(this.onVideoError);
          this._video.offClose(this.onVideoClose);
          this._videoCall = null;
          this._video = null;
        }
        this._videoCall = callBack;
        this._video = wx.createRewardedVideoAd({
          adUnitId: id
        });
        this._video.onLoad(this.onVideoLoad);
        this._video.onError(this.onVideoError);
        this._video.onClose(this.onVideoClose);
        this._video.show()["catch"](function(err) {
          g_Log("\u6fc0\u52b1\u89c6\u9891\u5f02\u5e38~~~", err);
          _this3._video.load().then(function() {
            return _this3._video.show();
          });
        });
      },
      onVideoLoad: function onVideoLoad() {},
      onVideoError: function onVideoError() {
        g_Log("\u6fc0\u52b1\u89c6\u9891\u51fa\u73b0\u95ee\u9898");
        _this4._videoCall(false, "error");
      },
      onVideoClose: function onVideoClose(res) {
        var isEnd = false;
        isEnd = !!(res && res.isEnded || void 0 === res);
        _this4._videoCall(isEnd, "normal");
      },
      inviteFriend: function inviteFriend(data) {
        var roomId = data.roomId;
        g_Log("\u9080\u8bf7\u73a9\u5bb6\u8fdb\u5165roomId" + roomId);
        wx.shareAppMessage({
          title: "\u6d4b\u8bd5\u623f\u95f4\u5206\u4eab",
          query: "roomId=" + roomId + "&avatarUrl" + g_UserData.avatarUrl
        });
      },
      setUserIcon: function setUserIcon(avatar, imgSp) {
        var image = wx.createImage();
        image.onload = function() {
          var texture = new cc.Texture2D();
          texture.width = 40;
          texture.height = 40;
          texture.initWithElement(image);
          texture.handleLoadedTexture();
          imgSp.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = avatar;
      },
      getLaunchOptionsSync: function getLaunchOptionsSync() {
        return wx.getLaunchOptionsSync();
      }
    });
    module.exports = WxSDKAPI;
    cc._RF.pop();
  }, {} ],
  ballLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "048dfh37HpHfLZZHBxQfcvu", "ballLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ball: cc.Node,
        m_UseBtn: cc.Node,
        m_BtnArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.m_tarBallId = 0;
      },
      onLoad: function onLoad() {
        this.m_Ball = this.m_Ball.getComponent("ball");
        this.m_Ball.setCtr(this);
      },
      onEnable: function onEnable() {
        cc.director.getPhysicsManager().gravity = cc.v2(0, -500);
      },
      start: function start() {
        this.updateLayer();
      },
      updateLayer: function updateLayer() {
        this.m_BtnArr.forEach(function(item, key) {
          item.getChildByName("name").getComponent(cc.Label).string = BALL.name[key];
        });
      },
      onBtnClick: function onBtnClick(event, data) {
        data == this.m_tarBallId ? this.m_UseBtn.active = false : this.m_UseBtn.active = true;
        this.m_Ball.switchBall(data);
      },
      onBtnUseBall: function onBtnUseBall() {
        var _this = this;
        this.m_tarBallId = this.m_Ball.m_BallId;
        GAME_DATA.ballId = this.m_tarBallId;
        this.m_BtnArr.forEach(function(item, key) {
          var labelNode = item.getChildByName("label");
          key == _this.m_tarBallId ? labelNode.active = true : labelNode.active = false;
        });
        this.m_UseBtn.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  ball_bullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f3a80n0E2NFyrvNyKNUhWD2", "ball_bullet");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_test: cc.Node
      },
      start: function start() {},
      onBeginContact: function onBeginContact(contact, self, other) {
        if ("bottom" == other.node.name) {
          var body = self.node.getComponent(cc.RigidBody);
          var worldCenter = body.getWorldCenter();
          body.applyLinearImpulse(cc.v2(-1e3, 0), worldCenter);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ball: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a47cc0J1VFKFLtLoZoGNPJs", "ball");
    "use strict";
    var _cc$Class;
    cc.Class((_cc$Class = {
      extends: cc.Component,
      properties: {
        m_FireShow: cc.Node,
        m_BallArr: {
          type: cc.Node,
          default: []
        },
        m_BallId: {
          get: function get() {
            return this._BallId;
          },
          set: function set(value) {
            this._BallId = value;
          }
        }
      },
      ctor: function ctor() {
        this.m_BallId = 0;
        this.m_Status = null;
      },
      switchBall: function switchBall(ballId) {
        this.m_BallId = ballId;
        this.m_BallArr.forEach(function(item, id) {
          item.active = id == ballId;
        });
      },
      start: function start() {},
      setCtr: function setCtr(ctr) {
        this.m_Ctr = ctr;
      },
      setFire: function setFire(bShow) {
        this.m_Status = bShow ? "fire" : "";
        this.m_FireShow.active = bShow;
      },
      getStatus: function getStatus() {
        return this.m_Status;
      },
      onBeginContact: function onBeginContact(contact, selfCollider, otherCollider) {
        "player" == otherCollider.node.name && (this.m_moveType = false);
      }
    }, _cc$Class["onBeginContact"] = function onBeginContact(contact, self, other) {
      if ("bottom" == other.node.name) {
        var body = self.node.getComponent(cc.RigidBody);
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(cc.v2(0, -1e3), worldCenter);
      }
    }, _cc$Class));
    cc._RF.pop();
  }, {} ],
  bk_check: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e45d5bmRvdHUpde+7Ry2OHf", "bk_check");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_target: cc.Node
      },
      ctor: function ctor() {
        this.m_check = false;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        g_Log("\u649e\u4e0a\u4e86");
        other.node.getPosition().y > self.node.getPosition().y + 20 ? this.m_check = true : this.m_check = false;
      },
      onCollisionExit: function onCollisionExit(other, self) {
        if (this.m_check) {
          this.m_check = false;
          if (other.node.getPosition().y < self.node.getPosition().y - 10) {
            g_Log("defen");
            g_gameLayer2.goal();
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  btn: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b29d0HEnNpOrrZQXuk99f2e", "btn");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        var self = this;
      }
    });
    cc._RF.pop();
  }, {} ],
  charactorLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8371fSQlAdJG4xrNrP/qrry", "charactorLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_ChaArr: {
          default: [],
          type: cc.Node
        },
        m_UseBtn: cc.Node,
        m_BtnArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.m_tarBallId = 0;
      },
      onLoad: function onLoad() {},
      start: function start() {
        this.updateLayer();
      },
      updateLayer: function updateLayer() {
        this.m_BtnArr.forEach(function(item, key) {
          item.getChildByName("name").getComponent(cc.Label).string = CHARACTER.name[key];
        });
      },
      onBtnClick: function onBtnClick(event, data) {
        data == this.m_tarBallId ? this.m_UseBtn.active = false : this.m_UseBtn.active = true;
        this.switchCha(data);
      },
      switchCha: function switchCha(data) {
        this.m_tarBallId = data;
        this.m_ChaArr.forEach(function(item, key) {
          item.active = data == key;
        });
      },
      onBtnUseBall: function onBtnUseBall() {
        var _this = this;
        GAME_DATA.characterId = this.m_tarBallId;
        this.m_BtnArr.forEach(function(item, key) {
          var labelNode = item.getChildByName("label");
          key == _this.m_tarBallId ? labelNode.active = true : labelNode.active = false;
        });
        this.m_UseBtn.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  clound: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d374dC9Oy9JboLOPSJ1hHmM", "clound");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        speed: cc.Integer
      },
      ctor: function ctor() {},
      start: function start() {},
      update: function update() {
        this.node.x = this.node.x + this.speed;
        this.node.x > 2200 && (this.node.x = -300);
      }
    });
    cc._RF.pop();
  }, {} ],
  config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53981bWnZNMhblpI6xX6VI3", "config");
    "use strict";
    window.GAME_DATA = {
      ballId: 0,
      characterId: 0
    };
    window.g_UserData = {
      id: -1,
      openId: null
    };
    cc._RF.pop();
  }, {} ],
  define: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c847bDtYm9HEbEt394yb4Bf", "define");
    "use strict";
    window.g_bMove = false;
    window.bJumping = [];
    window.playerBody = [];
    window.MaxHitDis = 230;
    window.MaxHitimpulse = 5e3;
    window.PACKET_PER_SEC = 60;
    window.SPEED = 7.5;
    window.Player = [];
    window.Door = [];
    window.flag = [ false, false ];
    window.DEBUG = true;
    window.g_openId = null;
    window.WXSDK = null;
    window.g_Server = null;
    window.g_GAME = null;
    window.g_gameLayer2 = null;
    window.MATCH_DATA = null;
    window.ROOM_FRIEND = 1;
    window.LAYER = cc.Enum({
      matchL: -1,
      characterL: -1,
      ballL: -1,
      bulletL: -1,
      lobbyL: -1,
      achieventL: -1,
      endL: -1
    });
    window.BALL = {
      name: {
        0: "\u8db3\u74031",
        1: "\u7bee\u74031",
        2: "\u6392\u7403",
        3: "\u9ed1\u516b",
        4: "\u6a44\u6984",
        5: "\u4e94\u661f\u9f99\u73e0",
        6: "\u98de\u706b\u6d41\u661f",
        7: "\u5730\u7206\u5929\u661f"
      }
    };
    window.CHARACTER = {
      name: {
        0: "\u5c0f\u9f99\u4eba",
        1: "\u6447\u6eda\u54e5",
        2: "\u5c0f\u50bb\u72d7",
        3: "\u5f85\u5b9a"
      }
    };
    window.g_Log = function(data) {};
    cc._RF.pop();
  }, {} ],
  door: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5e98cTv4zRG64bGjKUelCuO", "door");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ani: cc.Animation
      },
      ctor: function ctor() {},
      start: function start() {},
      setCtr: function setCtr(ctr) {
        this.m_Ctr = ctr;
      },
      setDoorId: function setDoorId(id) {
        this.m_Id = id;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        Door[this.m_Id].m_Ani.play();
        this.m_Ctr.schedule(this.m_Ctr.shake, 1 / 60, 60);
        this.m_Ctr.scheduleOnce(function() {
          this.m_Camera.setPosition(0, 0);
          this.unschedule(self.shake);
          var event = new CustomEvent("gameComplete", {
            status: 1
          });
          document.dispatchEvent(event);
        }, 1);
      }
    });
    cc._RF.pop();
  }, {} ],
  "event-names": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2886HkOVNLk7RQK4+q+aZ6", "event-names");
    "use strict";
    exports.__esModule = true;
    exports.C_JUMP = exports.C_HIT = exports.C_RIGHT_UP = exports.C_RIGHT_DOWN = exports.C_LEFT_UP = exports.C_LEFT_DOWN = exports.C_JOIN_ROOM = exports.C_CREATE_ROOM = exports.C_LOIN = exports.S_CREATE_ROOM_OK = exports.S_SET_SCORE = exports.S_NEW_ROUND = exports.S_BALL_POS = exports.S_RIGHT_END = exports.S_RIGHT_START = exports.S_LEFT_END = exports.S_LEFT_START = exports.S_PLAYER_JUMP = exports.S_LOGIN_SUCCESS = exports.S_PLAYER_FIRE = exports.S_GAME_END = exports.S_GAME_START = void 0;
    var S_GAME_START = "gameStart";
    exports.S_GAME_START = S_GAME_START;
    var S_GAME_END = "gameEnd";
    exports.S_GAME_END = S_GAME_END;
    var S_PLAYER_FIRE = "fire";
    exports.S_PLAYER_FIRE = S_PLAYER_FIRE;
    var S_LOGIN_SUCCESS = "loginSucess";
    exports.S_LOGIN_SUCCESS = S_LOGIN_SUCCESS;
    var S_PLAYER_JUMP = "jump";
    exports.S_PLAYER_JUMP = S_PLAYER_JUMP;
    var S_LEFT_START = "left_start";
    exports.S_LEFT_START = S_LEFT_START;
    var S_LEFT_END = "left_end";
    exports.S_LEFT_END = S_LEFT_END;
    var S_RIGHT_START = "right_start";
    exports.S_RIGHT_START = S_RIGHT_START;
    var S_RIGHT_END = "right_end";
    exports.S_RIGHT_END = S_RIGHT_END;
    var S_BALL_POS = "pos";
    exports.S_BALL_POS = S_BALL_POS;
    var S_NEW_ROUND = "new_round";
    exports.S_NEW_ROUND = S_NEW_ROUND;
    var S_SET_SCORE = "set_score";
    exports.S_SET_SCORE = S_SET_SCORE;
    var S_CREATE_ROOM_OK = "create_room_ok";
    exports.S_CREATE_ROOM_OK = S_CREATE_ROOM_OK;
    var C_LOIN = "login";
    exports.C_LOIN = C_LOIN;
    var C_CREATE_ROOM = "create_room";
    exports.C_CREATE_ROOM = C_CREATE_ROOM;
    var C_JOIN_ROOM = "join_room";
    exports.C_JOIN_ROOM = C_JOIN_ROOM;
    var C_LEFT_DOWN = "left_down";
    exports.C_LEFT_DOWN = C_LEFT_DOWN;
    var C_LEFT_UP = "left_up";
    exports.C_LEFT_UP = C_LEFT_UP;
    var C_RIGHT_DOWN = "right_down";
    exports.C_RIGHT_DOWN = C_RIGHT_DOWN;
    var C_RIGHT_UP = "right_up";
    exports.C_RIGHT_UP = C_RIGHT_UP;
    var C_HIT = "hit";
    exports.C_HIT = C_HIT;
    var C_JUMP = "jump";
    exports.C_JUMP = C_JUMP;
    cc._RF.pop();
  }, {} ],
  fight: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77c57M06+1JJbKPOYI1Ers+", "fight");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      ctor: function ctor() {
        this.m_HitFlag = false;
      },
      start: function start() {},
      setCtr: function setCtr(ctr) {
        this.m_ctr = ctr;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        g_Log("\u649e\u4e0a\u4e86");
        this.hit(self.node.getPosition(), other.node);
      },
      hit: function hit(targetPos, ball) {
        var _this = this;
        if (this.m_HitFlag) return;
        this.m_ctr.reduceBullet();
        var ballPos = ball.getPosition();
        var body = ball.getComponent(cc.RigidBody);
        body.linearVelocity = cc.v2(0, 0);
        var vec = ballPos.sub(targetPos);
        var num = 22e3;
        var angle = vec.angle(cc.v2(1, 0));
        var impulse = {
          x: -num * Math.sin(angle),
          y: num * Math.cos(angle) / 3
        };
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(impulse, worldCenter);
        new Promise(function(res, rej) {
          _this.m_HitFlag = false;
          var scaleBy = cc.scaleTo(.3, .8);
          var callfunc = cc.callFunc(function() {
            _this.node.active = false;
            res();
          });
          var seq = cc.sequence(scaleBy, callfunc);
          _this.node.runAction(seq);
        }).then(function() {
          _this.scheduleOnce(function() {
            _this.m_HitFlag = false;
            _this.node.setScale(1.3);
            _this.node.active = true;
          }, .2);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  gameEngine_s: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa442PfmSNKc5cogVcW/Mow", "gameEngine_s");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Basket: cc.Node,
        m_Basket2: cc.Node,
        m_Edge1: cc.Node,
        m_Edge2: cc.Node,
        M_Chain: cc.Node,
        m_ChainArr: {
          type: cc.Node,
          default: []
        },
        m_BulletArr: {
          type: cc.Node,
          default: []
        },
        m_Fight: cc.Node
      },
      ctor: function ctor() {
        this.m_BulletSum = 14;
        this.m_Status = null;
      },
      start: function start() {
        this.m_Fight.getComponent("fight").setCtr(this);
        g_gameLayer2 = this;
      },
      onEnable: function onEnable() {
        cc.director.getPhysicsManager().gravity = cc.v2(500, 0);
      },
      goal: function goal() {
        this.m_BulletSum = 14;
        this.refreshBulletShow();
        var x = 700 * Math.random() - 365;
        var y = 560 * Math.random() - 280;
        var d_x = x - this.m_Basket2.x;
        var d_y = y - this.m_Basket2.y;
        this.m_ChainArr.forEach(function(item) {
          return item.setPosition(item.x + d_x, item.y + d_y);
        });
        this.m_Basket2.x = x;
        this.m_Basket2.y = y;
        this.m_Basket.x = this.m_Basket2.x;
        this.m_Basket.y = this.m_Basket2.y - 135;
        this.m_Edge1.x = this.m_Basket2.x - 80;
        this.m_Edge1.y = this.m_Basket2.y - 110;
        this.m_Edge2.x = this.m_Basket2.x + 80;
        this.m_Edge2.y = this.m_Basket2.y - 110;
      },
      gameEnd: function gameEnd() {
        this.m_BulletSum = 14;
        this.refreshBulletShow();
      },
      resetPosition: function resetPosition() {},
      refreshBulletShow: function refreshBulletShow() {
        var _this = this;
        this.m_BulletArr.forEach(function(item, key) {
          item.active = !(key > _this.m_BulletSum - 1);
        });
      },
      reduceBullet: function reduceBullet() {
        this.m_BulletSum--;
        0 == this.m_BulletSum ? this.gameEnd() : this.refreshBulletShow();
      }
    });
    cc._RF.pop();
  }, {} ],
  gameEngine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5c251d5dZP7rBN/tnNeOKL", "gameEngine");
    "use strict";
    var FIRCONNECT = 0;
    var RECONNECT = 1;
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Camera: cc.Node,
        m_LanuchLayer: cc.Node,
        m_Ball: cc.Node,
        m_Player: cc.Node,
        m_Player2: cc.Node,
        m_Door1: cc.Node,
        m_Door2: cc.Node,
        m_Score1: cc.Label,
        m_Score2: cc.Label,
        m_Hit: cc.Node,
        m_Hit2: cc.Node,
        m_BtnLeft: cc.Node,
        m_BtnRight: cc.Node,
        m_FeetSmoke: cc.Prefab,
        m_LandArr: {
          type: cc.Node,
          default: []
        },
        m_No: cc.Node,
        m_ShowGoal: cc.Node,
        m_UI: cc.Node,
        m_lobby: cc.Node,
        m_lobbyLayer: cc.Node,
        m_gameLayer_bullet: cc.Node,
        m_gameLayer_match: cc.Node,
        m_ballLayer: cc.Node,
        m_achieventLayer: cc.Node,
        m_endLayer: cc.Node,
        m_matchLayer: cc.Node,
        m_characterLayer: cc.Node
      },
      ctor: function ctor() {
        this.m_checkTime = null;
        this.m_LayerArr = [];
        this.m_JumpTime = 0;
      },
      switchLayerShow: function switchLayerShow(id) {
        g_Log("\u5207\u6362\u754c\u9762" + id);
        this.m_LayerArr.forEach(function(element, key) {
          element.active = key == id;
        });
      },
      onLoad: function onLoad() {
        cc.debug.setDisplayStats(false);
        this.m_Playerctr = this.m_Player.getComponent("player");
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        var self = this;
        this.m_LayerArr[LAYER.bulletL] = this.m_gameLayer_bullet;
        this.m_LayerArr[LAYER.lobbyL] = this.m_lobbyLayer;
        this.m_LayerArr[LAYER.characterL] = this.m_characterLayer;
        this.m_LayerArr[LAYER.ballL] = this.m_ballLayer;
        this.m_LayerArr[LAYER.achieventL] = this.m_achieventLayer;
        this.m_LayerArr[LAYER.endL] = this.m_endLayer;
        this.m_LayerArr[LAYER.matchL] = this.m_matchLayer;
        this.m_BallCtr = this.m_Ball.getComponent("ball");
        Player[0] = this.m_Player.getComponent("player");
        Player[1] = this.m_Player2.getComponent("player");
        Player[0].setCtr(this, 0);
        Player[1].setCtr(this, 1);
        Door[0] = this.m_Door1.getComponent("door");
        Door[1] = this.m_Door2.getComponent("door");
        Door[0].setCtr(this);
        Door[1].setCtr(this);
        Door[0].setDoorId(0);
        Door[1].setDoorId(1);
        playerBody[0] = this.m_Player.getComponent(cc.RigidBody);
        playerBody[1] = this.m_Player2.getComponent(cc.RigidBody);
        this.m_BtnLeft.on(cc.Node.EventType.TOUCH_START, function(event) {
          self.onBtnClick_left();
        }, this);
        this.m_BtnLeft.on(cc.Node.EventType.TOUCH_END, function(event) {
          self.onBtnClick_leftEnd();
          self.m_Playerctr.resetAni();
        }, this);
        this.m_BtnRight.on(cc.Node.EventType.TOUCH_START, function(event) {
          self.onBtnClick_right();
        }, this);
        this.m_BtnRight.on(cc.Node.EventType.TOUCH_END, function(event) {
          self.onBtnClick_rightEnd();
          self.m_Playerctr.resetAni();
        }, this);
        this.m_BtnRight.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
          self.onBtnClick_rightEnd();
          self.m_Playerctr.resetAni();
        }, this);
        this.m_BtnLeft.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
          self.onBtnClick_leftEnd();
          self.m_Playerctr.resetAni();
        }, this);
        g_GAME = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onDestroy: function onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      },
      onKeyDown: function onKeyDown(event) {
        var self = this;
        switch (event.keyCode) {
         case cc.macro.KEY.right:
          self.onBtnClick_right();
          break;

         case cc.macro.KEY.left:
          self.onBtnClick_left();
          break;

         case cc.macro.KEY.space:
          self.jump();
          break;

         case cc.macro.KEY.a:
          self.hit();
        }
      },
      onKeyUp: function onKeyUp(event) {
        var self = this;
        switch (event.keyCode) {
         case cc.macro.KEY.right:
          self.onBtnClick_rightEnd();
          break;

         case cc.macro.KEY.left:
          self.onBtnClick_leftEnd();
          break;

         case cc.macro.KEY.space:
          self.jump();
          break;

         case cc.macro.KEY.a:
          self.hit();
        }
      },
      start: function start() {},
      onBtnClick_left: function onBtnClick_left() {
        var player = Player[0];
        player.setMoveType(1);
      },
      onBtnClick_right: function onBtnClick_right() {
        var player = Player[0];
        player.setMoveType(2);
      },
      onBtnClick_rightEnd: function onBtnClick_rightEnd() {
        var player = Player[0];
        player.setMoveType(0);
        g_bMove = false;
        player.resetAni();
      },
      onBtnClick_leftEnd: function onBtnClick_leftEnd() {
        var player = Player[0];
        player.setMoveType(0);
        g_bMove = false;
        player.resetAni();
      },
      update: function update() {},
      hit: function hit() {
        if (this.m_checkTime) {
          if (!(Date.now() - this.m_checkTime > 300)) return;
          this.m_checkTime = Date.now();
        } else this.m_checkTime = Date.now();
        if (!this.m_Ball.active) return;
        this.m_Playerctr.setAni("hit");
        var ballPos = this.m_Ball.getPosition();
        var playerPos = this.m_Playerctr.node.getPosition();
        playerPos.y -= 50;
        var vec = ballPos.sub(playerPos);
        if (false == this.m_Playerctr.m_bFlip && vec.x < 0) return;
        if (this.m_Playerctr.m_bFlip && vec.x > 0) return;
        var dis = vec.mag();
        if (dis > MaxHitDis) return;
        var percent = 1 - dis / MaxHitDis;
        var num = MaxHitimpulse * percent;
        var angle = vec.angle(cc.v2(1, 0));
        angle * (180 / 3.14);
        var impulse = {
          y: -1 * num * Math.sin(angle),
          x: num * Math.cos(angle)
        };
        flag[g_UserData.id] = true;
        setTimeout(function() {
          flag[g_UserData.id] = false;
        }, 600);
        var touchLoc = cc.v2(845, -905);
        var ani = "hit1";
        var status = "";
        if (vec.y > 80) ani = "hit1"; else if (vec.y <= 130 && vec.y > 20) {
          ani = "hit2";
          status = "fire";
        } else ani = "hit3";
        var body = this.m_Ball.getComponent(cc.RigidBody);
        this.m_Playerctr.setAni(ani, vec);
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(cc.v2(impulse.x, impulse.y), worldCenter);
      },
      jump: function jump() {
        var self = this;
        if (this.m_JumpTime && !(Date.now() - this.m_JumpTime > 1e3)) return;
        this.m_JumpTime = Date.now();
        g_Log("jump");
        var body = playerBody[0];
        g_Log("body.linearVelocity.y", body.linearVelocity.y);
        if (body.node.y < -710 || 0 == body.linearVelocity.y) {
          var worldCenter = body.getWorldCenter();
          var script = body.node.getComponent("player");
          script.setAni("jump");
          var pos = script.node.getPosition();
          pos.y -= 80;
          self.buildSmoke(pos, script.m_bFlip);
          body.applyLinearImpulse(cc.v2(0, 3e3), worldCenter);
        }
      },
      buildSmoke: function buildSmoke(pos, bFlip) {
        var smoke = cc.instantiate(this.m_FeetSmoke);
        if (this.m_Playerctr && this.m_Playerctr.node) {
          smoke.parent = this.m_Playerctr.node.parent;
          smoke.setPosition(pos);
          var animation = smoke.getComponent(cc.Animation);
          animation.on("finished", this.onFinished, smoke);
          var flipXAction = cc.flipX(bFlip);
          smoke.runAction(flipXAction);
        }
      },
      onFinished: function onFinished() {
        this.destroy();
      },
      shake: function shake() {
        var min = -20;
        var max = 20;
        var randomX = min + 40 * Math.random();
        var randomY = min + 40 * Math.random();
        this.m_Camera.x = randomX;
        this.m_Camera.y = randomY;
      }
    });
    window.translate = function(pos) {
      pos = {
        x: pos.x / 30,
        y: -1 * pos.y / 30
      };
      return pos;
    };
    window.translate2 = function(pos) {
      pos.x *= 30;
      pos.y *= -30;
      return pos;
    };
    cc._RF.pop();
  }, {} ],
  gameServer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36c3aOHvfpHV4GA5N8dcegH", "gameServer");
    "use strict";
    var EVENT = _interopRequireWildcard(require("./event-names.js"));
    function _getRequireWildcardCache() {
      if ("function" !== typeof WeakMap) return null;
      var cache = new WeakMap();
      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };
      return cache;
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;
      if (null === obj || "object" !== typeof obj && "function" !== typeof obj) return {
        default: obj
      };
      var cache = _getRequireWildcardCache();
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
      }
      newObj["default"] = obj;
      cache && cache.set(obj, newObj);
      return newObj;
    }
    var Server = function() {
      function Server() {
        var _this = this;
        SOCKET.on("connection", function() {
          g_Log("connection ok!!!");
          _this.sendMsg("connected", {
            openId: g_UserData.openId
          });
        });
        this.addMsgListion();
      }
      var _proto = Server.prototype;
      _proto.addMsgListion = function addMsgListion() {
        var _this2 = this;
        var self = g_GAME;
        window.SOCKET.on(EVENT.S_GAME_START, function(msg) {
          g_Log("gameStart");
          self.m_LanuchLayer.active = false;
          self.m_gameLayer_match.active = true;
          g_UserData.id = msg.playerId;
          g_Log("g_UserData.id" + g_UserData.id);
          0 == g_UserData.id ? self.m_Playerctr = self.m_Player.getComponent("player") : self.m_Playerctr = self.m_Player2.getComponent("player");
          self.m_PlayerBody = self.m_Playerctr.node.getComponent(cc.RigidBody);
          g_Log("g_UserData.id" + g_UserData.id);
          self.m_No.active = false;
        });
        window.SOCKET.on(EVENT.S_PLAYER_FIRE, function(msg) {
          self.m_BallCtr.setFire(msg.bShow);
        });
        window.SOCKET.on(EVENT.S_LOGIN_SUCCESS, function(msg) {
          g_UserData.openId = msg.openId;
          window.g_openId = g_UserData.openId;
          if (!DEBUG) {
            var data = WXSDK.getLaunchOptionsSync();
            g_Log("loginSucess" + JSON.stringify(data.query));
            if ("{}" != JSON.stringify(data.query)) {
              g_Log("\u63a5\u53d7\u6311\u6218\u5411\u670d\u52a1\u5668\u53d1\u8bf7\u6c42," + data.query);
              _this2.send_joinRoom({
                type: 1,
                openid: g_openId,
                matchData: data.query
              });
              g_GAME.switchLayerShow(LAYER.matchL);
            }
          }
        });
        window.SOCKET.on(EVENT.S_PLAYER_JUMP, function(msg) {
          if (_this2.m_JumpTime && !(Date.now() - _this2.m_JumpTime > 1e3)) return;
          _this2.m_JumpTime = Date.now();
          g_Log("jump");
          var body = playerBody[msg.id];
          g_Log("body.linearVelocity.y", body.linearVelocity.y);
          if (body.node.y < -710 || 0 == body.linearVelocity.y) {
            var worldCenter = body.getWorldCenter();
            var script = body.node.getComponent("player");
            script.setAni("jump");
            var pos = script.node.getPosition();
            pos.y -= 80;
            self.buildSmoke(pos, script.m_bFlip);
            body.applyLinearImpulse(cc.v2(0, 3e3), worldCenter);
          }
        });
        window.SOCKET.on(EVENT.S_LEFT_START, function(msg) {
          g_Log("left_start");
          Player[msg.id].setMoveType(1);
          Player[msg.id].node.x = msg.pos.x;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_LEFT_END, function(msg) {
          Player[msg.id].setMoveType(0);
          g_bMove = false;
          Player[msg.id].resetAni();
          Player[msg.id].node.x = msg.pos.x - 21;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_RIGHT_START, function(msg) {
          Player[msg.id].setMoveType(2);
          Player[msg.id].node.x = msg.pos.x;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_RIGHT_END, function(msg) {
          Player[msg.id].setMoveType(0);
          Player[msg.id].resetAni();
          Player[msg.id].node.x = msg.pos.x + 21;
          Player[msg.id].node.y = msg.pos.y;
        });
        window.SOCKET.on(EVENT.S_BALL_POS, function(msg) {
          self.m_Ball.x = msg.pos_ball.x;
          self.m_Ball.y = msg.pos_ball.y;
          g_Log("msg.pos_ball.angle" + msg.pos_ball.angle);
          self.m_Ball.rotation = msg.pos_ball.angle * (180 / 3.14);
        });
        window.SOCKET.on(EVENT.S_NEW_ROUND, function(msg) {
          self.m_Ball.active = true;
        });
        window.SOCKET.on(EVENT.S_SET_SCORE, function(msg) {
          var goalData = msg.goalData;
          self.m_Ball.active = false;
          var id = msg.id;
          1 * goalData[0] > 1 * self.m_Score1.string && Door[1].m_Ani.play();
          1 * goalData[1] > 1 * self.m_Score2.string && Door[0].m_Ani.play();
          self.m_Score1.string = goalData[0];
          self.m_Score2.string = goalData[1];
          self.schedule(self.shake, 1 / 60, 60);
          self.scheduleOnce(function() {
            self.m_Camera.setPosition(0, 0);
            self.unschedule(self.shake);
          }, 1);
        });
        window.SOCKET.on(EVENT.S_SET_SCORE, function(msg) {
          g_Log("gameEnd");
          self.m_LanuchLayer.active = true;
        });
        window.SOCKET.on(EVENT.S_CREATE_ROOM_OK, function(msg) {
          g_Log("create_room_ok\uff0c\u5207\u6362\u6bd4\u8d5b\u754c\u9762");
          g_GAME.switchLayerShow(LAYER.matchL);
          DEBUG || WXSDK.inviteFriend(msg);
        });
      };
      _proto.sendMsg = function sendMsg(key, data) {
        void 0 === data && (data = "0");
        window.SOCKET.emit(key, data);
      };
      _proto.send_login = function send_login(data) {
        g_Log("\u53d1\u9001 login");
        data.msgId = EVENT.C_LOIN;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_match = function send_match(data) {
        data.msgId = EVENT.C_CREATE_ROOM;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_joinRoom = function send_joinRoom(data) {
        g_Log("\u53d1\u9001 join_room");
        data.msgId = EVENT.C_JOIN_ROOM;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_leftDown = function send_leftDown(data) {
        g_Log("\u53d1\u9001 left_down");
        data.msgId = EVENT.C_LEFT_DOWN;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_leftUp = function send_leftUp(data) {
        g_Log("\u53d1\u9001 left_up");
        data.msgId = EVENT.C_LEFT_UP;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_rightDown = function send_rightDown(data) {
        g_Log("\u53d1\u9001 right_down");
        data.msgId = EVENT.C_RIGHT_DOWN;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_rightUp = function send_rightUp(data) {
        g_Log("\u53d1\u9001 right_up");
        data.msgId = EVENT.C_RIGHT_UP;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_hit = function send_hit(data) {
        g_Log("\u53d1\u9001 hit");
        data.msgId = EVENT.C_HIT;
        this.sendMsg("GAME_MSG", data);
      };
      _proto.send_jump = function send_jump(data) {
        g_Log("\u53d1\u9001 jump");
        data.msgId = EVENT.C_JUMP;
        this.sendMsg("GAME_MSG", data);
      };
      return Server;
    }();
    module.exports = Server;
    cc._RF.pop();
  }, {
    "./event-names.js": "event-names"
  } ],
  lanuchLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0954f3Id5dD8IB3um3rzM4D", "lanuchLayer");
    "use strict";
    var WxSDKAPI = require("WxSDKAPI");
    cc.Class({
      extends: cc.Component,
      properties: {
        m_StartBtn: cc.Node
      },
      onLoad: function onLoad() {
        if (DEBUG) this.startGame(); else {
          WXSDK = new WxSDKAPI();
          WXSDK.init(this.m_StartBtn, this.startGame.bind(this));
        }
      },
      startGame: function startGame() {
        g_Log("\u8fdb\u5165\u5927\u5385");
        this.node.active = false;
        g_GAME.m_lobby.active = true;
        g_GAME.switchLayerShow(LAYER.lobbyL);
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    WxSDKAPI: "WxSDKAPI"
  } ],
  lobbyLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "996c90Cw05JBYoVUwPP1m0/", "lobbyLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ball: cc.Node,
        m_ChaArr: {
          default: [],
          type: cc.Node
        }
      },
      ctor: function ctor() {
        this.m_tarBallId = 0;
      },
      onLoad: function onLoad() {
        this.m_Ball = this.m_Ball.getComponent("ball");
        this.m_Ball.setCtr(this);
      },
      onEnable: function onEnable() {
        this.m_Ball.switchBall(GAME_DATA.ballId);
        this.m_ChaArr.forEach(function(item, key) {
          GAME_DATA.characterId == key ? item.active = true : item.active = false;
        });
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  lobby: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6a0cBXlWVBiKs2k/yTAg8X", "lobby");
    "use strict";
    var WxSDKAPI = require("WxSDKAPI");
    window.wxSdk = null;
    cc.Class({
      extends: cc.Component,
      properties: {
        m_StartBtn: cc.Node,
        m_HeadImg: cc.Sprite
      },
      ctor: function ctor() {
        this.m_btnCallFMgr = {
          0: this.CallF_battle,
          1: this.CallF_myChracter,
          2: this.CallF_myBall,
          3: this.CallF_bullet,
          4: this.CallF_lobby,
          5: this.CallF_achievent,
          6: this.CallF_end
        };
        this.m_Ctr = null;
        this.m_smokeTime = 0;
        this.m_bFlip = false;
        this._armatureDisPlay = null;
        this.m_bDowning = false;
      },
      onEnable: function onEnable() {
        g_Log("\u83b7\u53d6\u7528\u6237\u7684\u4fe1\u606f");
        DEBUG || WXSDK.getUserInfo(this.updateLayer.bind(this));
      },
      updateLayer: function updateLayer() {
        g_Log("\u83b7\u53d6\u73a9\u5bb6\u7528\u6237\u4fe1\u606f\u56de\u8c03\u51fd\u6570\uff0c\u8bbe\u7f6e\u73a9\u5bb6\u5934\u50cf");
        WXSDK.setUserIcon(g_UserData.avatarUrl, this.m_HeadImg);
      },
      start: function start() {
        this._armatureDisPlay = this.m_Ani;
        var self = this;
        this.m_Body = this.node.getComponent(cc.RigidBody);
      },
      setGameEngine: function setGameEngine(engine) {
        g_GAME = engine;
      },
      onBtnClick: function onBtnClick(event, data) {
        g_GAME.switchLayerShow(data);
        data in this.m_btnCallFMgr ? this.m_btnCallFMgr[data].call(this, data) : g_Log("\u8be5\u6309\u94ae\u672a\u914d\u7f6e\u51fd\u6570");
      },
      CallF_battle: function CallF_battle(data) {
        g_Log("\u73a9\u5bb6\u5bf9\u6218");
        g_GAME.serverMgr.send_match({
          type: 1,
          openid: g_openId || Date.now()
        });
      },
      CallF_bullet: function CallF_bullet() {
        g_Log("\u5b50\u5f39\u6a21\u5f0f");
      },
      CallF_myBall: function CallF_myBall() {
        g_Log("\u6211\u7684\u7403");
      },
      CallF_myChracter: function CallF_myChracter() {
        g_Log("\u6211\u7684\u89d2\u8272");
      },
      CallF_achievent: function CallF_achievent() {},
      CallF_end: function CallF_end() {},
      CallF_lobby: function CallF_lobby() {}
    });
    cc._RF.pop();
  }, {
    WxSDKAPI: "WxSDKAPI"
  } ],
  matchLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15c6bTcLwZF7rneXrTK+6kG", "matchLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_HeadImg1: cc.Sprite,
        m_HeadImg2: cc.Sprite
      },
      ctor: function ctor() {},
      onLoad: function onLoad() {},
      onEnable: function onEnable() {},
      start: function start() {},
      renderLayer: function renderLayer(data) {
        WXSDK.setUserIcon(data.avatarUrl, this.m_HeadImg1);
        WXSDK.setUserIcon(g_UserData.avatarUrl, this.m_HeadImg2);
      }
    });
    cc._RF.pop();
  }, {} ],
  par: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc7221q+1VL6YcEkK3o2mBc", "par");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      ctor: function ctor() {},
      onEnable: function onEnable() {
        var rand = Math.random();
        this.scheduleOnce(function() {
          this.getComponent(cc.ParticleSystem).resetSystem();
        }, rand);
      }
    });
    cc._RF.pop();
  }, {} ],
  "physics-bound": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46d5eCJoHxE7bKT/5dgkYN/", "physics-bound");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        size: cc.size(0, 0),
        mouseJoint: true,
        test: cc.Node
      },
      onLoad: function onLoad() {
        var width = this.size.width || this.node.width;
        var height = this.size.height || this.node.height;
        var node = new cc.Node();
        var body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;
        if (this.mouseJoint) {
          var joint = node.addComponent(cc.MouseJoint);
          joint.mouseRegion = this.node;
        }
        this._addBound(node, 0, height / 2 - 100, width, 20);
        this._addBound(node, 0, -height / 2 + 100, width, 20);
        this._addBound(node, -width / 2, 0, 20, height);
        this._addBound(node, width / 2, 0, 20, height);
        node.parent = this.node;
      },
      _addBound: function _addBound(node, x, y, width, height) {
        var collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
      },
      testbtn: function testbtn() {
        var body = this.test.getComponent(cc.RigidBody);
        var worldCenter = body.getWorldCenter();
        body.applyLinearImpulse(cc.v2(0, 3e9), worldCenter);
      }
    });
    cc._RF.pop();
  }, {} ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "588cdzd0VRCe74JdVLDcoOO", "player");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_Ani: dragonBones.ArmatureDisplay,
        m_Hit: cc.Animation
      },
      ctor: function ctor() {
        this.m_moveType = null;
        this.bMoving = false;
        this.m_Ctr = null;
        this.m_smokeTime = 0;
        this.m_bFlip = false;
        this._armatureDisPlay = null;
        this.m_bDowning = false;
      },
      setFlip: function setFlip(bFlip) {
        this.m_bFlip = bFlip;
      },
      start: function start() {
        this._armatureDisPlay = this.m_Ani;
        var self = this;
        this.m_Body = this.node.getComponent(cc.RigidBody);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          self.OnTouchMove(event);
        }, this);
      },
      setCtr: function setCtr(ctr, id) {
        this.m_id = id;
        this.m_Ctr = ctr;
      },
      sendPos: function sendPos(dt) {
        if (this.m_moveType) if (2 == this.m_moveType) if (0 != this.m_Body.linearVelocity.y) this.node.x += SPEED; else {
          this.node.x += SPEED;
          this.m_smokeTime += dt;
          if (this.m_smokeTime > 1) {
            var pos = this.node.getPosition();
            pos.y -= 80;
            this.m_Ctr.buildSmoke(pos, this.m_bFlip);
            this.m_smokeTime = 0;
          }
        } else if (0 != this.m_Body.linearVelocity.y) this.node.x -= SPEED; else {
          this.node.x -= SPEED;
          this.m_smokeTime += dt;
          if (this.m_smokeTime > 1) {
            var pos = this.node.getPosition();
            pos.y -= 80;
            this.m_Ctr.buildSmoke(pos, this.m_bFlip);
            this.m_smokeTime = 0;
          }
        }
      },
      OnTouchMove: function OnTouchMove(event) {
        this.node.x += event.getDelta().x;
        this.node.y += event.getDelta().y;
        var pos = {};
        pos.x = this.node.x;
        pos.y = this.node.y;
      },
      setMoveType: function setMoveType(type) {
        var self = this;
        this.UpdateInst || (this.UpdateInst = setInterval(function() {
          self.sendPos.call(self, 1 / 60);
        }, 1e3 / PACKET_PER_SEC));
        this.m_moveType = type;
        this.resetAni();
        if (1 == this.m_moveType) {
          this.m_bFlip = true;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        } else if (2 == this.m_moveType) {
          this.m_bFlip = false;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        }
      },
      hit: function hit(ball) {
        if (!this.m_Ctr.m_Ball.active) return;
        if (this.m_id == g_UserData.id && flag[g_UserData.id]) return;
        var ballPos = ball.getPosition();
        var playerPos = this.node.getPosition();
        var vec = ballPos.sub(playerPos);
        if (!this.m_moveType && false == this.m_bFlip && vec.x < 0) {
          this.m_bFlip = !this.m_bFlip;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        }
        if (!this.m_moveType && this.m_bFlip && vec.x > 0) {
          this.m_bFlip = !this.m_bFlip;
          var flipXAction = cc.flipX(this.m_bFlip);
          this.m_Ani.node.runAction(flipXAction);
        }
        var num = 180;
        var angle = vec.angle(cc.v2(1, 0));
        var impulse = {
          y: -1 * num * Math.sin(angle) / 2,
          x: num * Math.cos(angle) / 2
        };
        "fire" == ball.getComponent("ball").getStatus() ? this.setAni("fire", vec) : this.setAni("hit2", vec);
        if (this.m_id != g_UserData.id) return;
        g_GAME.serverMgr.send_hit({
          impulse: impulse,
          type: "body"
        });
      },
      onBeginContact: function onBeginContact(contact, selfCollider, otherCollider) {
        if ("ball" == otherCollider.node.name) {
          var ballPos = selfCollider.node.getPosition();
          var playerPos = otherCollider.node.getPosition();
          var vec = ballPos.sub(playerPos);
          var angle = vec.angle(cc.v2(1, 0));
          var num = 2e3;
          var impulse = {
            y: num * Math.sin(angle),
            x: -1 * num * Math.cos(angle) / 2
          };
          var body = otherCollider.node.getComponent(cc.RigidBody);
          var worldCenter = body.getWorldCenter();
          body.linearVelocity = cc.v2(0, 0);
          body.applyLinearImpulse(cc.v2(impulse.x, impulse.y), worldCenter);
        }
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        "ball" == other.node.name && this.hit(other.node);
      },
      setAni: function setAni(ani, hitPos) {
        if (hitPos) {
          this.m_Hit.node.setPosition(hitPos);
          this.m_Hit.play();
        }
        this._armatureDisPlay.playAnimation(ani, 1);
        this._armatureDisPlay.addEventListener(dragonBones.EventObject.COMPLETE, this.resetAni, this);
      },
      resetAni: function resetAni() {
        this.m_bDowning ? this._armatureDisPlay.playAnimation("down", -1) : this.m_moveType ? "walk" !== this._armatureDisPlay.animationName && this._armatureDisPlay.playAnimation("walk", -1) : this._armatureDisPlay.playAnimation("stand", -1);
      },
      update: function update() {
        if (this.m_Body.linearVelocity.y < -1500) {
          this.m_Body.node.x = this.m_Ctr.m_Ball.x;
          this.m_Body.node.y = this.m_Ctr.m_Ball.y;
        }
        if (this.m_Body.linearVelocity.y < 0) {
          if (!this.m_bDowning) {
            this.m_bDowning = true;
            this._armatureDisPlay.playAnimation("down", -1);
          }
          this.m_bDowning && "stand" == this._armatureDisPlay.animationName && this._armatureDisPlay.playAnimation("down", -1);
        }
        if (0 == this.m_Body.linearVelocity.y && this.m_bDowning) {
          this.m_bDowning = false;
          var pos = this.node.getPosition();
          pos.y -= 80;
          this.m_Ctr.buildSmoke(pos, this.m_bFlip);
          this.resetAni();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  "socket.io": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b81a3G9wUBHdpawr2N3Ak59", "socket.io");
    "use strict";
    cc._RF.pop();
  }, {} ],
  target: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "354a5AwpIdFcqAGTLw6dc5o", "target");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        m_target: cc.Node
      },
      ctor: function ctor() {},
      start: function start() {
        var _this = this;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          _this.touchMove(event);
        }, this);
      },
      touchMove: function touchMove(event) {
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.m_target.setPosition(pos);
      }
    });
    cc._RF.pop();
  }, {} ],
  test: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8981eSu2JZFoJ1uTP/ieNLf", "test");
    "use strict";
    cc._RF.pop();
  }, {} ],
  "use_v2.0.x_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "605e43g6HFO65F9iSkmeGUy", "use_v2.0.x_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_check = true);
    cc._RF.pop();
  }, {} ]
}, {}, [ "use_v2.0.x_cc.Toggle_event", "ball_bullet", "bk_check", "fight", "gameEngine_s", "target", "Notification", "ball", "btn", "par", "physics-bound", "socket.io", "test", "config", "define", "ballLayer", "charactorLayer", "lanuchLayer", "lobby", "lobbyLayer", "matchLayer", "event-names", "gameServer", "clound", "door", "gameEngine", "player", "WxSDKAPI" ]);