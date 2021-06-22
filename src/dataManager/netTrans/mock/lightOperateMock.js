import BaseMock from './baseMock'

let config = {
    fetchLightAdd: {
        code: "200",
        data: {
        }
    },
    fetchLightUpdate: {
        code: "200",
        data: {
        }
    },
    fetchLightDetail: (data) => {
        const { body = {} } = data;
        let params = JSON.parse(body);
        if (params.id === "0") {
            return {
                code: "200",
                data: [{
                    lightName: "test_lightName_0",
                    comment: "test_comment_0",
                    lightItems: [{ lightItemId: 1, lightType: 0, baseSelect: 1, exclude: false }]
                }]
            }
        } else if (params.id === "1") {
            return {
                code: "200",
                data: [{
                    lightName: "test_lightName_1",
                    comment: "test_comment_1",
                    lightItems: [{ lightItemId: 1, lightType: 0, baseSelect: 0, exclude: false }, { lightItemId: 2, lightType: 1, baseSelect: 1, exclude: false }]
                }]
            }
        }

    },
    fetchTestDataList: {
        code: "200",
        data: {
            test: "te123123123123123st",
            WORLD: ["xxx"]
        }
    }
}

export default function mock(api) {
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}