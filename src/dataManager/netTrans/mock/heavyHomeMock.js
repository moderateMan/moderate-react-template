import BaseMock from './baseMock'
let config = {
    fetchPage: {
        code: "200",
        data: {
            result: [
                { no: 1, heavyName: "heavyNameTest1", baseSelect: 0, status: false, computedNo: 99, comment: "comment test1" },
                { no: 2, heavyName: "heavyNameTest2", baseSelect: 0, status: false, computedNo: 99, comment: "comment test2" }],
            pager: { pageCount: 10 }
        },
    },
    fetchLightDelete: {
        code: "200",
        data: {
            test: 1
        }
    },
    fetchExchange: {
        code: "200",
        data: {
            test: 1
        }
    },
    fetchStatus: {
        code: "200",
        data: {
            test: 1
        }
    }
}

export default function mock(api) {
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}


