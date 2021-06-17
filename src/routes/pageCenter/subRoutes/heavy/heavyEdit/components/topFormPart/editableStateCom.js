import React, { Fragment } from "react";
import { Select, Checkbox, Row, Col } from "antd";
import CutomLinkSelect from "../cutomLinkSelect";
import "./index.scss";
import injectInternational from "COMMON/hocs/intlHoc";
export default injectInternational("heavy")((props) => {
    const {
        handleFcChange,
        handleDataChange,
        searchSelectData,
        targetshowAArr,
        intlData,
    } = props;
    const {
        topFormPart = 3,
        noOverNight = 0,
        noInterline = 0,
        selectProperty,
        operateSearchSelects,
        notOperateSearchSelects,
        baseSwitch,
    } = targetshowAArr || {};
    let useFlagInitValue = true,
        searchSelectInitValue = "ALL";
    if (operateSearchSelects) {
        useFlagInitValue = true;
        searchSelectInitValue = operateSearchSelects;
    } else if (notOperateSearchSelects) {
        useFlagInitValue = false;
        searchSelectInitValue = notOperateSearchSelects;
    }
    return (
        <div className="topFormPart">
            <div className="itFormItem">
                <div className="itFormItemText">
                    {intlData.heavyPage_showType}:
                </div>
                <div>
                    <Select
                        value={topFormPart}
                        style={{ width: 200 }}
                        onChange={handleFcChange}
                    >
                        <Select.Option value={1}>
                            {intlData.heavyPage_NONSTOP}
                        </Select.Option>
                        
                        <Select.Option value={3}>
                            {intlData.heavyPage_Complex}
                        </Select.Option>
                    </Select>
                </div>
            </div>

            <div className="itFormItem itFormItemFlex">
                {topFormPart === 3 ? (
                    <Fragment>
                        <Checkbox
                            checked={noOverNight}
                            onChange={(e) => {
                                handleDataChange({
                                    noOverNight: e.target.checked ? 1 : 0,
                                });
                            }}
                        >
                            {intlData.heavyPage_baseCheck}
                        </Checkbox>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Row
                            type="flex"
                            align="bottom"
                            style={{ width: "100%" }}
                        >
                            <Col span={8}>
                                <Checkbox
                                    checked={baseSwitch}
                                    onChange={(e) => {
                                        handleDataChange({
                                            baseSwitch: e.target.checked
                                                ? 1
                                                : 0,
                                        });
                                    }}
                                >
                                    {intlData.heavyPage_baseCheck}
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <div>
                                    <div className="itFormItemText3">
                                        {intlData.heavyPage_compoundSelect}:
                                    </div>
                                    <CutomLinkSelect
                                        disable={!baseSwitch}
                                        useFlagInitValue={useFlagInitValue}
                                        searchSelectInitValue={
                                            searchSelectInitValue
                                        }
                                        handleChange={(value) => {
                                            handleDataChange({
                                                ...value,
                                            });
                                        }}
                                        dataSource={searchSelectData}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Fragment>
                )}
            </div>
        </div>
    );
});
