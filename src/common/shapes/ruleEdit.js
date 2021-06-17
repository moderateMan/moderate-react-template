import { uuid } from "COMMON/utils";
export const showPartAItem = () => {
    return {
        nodeId: 1,
        topFormPart: 1, //默认值：1-简易
        showPartCList: [
            {
                position: 1,
                key: uuid(),
                selectProperty: "ALL",
            }
        ],
        showPartBList: [{ position: 1, key: uuid() }],
    };
};

export const showPartBItem = () => {
    return { position: 1, key: uuid() };
};

export const showPartCItem = () => {
    return {
        position: 1,
        key: uuid(),
        selectProperty: "ALL",
    };
};
