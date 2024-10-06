import { useRef, useEffect, useCallback } from 'react';

const useDebounce = (callback, delay) => {
  const handlerRef = useRef(null);

  const debouncedFunction = useCallback((...args) => {
    if (handlerRef.current) {
      clearTimeout(handlerRef.current);
    }
    handlerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }
    };
  }, []);

  return debouncedFunction;
};

export default useDebounce;
