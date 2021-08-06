import { get, set } from "lodash";

export const changeStoreState = (instance, paramsObj) => {
    const paramsEntries = Object.entries(paramsObj);
    if (paramsEntries.length) {
        for (let [key, value] of paramsEntries) {
            if (typeof value === "object") {
                set(instance, key, value);
            } else {
                const currentValue = get(instance, key);
                if (currentValue !== value) {
                    set(instance, key, value);
                }
            }
        }
    }
};

