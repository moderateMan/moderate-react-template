import globalMock from "./globalMock"
import lightHomeMock from "./lightHomeMock"
import lightOperateMock from "./lightOperateMock"
import heavyHomeMock from "./heavyHomeMock"
import heavyOperateMock from "./heavyOperateMock"

import {
    globalApi,
    lightHomeApi,
    lightOperateApi,
    heavyOperateApi,
    heavyHomeApi
} from 'API/'

globalMock(globalApi);
lightHomeMock(lightHomeApi);
lightOperateMock(lightOperateApi);
heavyHomeMock(heavyHomeApi);
heavyOperateMock(heavyOperateApi);



