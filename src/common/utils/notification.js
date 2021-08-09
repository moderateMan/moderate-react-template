import React from 'react'
import { notification, message, Modal } from 'antd'
import {
    HomeOutlined,
  } from '@ant-design/icons';
import { INFO, WARNING, SUCCESS, EXCEPTION_INFO, DATA_MODIFY_WARNING, TIMEOUT_INFO } from '../constants'

export const messageNotice = (type = INFO, content = '') => {
    message[type](content)
}
/**
 * 提示信息组件
 * @param message
 * @param description
 * @param type
 */
const openNotificationWithIcon = (message = '', description = '', type = INFO) => {
    notification[type]({
        message,
        description,
        duration: 6,
        icon: <HomeOutlined type="smile" style={{ color: '#108ee9' }} />
    })
}

export default openNotificationWithIcon

export const successByNotice = content => openNotificationWithIcon(SUCCESS, content)
export const successByMessage = content => messageNotice(SUCCESS, content)

export const warningByNotice = content => openNotificationWithIcon(WARNING, content)
export const warningByMessage = content => messageNotice(WARNING, content)

export const timeoutByNotice = () => openNotificationWithIcon(WARNING, TIMEOUT_INFO)
export const timeoutByMessage = () => messageNotice(WARNING, TIMEOUT_INFO)

export const exceptionByNotice = () => openNotificationWithIcon(WARNING, EXCEPTION_INFO)
export const exceptionByMessage = () => messageNotice(WARNING, EXCEPTION_INFO)

export const dataModifyWarningByModal = () =>
    Modal.warning({
        content: DATA_MODIFY_WARNING,
        okText: '知道了'
    })
