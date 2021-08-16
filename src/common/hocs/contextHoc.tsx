import React from "react";

function contextHoc<T>(
  WrappedComponent: React.ComponentClass,
  contextTemp: React.Context<T>
): React.ComponentClass {
  let context = contextTemp;
  return class extends React.Component {
    render() {
      const props = Object.assign({}, this.props, {
        context,
      });
      return <WrappedComponent {...props} />;
    }
  };
}

export default contextHoc;
