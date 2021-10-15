
/**
 * 1. 定义输入
 *
 * 2. 定义库
 *
 * 3. 匹配
 *
 * 4. 转换输出格式
 *
 */
// arst

// console.log("start");
var fs = require("fs")

// // 异步读取
// fs.readFile('input.md', function (err, data) {
//     if (err) {
//         return console.error(err);
//     }
//     // console.log("start");
//     console.log("异步读取: " + data.toString());
// });

// 同步读取
var data = fs.readFileSync('input.md');
console.log("同步读取>>>\n" + data.toString());


var inp_str = data.toString();

console.log("程序执行完毕。");

// var str =
var txt = inp_str.replace("victor","nancy");



// console.log("txt>>>: " + txt);

// var patt=new RegExp(pattern,modifiers);

// var res = "(.*?)\n)".exec("The best things in life are free!");
// res.array.forEach(element => {
// console.log("element>>>: " + element);

// });

// 定义 最终结果的数组
var res_arr = [];



var txt_arr = txt.split("\n");

for(let key in txt_arr) {
    // console.log("key>>>"+txt_arr[key])
    res_arr.push("{color:\"red\",content:\""+txt_arr[key]+"\"}")
}


console.log(res_arr);
