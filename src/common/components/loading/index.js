import React, { Component } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './index.scss'

const antIcon = <LoadingOutlined spin />

class CommonLoading extends Component {
    render() {
        return (
            <div className="common-loading">
                <Spin indicator={antIcon} />
            </div>
        )
    }
}

export default CommonLoading