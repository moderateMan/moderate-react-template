import BaseMock from './baseMock'
import { showPartAItem } from "COMMON/shapes";
let config = {
    fetchHeavyAdd: {
        code: "200",
        data: {
            test: 1
        },
    },
    fetchUpdate: {
        code: "200",
        data: {
            test: 1
        }
    },
    fetchDetail: {
        code: "200",
        data: {
            heavyName:"test1",
            showPartA:[showPartAItem(),showPartAItem()]
        }
    },
    fetchHeavyInit: {
        code: "200",
        data: {
            lightList:[],
            linkSelectOptionList:[]
        }
    },
}

export default function mock(api){
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}

