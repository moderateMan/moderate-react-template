import CryptoJS from "crypto-js";

let AuthTokenKey = "switchdb12345678"; //AES密钥
let AuthTokenIv = "switchdb12345678"; //AES向量
/*AES加密*/
export default function Encrypt(dataStr) {
    //let dataStr = JSON.stringify(data);
    var key = CryptoJS.enc.Latin1.parse(AuthTokenKey);
    var iv = CryptoJS.enc.Latin1.parse(AuthTokenIv);
    let encrypted = CryptoJS.AES.encrypt(dataStr, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
    });

    return encrypted.toString();
}

// module.exports = Encrypt;
// export function Encrypt(data) {
//     var data = "123456";
//     var key  = CryptoJS.enc.Latin1.parse('1234567812345678');
//     var iv   = CryptoJS.enc.Latin1.parse('1234567812345678');
//     //加密
//     var encrypted = CryptoJS.AES.encrypt(
//         data,
//         key,
//         {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding
//         });
//     console.log('encrypted: ' + encrypted) ;
//     //解密
//     var decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
//     console.log('decrypted: '+decrypted.toString(CryptoJS.enc.Utf8));
//     return encrypted.toString();
// }

//npm install -save-dev crypto-js
//引用方法如下
// import { Encrypt, Decrypt } from './aes'
//
// let data = { body : Encrypt({gatherType: gatherType})};
// Request.FetchPost("api/Gather/GetSignCount", data).then(json=>{
//     if (条件) {
//         //执行
//     }
//     else {
//         //执行
//     }
// });
