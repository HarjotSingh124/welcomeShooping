// src/context/LoaderContext.jsx
'use client';

import { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);

// src/components/GlobalLoader.jsx
import { useLoader } from '@/context/LoaderContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ShoppingBagIcon from '@/assets/shopping-bag.svg'; // Use a nice shopping bag SVG

export default function GlobalLoader() {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Image src={ShoppingBagIcon} alt="Loading..." width={80} height={80} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// src/app/layout.jsx
import { LoaderProvider } from '@/context/LoaderContext';
import GlobalLoader from '@/components/GlobalLoader';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoaderProvider>
          <GlobalLoader />
          {children}
        </LoaderProvider>
      </body>
    </html>
  );
}

// Example usage in any page
import { useLoader } from '@/context/LoaderContext';
import { useEffect } from 'react';

export default function ExamplePage() {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    showLoader();
    setTimeout(() => {
      hideLoader();
    }, 2000);
  }, []);

  return <div className="p-10">Page Content after Loader</div>;
}