//Nietzsche once said, don't always talk about yourself.
import React from 'react'
import { Collapse, Icon } from 'antd';
const { Panel } = Collapse;

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};

export default (props) => {
    const {children,info} = props;
    return <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
    >
        <Panel header={info} key="1" style={customPanelStyle}>
            <p>{children}</p>
        </Panel>
    </Collapse>
}