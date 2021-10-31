var str = "```js\n" +
    "var victor = \"fengming\";\n" +
    "function check_str_type(str) {\n" +
    "    console.log(11111) ;\n" +
    "}\n" +
    "let a = \"_34_ast\"\n" +
    "let b = \"test004\"\n" +
    "```"

// var language_type = str.search(/```(.+)/g);
// var language_type = str.match(/```(.*)\r\n/);
// console.log("language_type>>>", language_type[1])


// 是否是纯数字
var patt_number = /\d+/g;
if (patt_number.test(str)) {
    console.log("number>>>")

} else {
    console.log("no number>>>no ")

}
// var patt_string = /\w+/;

var str2 = "你好"
console.log(str2.length)