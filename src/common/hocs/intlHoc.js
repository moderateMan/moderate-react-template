import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";
import language from "SRC/language";

function intlHoc(id) {
    return function (WrappedComponent) {
        @injectIntl
        @inject("global")
        class RefsHOC extends React.Component {
            constructor(props) {
                super(props);
                const { global: { locale } } = this.props
                this.state = {
                    formatedMessage: this.formatMessage(),
                    localeFlag: locale
                };
            }

            formatMessage() {
                const {
                    intl,
                } = this.props;
                const { formatMessage } = intl;
                let targetArr = language.getIntlById(id);
                let trmpArr = {};
                for (let key in targetArr) {
                    trmpArr[key] = formatMessage({ id: key });
                }
                return trmpArr;
            }
            shouldComponentUpdate() {
                const { global: { locale } } = this.props
                if (this.state.localeFlag !== locale) {
                    this.setState({
                        localeFlag: locale,
                        formatedMessage: this.formatMessage(),
                    })
                }
                return true
            }
            render() {
                const { formatedMessage } = this.state;
                const props = Object.assign({}, this.props, {
                    intlData: formatedMessage,
                });
                return <WrappedComponent {...props} />;
            }
        }
        return RefsHOC;
    };
}

export default intlHoc;
