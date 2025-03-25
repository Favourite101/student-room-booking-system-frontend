import { useEffect } from 'react';

const usePullToRefresh = () => {
  useEffect(() => {
    let startY = 0;
    let touchStart = false;

    const touchStartHandler = (e) => {
      startY = e.touches[0].clientY;
      touchStart = window.scrollY === 0;
    };

    const touchMoveHandler = (e) => {
      if (!touchStart) return;
      
      const y = e.touches[0].clientY;
      if (y > startY + 100) { // 100px threshold
        window.location.reload();
      }
    };

    window.addEventListener('touchstart', touchStartHandler);
    window.addEventListener('touchmove', touchMoveHandler);

    return () => {
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
    };
  }, []);
};

export default usePullToRefresh;