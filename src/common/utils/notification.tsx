import React from 'react'
import { notification, message, Modal } from 'antd'
import {
    HomeOutlined,
  } from '@ant-design/icons';
import { INFO, WARNING, SUCCESS, EXCEPTION_INFO, DATA_MODIFY_WARNING, TIMEOUT_INFO } from '../constants'


type MessageNoticeTypeAllT = {
    [WARNING]:"warning",
    [SUCCESS]:"success",
}
export const messageNotice = (type:keyof MessageNoticeTypeAllT=WARNING, content = '') => {
    message[type](content)
}
/**
 * 提示信息组件
 * @param message
 * @param description
 * @param type
 */
 export const openNotificationWithIcon = (message = '', description:string = '', type = INFO) => {
    Reflect.get(notification, type)({
        message,
        description,
        duration: 6,
        icon: <HomeOutlined type="smile" style={{ color: '#108ee9' }} />
    })
}


export const successByNotice = (content:string) => openNotificationWithIcon(SUCCESS, content)
export const successByMessage = (content:string) => messageNotice(SUCCESS, content)

export const warningByNotice = (content:string) => openNotificationWithIcon(WARNING, content)
export const warningByMessage = (content:string) => messageNotice(WARNING, content)

export const timeoutByNotice = () => openNotificationWithIcon(WARNING, TIMEOUT_INFO)
export const timeoutByMessage = () => messageNotice(WARNING, TIMEOUT_INFO)

export const exceptionByNotice = () => openNotificationWithIcon(WARNING, EXCEPTION_INFO)
export const exceptionByMessage = () => messageNotice(WARNING, EXCEPTION_INFO)

export const dataModifyWarningByModal = () =>
    Modal.warning({
        content: DATA_MODIFY_WARNING,
        okText: '知道了'
    })
