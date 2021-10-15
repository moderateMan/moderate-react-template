

/**
 * 
 * @param {文件路径}} file_path 
 * @param {文件内容} data 
 */

function write_file(file_path, data) {
    const fs = require('fs')
    fs.writeFileSync(file_path, data)
}


/**
 * 
 * @param {文件路径} file_path 
 */
function read_file(file_path) {
    // console.log("start");
    let fs = require("fs")

    // // 异步读取
    // fs.readFile('README.md', function (err, data) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     // console.log("start");
    //     console.log("异步读取: " + data.toString());
    // });

    // 同步读取
    let data = fs.readFileSync(file_path);
    console.log("同步读取>>>\n" + data.toString());

    let inp_str = data.toString();

    return inp_str;

}


/**
 * 返回 code 内容
 * @param {md 的 ```字符`}} str 
 */
function get_code_content(str) {
    str = str.replace(/```.*/, "");
    str = str.replace(/```/, "");
    // str.replace("```","");
    return str;
}

/**
 * 
 * @param {md的源代码}} str 
 */
function check_language(str) {
    language_type = "js"
    return language_type;
}


function reg_main(inp_str) {
    // console.log("程序执行完毕。");

    // let str = 
    let txt = inp_str.replace("victor", "nancy");

    // console.log("txt>>>: " + txt);

    // let patt=new RegExp(pattern,modifiers);

    // let res = "(.*?)\n)".exec("The best things in life are free!");
    // res.array.forEach(element => {
    // console.log("element>>>: " + element);

    // });

    // 定义 最终结果的数组
    let res_arr = [];


    // 分割 每行
    let txt_arr = txt.split("\r\n");

    for (let key in txt_arr) {
        // console.log("key>>>"+txt_arr[key])
        let curr_line = txt_arr[key]
        let curr_word_arr = split_one_line(curr_line);
        res_arr_currline = [];
        for (let curr_word in curr_word_arr) {
            let color_type = check_str_type(curr_word_arr[curr_word]);
            inner = {
                "color_type": color_type,
                "content": curr_word_arr[curr_word],
            }

            res_arr_currline.push(inner);
        }

        res_arr.push(res_arr_currline)

    }

    return res_arr;
    // console.log(res_arr);
}




/**
 * 
 * @param {一行字符串} str 
 */
function split_one_line(str) {

    // demo 
    // let str="The rain in SPAIN stays mainly in the plain"; 
    // let n =str.match(/ain/g);
    // ain,ain,ain


    // 数字字母下划线(连续) 或者 不是数字字母下划线(分开)
    
    // let txt_arr = str.match(/\s+|\S+/g);
    let txt_arr = str.match(/[0-9a-zA-Z_]{1,}|[^0-9a-zA-Z_]{1,1}/g);
    // let txt_arr = str.match(/\s+/g);
    // console.log("txt_arr>>>");
    // console.log(txt_arr);
    return txt_arr;
}

/**
 * 
 * @param {一个单词或者标识符} str 
 */
function check_str_type(str) {
    /**
     * 读取配置文件
     * 
     */
    let conf = read_file("./config/"+check_language(str)+".json")
    // console.log("conf>>>"+conf)

    let config = JSON.parse(conf)
    console.log("conf>>>" + config)


    for (let key in config) {
        let arr = config[key];

        // console.log(item); //AA,BB,CC,DD

        for (let curr_key in arr) {
            if (str == arr[curr_key]) {
                return key;
            }
            // }

            // if (str == "victor") {
            //     return 1;
            // } else if (str == "nancy") {
            //     return 2;
            // } else if (str == "let") {
            //     return 3;

        }
    }


    
    // 继续判断
    /**
    实例
    var patt = /e/;
    patt.test("The best things in life are free!");
    字符串中含有 "e"，所以该实例输出为：

    true
    */

    // 是否是纯数字
    var patt_number = /\d+/;
    if (patt_number.test(str)) return "number"
    var patt_string = /\s+/;
    if (patt_string.test(str)) return "string"
        
    
    // 是否是纯字母

    return "other";
    // else {
    // return 0;
    // }

}





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


// main



let txt = get_code_content(read_file("README.md"))
let res_arr = reg_main(txt);
console.log(res_arr);
// let res_arr = "arst"
// write_file("res",res_arr.toString())


// console.log(get_code_content("```js\n```"))
