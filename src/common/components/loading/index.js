import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import './index.scss'

const antIcon = <Icon type="loading" spin />

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