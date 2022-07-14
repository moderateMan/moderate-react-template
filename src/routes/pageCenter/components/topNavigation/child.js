
import React from 'react';
import PropTypes from 'prop-types';
 
const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
};
 
class Link extends React.Component {
  constructor(props) {
    super(props);
 
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
    this.state = {
      class: STATUS.NORMAL,
    };
  }
 
  onMouseEnter() {
    this.setState({
      class: STATUS.HOVERED,
    });
  }
 
  onMouseleave() {
    this.setState({
      class: STATUS.NORMAL,
    });
  }
 
  render() {
    return (
      <a
        className={this.state.class}
        href={this.props.page || '#'}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseleave}
      >
          123
        {this.props.children}
      </a>
    );
  }
}
 
Link.propTypes = {
  page: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
};
 
export default Link;