import React from "react";
import dataMgr from '@DATA_MANAGER/index';

export default function useStores() {
    return React.useContext(dataMgr.MobXProviderContext);
}
