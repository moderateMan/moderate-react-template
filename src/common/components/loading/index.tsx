import React, { Component } from 'react'
import {
    HomeOutlined,
  } from '@ant-design/icons';
import { Spin } from 'antd'
import './index.scss'

const antIcon = <HomeOutlined type="loading" spin />

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