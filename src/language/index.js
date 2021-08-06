import light from "./light";
import heavy from "./heavy";
import menuTitle from "./menuTitle";
import header from './header'

import zhCN from "./zh-CN";
import enUS from "./en-US";
let zh = { ...zhCN };
let en = { ...enUS };

class language {
    constructor() {
        this.allNeedTotransF = {
            light,
            heavy,
            menuTitle,
            header
        };
    }

    getIntlById(id) {
        if (id in this.allNeedTotransF) {
            return this.allNeedTotransF[id].getIntlData();
        }
        return undefined;
    }

    static transF(target) {
        for (let item in target) {
            let value0 = target[item].getIntlData();
            for (let key in value0) {
                let value = value0[key];
                zh = {
                    [key]: value.zh,
                    ...zh,
                };
                en = {
                    [key]: value.en,
                    ...en,
                };
            }
        }
        return {
            "zh":zh,
            "en":en,
        };
    }

    getData() {
        let data = language.transF(this.allNeedTotransF);
        return data
    }
}

export default new language();
