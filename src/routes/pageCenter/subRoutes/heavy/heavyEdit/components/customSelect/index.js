import React from "react";
import { Select, Icon, Divider } from "antd";
let Option = Select.Option;

export default function renderCustomSelect({
    btnText,
    drawerTableType,
    optionArr,
    inputAttrConfig,
    target,
    switchDrawerShow,
    handleChange,
    dropdownRender,
    intlData,
}) {
    return (
        <Select
            onChange={handleChange}
            dropdownRender={
                dropdownRender
                    ? dropdownRender
                    : (menu) => (
                          <div>
                              {menu}
                              <Divider style={{ margin: "4px 0" }} />
                              <div
                                  style={{
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                  }}
                                  onMouseDown={(e) => {
                                      switchDrawerShow
                                          ? switchDrawerShow(
                                                true,
                                                drawerTableType
                                            )
                                          : target.setState({
                                                drawerTableType,
                                                isShowDrawer: true,
                                            });
                                  }}
                              >
                                  <Icon type="plus" />{" "}
                                  {`${intlData ? intlData.add : "add"} ${
                                      btnText || drawerTableType.toUpperCase()
                                  }`}
                              </div>
                          </div>
                      )
            }
            {...inputAttrConfig}
        >
            {optionArr &&
                optionArr.length > 0 &&
                optionArr.map((item) => {
                    return (
                        <Option value={item[0]} key={item}>
                            {item[1]}
                        </Option>
                    );
                })}
        </Select>
    );
}
