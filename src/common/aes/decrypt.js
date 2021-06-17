import  CryptoJS from 'crypto-js';

let AuthTokenKey = 'switchdb12345678'; //AES密钥
let AuthTokenIv = 'switchdb12345678'; //AES向量

/*AES解密*/
export function Decrypt(data) {
    let key = CryptoJS.enc.Latin1.parse(AuthTokenKey);
    var iv  = CryptoJS.enc.Latin1.parse(AuthTokenIv);
    let decrypted= CryptoJS.AES.decrypt(data,
        key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
    return decrypted.toString(CryptoJS.enc.Utf8);
}
//module.exports用于jest测试
module.exports = Decrypt;