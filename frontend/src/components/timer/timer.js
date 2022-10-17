import React, { useEffect } from 'react';
import { useRef } from 'react';

const Timer = (props) => {
  const countRef = useRef(null);
  const [isActive, setIsActive] = [props.isActive, props.setIsActiveFunc];
  const [timer, setTimer] = [props.timer, props.setTimerFunc];

  useEffect(() => {
    countRef.current = isActive ? setInterval(() => { setTimer((timer) => timer + 1) }, 1000) : clearInterval(countRef.current);
  }, [isActive]);


  const activeStateChangeHandler = () => {
    setIsActive(!isActive);
  }

  const handleReset = () => {
    setIsActive(false);
    setTimer(0);
  }

  return (
    <span>
      <button onClick={activeStateChangeHandler}>{isActive ? 'Stop' : 'Start'} ({timer})</button>
      <button onClick={handleReset}>Reset</button>
    </span>
  );
}

export default Timer;
