import React from "react";

const contextHoc = (WrappedComponent, contextTemp) => {
    let context = contextTemp;
    return class extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            const props = Object.assign({}, this.props, {
                context,
            });
            return <WrappedComponent {...props} />;
        }
    };
};

export default contextHoc;
