import { motion } from 'framer-motion';
import React from 'react';

 const tabVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const AnimatedTabPanel = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      variants={tabVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};