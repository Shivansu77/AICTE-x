import React from 'react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default BentoCard;
