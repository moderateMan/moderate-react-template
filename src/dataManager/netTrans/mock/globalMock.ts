import BaseMock from './baseMock'
import type BaseApi from "../api/baseApi";
import menuRemoteConfig from "@ROUTES/menuRemoteConfig.json";

let config = {
    getMenuApi: {
        code: "200",
        data: menuRemoteConfig
    },
    loginApi: {
        code: "200",
        data: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDM0M3poIiwiaXNzIjoidXNlckdVSS0xMjM0NTY3OCFAIyQlXiYqIiwiZXhwIjoxNjEwNTI3ODg3LCJ1c2VySWQiOiIxMDM0M3poIiwiaWF0IjoxNjEwNDQxNDg3LCJqdGkiOiIxNjEwNDQxNDg3MTA5MTAzNDMifQ.ENyqU7WGRdqPoqrkUW1sEff4fBTJShJL7ot7TFmRObc",
            userId: "007"
        }
    },
    logoutApi: {
        code: "200",
        data: {}
    },
    getCode: {
        code: "200",
        data: "aaaa"
    },
}

export default function mock(api:BaseApi) {
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}