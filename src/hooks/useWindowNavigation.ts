import { useState, useEffect } from 'react';

function getWindowNavigation() {
  const { scrollY: scrolledAmount } = window;

  return {
    scrolledAmount,
  };
}

export default function useWindowNavigation() {
  const [windowNavigation, setWindowNavigation] = useState(
    getWindowNavigation()
  );

  useEffect(() => {
    function handleScroll() {
      setWindowNavigation(getWindowNavigation());
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return windowNavigation;
}
