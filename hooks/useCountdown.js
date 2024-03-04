import { useState, useEffect } from 'react';

const useCountdown = (minutes) => {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, seconds]);

  const startCountdown = () => {
    setIsActive(true);
  };

  const resetCountdown = () => {
    setIsActive(false);
    setSeconds(minutes * 60);
  };

  const formattedTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { countdown: formattedTime(), startCountdown, resetCountdown, isActive };
};

export default useCountdown;
