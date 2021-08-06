import React from 'react';
import { Ripple, calcEventRelativePos } from './ripple';

let withMaterialHoc = (WrappedComponent) => {
  return class WithMaterial extends React.Component {
    constructor(props) {
      super(props)
      this.isSwitchIntl = false;
      this.state = {
        spawnData: "",
        clickCount: 0,
        isSwitchIntl: false
      }
    }

    handleClick = (event) => {
      this.setState({
        spawnData: calcEventRelativePos(event),
        time: Date.now(),
        clickCount: this.state.clickCount + 1
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.intlData != this.props.intlData) {
        return true;
      }
      if (nextState.clickCount && (nextState.clickCount - this.state.clickCount === 1)) {
        return true
      } else {
        return false
      }
    }

    handleRippleEnd = () => {
      let value = this.state.clickCount - 1
      if (value < 0) {
        value = 0
      }
      this.setState({
        clickCount: value
      })
    }

    render() {
      const { spawnData } = this.state;
      const { className, style } = this.props;
      return (
        <div
          className={`g-btn ${className || ' '}`}
          onClick={this.handleClick}
          style={style}
        >
          <WrappedComponent {...this.props} />
          <Ripple handleRippleEnd={this.handleRippleEnd} spawnData={spawnData} />
        </div>
      );
    }
  };
}

export default withMaterialHoc;


