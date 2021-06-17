import BaseMock from './baseMock'
let config = {
    fetchPage: {
        code: "200",
        data: {
            list: [{
                id: 0,
                lightName: "test_lightName_0",
                comment: "test_comment_0",
            }, {
                id: 1,
                lightName: "test_lightName_1",
                comment: "test_comment_1",
            }]
        },
    },
    fetchLightDelete: {
        code: "200",
        data: {
            test: 666
        }
    }
}

export default function mock(api) {
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}


