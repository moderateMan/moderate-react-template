import _, { indexOf } from 'lodash';
let typeArr = [
    "bigInt",
    "boolean",
    "string",
    "symbol",
    "undefined",
    "object",
    "number",
    "function",
    "array"
]
export default class BaseApiShape {
    constructor(props) {
        const { config } = props;
        this.config = config;
        this.checkReport = []
    }
    process(config) {
        for (let key in config) {
            this[key] = _.cloneDeep(config[key])
        }
    }

    checkReqParams({ apiName, params }) {
        if (apiName in this.config) {
            return this.check({
                required: this.config[apiName].reqParam,
                current: params
            })
        }
    }

    checkResParams({ apiName, params }) {
        if (apiName in this.config) {
            return this.check({
                required: this.config[apiName].resParam,
                current: params
            })
        }
    }
    checkArr({ required, current = [], logPrefix }) {
        current.forEach((item, index) => {
            this.checkObj({
                required: required,
                current: item,
                logPrefix: logPrefix + `[${index}]`
            })
        })
    }
    check({ required = {}, current }) {
        if (required.type === "array" || Array.isArray(required.type)) {
            if (Array.isArray(current)) {
                if (required._item) {
                    this.checkArr({
                        required: required._item,
                        current: current,
                        logPrefix: "整体"
                    })
                }
            } else {
                this.checkReport.push({ property: "整体", message: `要求数组!` })
            }
        } else {
            this.checkObj({ required, current })
        }
        let temp = [...this.checkReport];
        this.checkReport= []
        return temp;
    }
    //如果上来是数组，实际上其实判断就是自己的内部的元素，那就是判断多个对象了
    checkObj({ required = {}, current = {}, logPrefix }) {
        for (let key in required) {
            let checkOption = required[key];
            if (Object.keys(checkOption).length) {
                const { isRequired = true, type } = checkOption;
                if (type === "array" || Array.isArray(type)) {
                    if (checkOption._item) {
                        this.checkArr({
                            required: checkOption._item,
                            current: current[key],
                            logPrefix: ` ${logPrefix + "->" + key}`
                        })
                    }
                    continue;
                }
                //校验-是否存在
                if (isRequired && !(key in current)) {
                    this.checkReport.push({ property: key, message: `入参中并没有指定要求的属性：${key}` })
                }
                //校验-类型
                if ((typeArr.indexOf(type) != -1) || typeof type in typeArr || Array.isArray(type)) {
                    let typeTemp;
                    if (typeArr.indexOf(type) != -1) {
                        typeTemp = type;
                    } else {
                        typeTemp = typeof type;
                    }
                    if (typeTemp !== typeof current[key]) {
                        this.checkReport.push({ property: key, message: `${logPrefix && ('数组' + logPrefix)}:入参中指定要求的属性类型不对，yes-${typeTemp}：no-${typeof current[key]}` })
                    }
                }
            }
        }
    }
}