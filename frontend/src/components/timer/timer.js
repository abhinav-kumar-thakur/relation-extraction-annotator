import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faClock } from '@fortawesome/free-regular-svg-icons'

import { formatTime, useTimer } from './utils';

// const element = <FontAwesomeIcon icon={faClock} />

const Timer = () => {
  const { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0)

  return (
        <span className='TimerCard'>
          <p>{formatTime(timer)}</p>
          <div id="TimerButton">
            {
                !isActive && !isPaused ?
                <button onClick={handleStart}>Start</button>
                : (
                    isPaused ? <button onClick={handlePause}>Pause</button> :
                    <button onClick={handleResume}>Resume</button>
                )
            }
                <button onClick={handleReset} disabled={!isActive}>Reset</button>
          </div>
        </span>
  );
}

export default Timer;
