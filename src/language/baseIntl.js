export default class intlBase {
    constructor(props) {
        const { config = {} } = props;
        this.data = {
            modalDeleteTitle: {
                en: `Are you sure to delete this data?`,
                zh: `确认删除这条数据吗?`,
            },
            modalDeleteContent: {
                en: `It cannot be restored after deletion!`,
                zh: `删除后不可恢复！`,
            },
            warn_select: {
                en: `Please select the item to delete!`,
                zh: `请选择要删除的项！`,
            },
            save: {
                en: `Save`,
                zh: `保存`,
            },
            cancel: {
                en: `Cancel`,
                zh: `取消`,
            },
            edit: {
                en: `Edit`,
                zh: `修改`,
            },
            rule_max_30: {
                en: `The maximum length allowed is 30 characters!`,
                zh: `最大长度为30！`,
            },
            rule_common: {
                en: `Please enter market name, input should be letter,digit , '-' or '_'!`,
                zh: `请输入market名称，英文字母，数字或,"_" or " - "`,
            },
            rule_number: {
                en: `Please enter number!`,
                zh: `请输入数字!`,
            },
            rule_require: {
                en: `Cannot be empty!`,
                zh: `不可为空`,
            },
            placeholder_select: {
                en: `Please Select`,
                zh: `请选择`,
            },
            placeholder_input: {
                en: `Please input `,
                zh: `请输入`,
            },
            action: {
                en: "Actions ",
                zh: "操作",
            },
            add: {
                en: "Add",
                zh: "添加",
            },
            delete: {
                en: "Delete  ",
                zh: "删除",
            },
            search: {
                en: "Search",
                zh: "搜索",
            },
            NO: {
                en: "NO.",
                zh: "序号",
            },
            comment: {
                en: "Comment ",
                zh: "描述",
            },
            weight: {
                en: "Weight",
                zh: "权重",
            },
            warn_leastOne: {
                en: "At least one！",
                zh: "至少一条！",
            },
            no: {
                en: "No",
                zh: "否",
            },
            Yes: {
                en: "Yes",
                zh: "确认",
            },
            Yes: {
                en: "Yes",
                zh: "确认",
            },
            No: {
                en: "No",
                zh: "取消",
            },
            ...config,
        };
        this.targetData = [];
        this.zh = {};
        this.en = {};
    }
    //翻译
    formatMessage(fmFunc = () => { }) {
        if (typeof fmFunc !== "function") return undefined;
        let temp = [];
        for (let key in this.data) {
            temp.push(fmFunc({ id: key }));
        }
        return temp;
    }
    transF(target) {
        for (let key in target) {
            let value = target[key];
            this.zh = {
                [key]: value.zh,
                ...this.zh,
            };
            this.en = {
                [key]: value.en,
                ...this.en,
            };
        }
        return {
            zh: this.zh,
            en: this.en,
        };
    }
    getIntlData() {
        return this.data;
    }
}
