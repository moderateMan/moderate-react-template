import BaseIntl from "./baseIntl";

let config = {
    header_changePassword: {
        en: "Change password",
        zh: "修改密码",
    },
    header_logOut: {
        en: "Log out",
        zh: "退出登录",
    },
    header_setPassword: {
        zh: "密码设置",
        en: 'password Settings'
    },
    header_newPassword: {
        zh: '新密码',
        en: 'password'
    },
    header_pleaseInputNewWord: {
        zh: '请输入新密码',
        en: 'please enter a new password'
    },
    header_PasswordConfirmation: {
        zh: '密码确认',
        en: 'confirm'
    },
    header_pleaseInputConfirmWord: {
        zh: "请输入确认密码",
        en: 'please enter the confirmation password'
    },
    header_message: {
        zh: '用户名&密码！',
        en: "username & password!"
    },
    header_errorTip: { 
        zh: '千万别输错了！' ,
        en:'Hum, do not make a mistake!'
    },
    header_errorOpen: { 
        zh: '服务器无法连接，请联系管理员' ,
        en:'The server cannot connect, please contact the administrator'
    },
    header_copyNull: { 
        zh: '复制内容为空!',
        en:'copy content is empty!'
    },
    header_copySuccess: { 
        zh: '复制成功' ,
        en:'copy successful！'
    },
    header_pwdChangeSuccess: { 
        zh: '密码修改成功！' ,
        en:'password changed successfully!'
    },
    header_passwordInconsistent: { 
        zh: '两次输入的密码不一致！',
        en:'passwords entered twice are inconsistent!' 
    },
    header_pwdMaxLength: { 
        zh: '密码长度不能多于19个字符' ,
        en:'password length not more than 19 characters'
    },
    header_pwdNot: { 
        zh: '密码不能设置为初始密码哦！' ,
        en:'The password can not be set to the initial password oh!'
    },
    header_pwdTip: { 
        zh: '密码长度8-19位，至少包含英文（区分大小写）、数字、字符中的2项!' ,
        en:'Password length 8-19 bits, comprising at least English (case insensitive), numbers, characters of 2!'
    },
    header_intlBtn:{
        zh:"中文",
        en:"English"
    }
    
}

export default new BaseIntl({ config })

