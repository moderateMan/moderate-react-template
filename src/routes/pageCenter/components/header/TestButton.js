import React from 'react';
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import withMaterialHoc from 'COMMON/hocs/withMaterialHoc'
let menuItem = (props) => {
    const { handleLangSwitch,intlData } = props;
    return <Button
        onClick={handleLangSwitch}
        type="primary"
        ghost
        shape="round"
    >
        {intlData.header_intlBtn}
    </Button>
}
export default menuItem = withMaterialHoc(menuItem)
