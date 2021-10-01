/**
 * Object.keys
 * 参数：要返回其枚举自身属性的对象
 * 返回值：一个表示给定对象的所有可枚举属性的字符串数组
 * let person = {name:"张三",age:25,address:"深圳",getName:function(){}}
 * Object.keys(person) // ["name", "age", "address","getName"]
 * */
export const objectExistValue = (obj: object) => Object.keys(obj).length > 0;

/**
 * 获取跳转接口里带的参数
 * 例子：search: `?title=brand信息&brs8dId=${brs8dId}`,
 * unescape() 函数可对通过 escape() 编码的字符串进行解码。
 */
export const getUrlParam = (url: string, name: string) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let search = url.split("?")[1];
  if (search) {
    var r = search.substr(0).match(reg);
    if (r !== null) return unescape(r[2]);
    return "";
  } else {
    return "";
  }
};

export function hasErrors(fieldsError: any) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

/* 获得UUid */
export function uuid() {
  var s: any[] = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

/**
 * 判断是否为IE浏览器，因为IE与非IE浏览器postmessage的传递方式不一致
 * @returns {boolean}
 */
export function checkIeBrowser() {
  const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  const isIE =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
  // const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  const isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE || isIE11) {
    return false;
  } else {
    return true;
  }
}

/**
 * 用户参数模式、请求参数设置表单页面日期可格式
 * @returns {string}
 */
export function formatCurrentTime() {
  const date = new Date();
  const year = date.getFullYear() + "";
  const month = formatTimeLength(date.getMonth() + 1);
  const day = formatTimeLength(date.getDate());
  const hour = formatTimeLength(date.getHours());
  const minutes = formatTimeLength(date.getMinutes());
  const seconds = formatTimeLength(date.getSeconds());
  return `_${year}${month}${day}_${hour}${minutes}${seconds}`;
}

//对年月日时分秒长度格式化
function formatTimeLength(num: any) {
  return `${num}`.length === 1 ? `0${num}` : `${num}`;
}

/* 根据对象创建Map对象 */
export function mapByObj<T1, T2>(obj = {}) {
  let temp: any[] = [];
  let key: string;
  for (key in obj) {
    let keyTemp = Number(key) ? Number(key) : key;
    temp.push([keyTemp, obj[key as keyof typeof obj]]);
  }

  return new Map<T1, T2>(temp);
}

/* 剔除对象的空属性 */
export function filterParams(obj: object) {
  var _newObj: { [key: string]: any } = {};
  for (var key in obj) {
    /* 判断对象中是否有这个属性 */
    if (obj.hasOwnProperty(key)) {
      let value: any = obj[key as keyof typeof obj];
      if (isEmpty(value) && !Array.isArray(value)) continue;
      _newObj[key] =
        typeof value === "object"
          ? value instanceof Array
            ? ArrayFilterParams(value)
            : filterParams(value)
          : value;
    }
  }
  return _newObj;
}

/* 剔除数组中的空值 */
export function ArrayFilterParams(arr: any) {
  var err: any = [];
  arr.forEach((item: any, index: number) => {
    if (isEmpty(item)) return;
    err.push(
      typeof item === "object"
        ? item instanceof Array
          ? ArrayFilterParams(item)
          : filterParams(item)
        : item
    );
  });
  return err;
}

/* 为空情况 */
export function isEmpty(obj: any) {
  const empty_arr = ["", undefined, null];
  return empty_arr.indexOf(obj) > -1 || obj.toString().trim() === "";
}


