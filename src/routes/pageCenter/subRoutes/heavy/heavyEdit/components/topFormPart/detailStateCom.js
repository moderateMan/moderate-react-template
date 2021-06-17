import React, { Fragment } from "react";
import "./index.scss";
import injectInternational from "COMMON/hocs/intlHoc";
export default injectInternational("heavy")((props) => {
    const { topFormPart, targetshowAArr, intlData } = props;
    const {
        noOverNight,
        noInterline,
        selectProperty,
        operateSearchSelects,
        notOperateSearchSelects,
        baseSwitch,
    } = targetshowAArr;
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
                    {`${intlData.heavyPage_showType}:`}
                </div>
                <div>
                    {
                        {
                            1: intlData.heavyPage_NONSTOP,
                            3: intlData.heavyPage_Complex,
                        }[topFormPart]
                    }
                </div>
            </div>

            <div className="itFormItem itFormItemFlex">
                {topFormPart === 3 ? (
                    <Fragment>
                        <div className="itFormItemFlex2">
                            <div
                                className={
                                    !noOverNight ? "redPoint" : "noRedPoint"
                                }
                            ></div>

                            <span>
                                {noOverNight && intlData.heavyPage_no}
                                {intlData.heavyPage_overNight}
                            </span>
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <div>
                            <div className="itFormItemFlex2">
                                {baseSwitch == 1 ? (
                                    <div className="noRedPoint"></div>
                                ) : (
                                    <div className="redPoint"></div>
                                )}
                                <span>
                                    {baseSwitch == 1
                                        ? ""
                                        : intlData.heavyPage_not}
                                    {intlData.heavyPage_allowCodeShare}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="itFormItemText2">
                                {intlData.heavyPage_searchSelects}:
                            </span>
                            <span className="itFormItemText2">{selectProperty}</span>
                        </div>
                        {baseSwitch == 1 && (
                            <div>
                                <span className="itFormItemText2">
                                    {!useFlagInitValue &&
                                        intlData.heavyPage_not2}
                                    {intlData.heavyPage_compoundSelect}:
                                </span>
                                <span className="itFormItemText2">
                                    {searchSelectInitValue}
                                </span>
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
});
