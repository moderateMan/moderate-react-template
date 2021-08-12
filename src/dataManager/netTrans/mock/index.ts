import globalMock from "./globalMock"
import lightHomeMock from "./lightHomeMock"
import lightOperateMock from "./lightOperateMock"

import {
    globalApi,
    lightHomeApi,
    lightOperateApi,
} from '@API/index'

globalMock(globalApi);
lightHomeMock(lightHomeApi);
lightOperateMock(lightOperateApi);



