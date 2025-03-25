import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/NetworkStatusBanner.css'

const NetworkStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
          className="network-banner offline"
        >
          You&apos;re offline. Some features may be unavailable.
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatusBanner;