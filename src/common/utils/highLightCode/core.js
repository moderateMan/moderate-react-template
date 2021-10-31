// 定义全局变量

var language_type = "js";
var theme = "default";


// TODO 如何expose出去方法

/**
 *
 * @param file_path
 * @param {文件内容} data
 */

function write_file(file_path, data) {
    let fs = require('fs');
    fs.writeFileSync(file_path, data)
}


/**
 *
 * @param {string} file_path
 */
function read_file(file_path) {
    // console.log("start");
    let fs = require("fs")


    // 同步读取
    let data = fs.readFileSync(file_path);
    // console.log("同步读取>>>\n" + data.toString());

    return data.toString();

}


/**
 * 返回 code 内容
 * @param str
 */
function get_code_content(str) {
    // TODO 若有多个 ``` 代码块 该何去何从
    str = str.replace(/```.*/, "");
    str = str.replace(/```/, "");
    // str.replace("```","");
    return str;
}

/**
 *
 * @param str
 */
function check_language(str) {
    // TODO 多语言识别
    // 文件名拼接

    // 匹配```后面的单词
    // var str="The rain in SPAIN stays mainly in the plain";
    // var n=str.match(/ain/g);

    // var language_type = str.match(/```js/g);
    // var language_type = (str.match(/```(.+)/g));
    // console.log("language_type>>>",language_type)
    // language_type = "js"
    var language_type = str.match(/```(.+)\r\n/)[1];
    // console.log("language_type>>>",language_type[1])

    // let arr = [1,2,3];
    // arr.includes(1) // true
    let js_list = ['js', 'javascript', 'Js', 'Javascript', 'JavaScript', 'JAVASCRIPT', 'JS'];
    if (js_list.includes(language_type) !== -1) {
        return "js"
    }

    //循环的方式
    return language_type;
}


/**
 * 正则匹配主函数
 * @param inp_str
 * @param mode 模式
 * @returns {*[]}
 */
function reg_main(inp_str, mode) {

    // let txt = inp_str.replace("victor", "nancy");

    // });

    // 定义 最终结果的数组
    let res_arr = [];


    // 分割 每行
    let txt_arr = txt.split("\r\n");

    let res_arr_currline;
    for (let key in txt_arr) {
        // curr_line 当前行数据
        // console.log("key>>>"+txt_arr[key])
        let curr_line = txt_arr[key]
        let curr_word_arr = split_one_line(curr_line);
        res_arr_currline = [];
        for (let curr_word in curr_word_arr) {
            // curr_word_arr[curr_word] 当前单词
            let color_type = check_str_type(curr_word_arr[curr_word]);
            // inner 为 中间 数据
            // 如果模式为1
            if (mode === 1) {
                let inner = {
                    "color": theme_config[hight_light][color_type],
                    "content": curr_word_arr[curr_word],
                };
                res_arr_currline.push(inner);

            }

            if (mode === 2) {
                // for...of --ES6语法，
                // 可以遍历Array、Set、Map、String、TypedArray、arguments等可迭代对象
                // ，可以使用break、continue

                for (let char of curr_word_arr[curr_word]) {
                    let inner = {
                        "color": theme_config["hight_light"][color_type],
                        "content": char,
                    }
                    res_arr_currline.push(inner);
                }
            }


        }

        res_arr.push(res_arr_currline)

    }

    return res_arr;
}


/**
 *
 * @param {一行字符串} str
 */
function split_one_line(str) {

    // demo >>>
    // let str="The rain in SPAIN stays mainly in the plain"; 
    // let n =str.match(/ain/g);
    // ain,ain,ain


    // 分割
    // 数字字母下划线(连续) 或者 不是数字字母下划线(分开)

    // let txt_arr = str.match(/\s+|\S+/g);
    let txt_arr = str.match(/[0-9a-zA-Z_]{1,}|[^0-9a-zA-Z_]{1,1}/g);
    // let txt_arr = str.match(/\s+/g);
    // console.log("txt_arr>>>");
    // console.log(txt_arr);
    return txt_arr;
}

/**
 * 检查 字符串类型
 *
 * 通过 字符串拼接 对应的 配置文件 并读取
 *
 * @param {一个单词或者标识符} str
 */
function check_str_type(str) {
    /**
     * 读取配置文件
     *
     */

    let conf = "";
    try{
        //
        conf = read_file("./config/" + language_type + ".json")
    }catch(err){
        // 如果报错,
        // 走 默认 js 的 config
        conf = read_file("./config/" + "js" + ".json")
    }

    // console.log("conf>>>"+conf)

    let config = JSON.parse(conf)
    // console.log("conf>>>" + config)


    for (let key in config) {
        let arr = config[key];

        // console.log(item); //AA,BB,CC,DD

        // 遍历 配置文件的 字典
        for (let curr_key in arr) {
            if (str === arr[curr_key]) {
                return key;
            }
            // }

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

    /**
     * 正则表达式中以“^”开头；以“$”结尾。
     1、^：匹配输入字行首。如果设置了RegExp对象的Multiline属性，^也匹配“\n”或“\r”之后的位置。

     2、$：匹配输入行尾。如果设置了RegExp对象的Multiline属性，$也匹配“\n”或“\r”之前的位置。
     * @type {RegExp}
     */

    // 是否是纯数字
    var patt_number = /^\d+$/;
    if (patt_number.test(str)) return "number"
    var patt_string = /^\w+/;
    if (patt_string.test(str)) return "string"


    // 是否是纯字母

    return "other";

}

//
/**
 * 处理一行
 * @returns {*[]}
 */
function reg_one_line(one_line_txt) {


    // 定义 最终结果的数组
    let res_arr_currline = [];


    let curr_word_arr = split_one_line(one_line_txt);
    for (let curr_word in curr_word_arr) {
        // curr_word_arr[curr_word] 当前单词
        let color_type = check_str_type(curr_word_arr[curr_word]);
        // inner 为 中间 数据
        // 如果模式为1
        // if (mode === 1) {
        //     let inner = {
        //         "color": theme_config[hight_light][color_type],
        //         "content": curr_word_arr[curr_word],
        //     };
        //     res_arr_currline.push(inner);
        //
        // }

        // if (mode === 2) {
        // for...of --ES6语法，
        // 可以遍历Array、Set、Map、String、TypedArray、arguments等可迭代对象
        // ，可以使用break、continue

        for (let char of curr_word_arr[curr_word]) {
            let inner = {
                "color": theme_config["hight_light"][color_type],
                "content": char,
            }
            res_arr_currline.push(inner);
        }

    }


    return res_arr_currline;
}

/**
 * 模式1
 * @param str
 * @returns {*[]}
 */
function reg_main_mode1(str) {
    return reg_main(str, 1)
}

/**
 * 模式2
 * @param str
 * @returns {*[]}
 */
function reg_main_mode2(str) {
    return reg_main(str, 2)
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
 * TODO 2. key number
 * TODO 3. arst
 *
 */




// exec


// 读取主题颜色
// theme =
var theme_config = JSON.parse(read_file("./theme/default.json"))

/**
 * README.md is this article file
 *
 */

// $###################### _____ init ______ ##################3
let ori = read_file("./doc/README.md")
// let ori = read_file("./doc/README2.md")
language_type = check_language(ori)
// $###################### _____ init ______ ##################3


// let txt = get_code_content(ori)
//
// // let res_arr = reg_main_mode1(txt);
// let res_arr = reg_main_mode2(txt);
// console.log(res_arr);
// let res_arr = "arst"
// write_file("res",res_arr.toString())


// console.log(get_code_content("```js\n```"))


// ###############################################

// 测试一行

console.log(reg_one_line("let a = \"arst123\""));

/**
 * [
 { color: '#519657', content: 'l' },
 { color: '#519657', content: 'e' },
 { color: '#519657', content: 't' },
 { color: '#000000', content: ' ' },
 { color: '#519657', content: 'a' },
 { color: '#000000', content: ' ' },
 { color: '#e57373', content: '=' },
 { color: '#000000', content: ' ' },
 { color: '#e57373', content: '"' },
 { color: '#519657', content: 'a' },
 { color: '#519657', content: 'r' },
 { color: '#519657', content: 's' },
 { color: '#519657', content: 't' },
 { color: '#519657', content: '1' },
 { color: '#519657', content: '2' },
 { color: '#519657', content: '3' },
 { color: '#e57373', content: '"' }
 ]

 */