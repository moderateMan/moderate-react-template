import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const propTypes = {
    /** 执行动画 */
    action: PropTypes.bool,
    /** 切换的css动画的class名称 */
    toggleClass: PropTypes.string
}

const defaultProps = {
    action: false
}

/**
 * css过渡动画组件
 *
 * @visibleName Transition 过渡动画
 */
export default () => {
    return (props) => {
        const {
            className,
            action,
            toggleClass,
            children
        } = props
        return (
            <div
                className={
                    classnames({
                        transition: true
                    })
                }
                style={
                    {
                        position: 'relative',
                        overflow: 'hidden'
                    }
                }
            >
                <div
                    className={
                        classnames({
                            'transition-wrapper': true,
                            [className]: className,
                            [toggleClass]: action && toggleClass
                        })
                    }
                >
                    12312
                </div>
            </div>
        )
    }
}
