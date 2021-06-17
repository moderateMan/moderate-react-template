import React, { useState, useEffect, useRef, Fragment,memo } from 'react';
import './index.css';
import { useSpring, animated } from 'react-spring';

function calcEventRelativePos(event) {
  const rect = event.target.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
function Ripple(props) {
  const [data, setData] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const isInit = useRef(true);
  const rippleEl = useRef(null);
  const { spawnData, handleRippleEnd ,handleInitSwitchInflFalg,isSwitchIntl} = props;
  const rippleAnim = useSpring({
    from: {
      ...props.style,
      ...data,
      transform: 'scale(0)',
      opacity: 1,
    },
    to: !isInit.current ? { opacity: 0, transform: 'scale(2)' } : {},
    config: {
      duration: props.duration || 300,
    },
    onRest: () => {
      // setData({ top: 0, left: 0, width: 0, height: 0 })
      handleRippleEnd()
    },
    reset: true
  });

  useEffect(() => {
    if (isInit.current) {
      isInit.current = false;
    } else {
      const parentEl = rippleEl.current.parentElement;
      const size = Math.max(parentEl.offsetWidth, parentEl.offsetHeight);
      setData({
        width: size,
        height: size,
        top: spawnData.y - size / 2 || 0,
        left: spawnData.x - size / 2 || 0
      });
    }
  }, [spawnData]);
  return (
    <animated.span
          className="g-ripple"
          style={rippleAnim}
          ref={rippleEl}
        ></animated.span>
  );
}

Ripple = memo(Ripple)

export { Ripple, calcEventRelativePos };
