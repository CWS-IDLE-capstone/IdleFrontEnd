import React, {useCallback, useEffect, useState, useRef} from 'react';

export const useCounter = (initialValue: number, ms: number) => { //커스텀 hook 시간세는 함수
    const [count, setCount] = useState(initialValue); 
    const intervalRef = useRef(null);
    const startcnt = useCallback(() => {
      if (intervalRef.current !== null) {
        return;
      }
      intervalRef.current = setInterval(() => {
        setCount(c => c + 1);
      }, ms);
    }, []);
    const stop = useCallback(() => {
      if (intervalRef.current === null) {
        return;
      }
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }, [])
    const reset = useCallback(() => {
      setCount(0);
      stop();
    },[]);
    return {count, startcnt, stop, reset};
  }

  export const EuseCounter = (initialValue: number, ms: number) => { //커스텀 hook 시간세는 함수
    const [Ecount, setEcount] = useState(initialValue); 
    const intervalRef = useRef(null);
    const Estartcnt = useCallback(() => {
      if (intervalRef.current !== null) {
        return;
      }
      intervalRef.current = setInterval(() => {
        setEcount(c => c + 1);
      }, ms);
    }, []);
    const Estop = useCallback(() => {
      if (intervalRef.current === null) {
        return;
      }
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }, [])
    const Ereset = useCallback(() => {
      setEcount(0);
      Estop();
    },[]);
    return {Ecount, Estartcnt, Estop, Ereset};
  }




  // export default useCounter;