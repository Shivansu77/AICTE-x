import React from 'react';
import { motion } from 'framer-motion';

const UniversityCard = ({ university, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-card dark:bg-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-border-color hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
  >
    <div className="text-center">
      <div className="w-24 h-24 bg-card dark:bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform p-2">
        <img src={university.logo} alt={university.name} className="w-full h-full object-contain" />
      </div>
      <h4 className="text-lg font-bold text-primary mb-1">{university.name}</h4>
      <p className="text-sm text-secondary">{university.description}</p>
    </div>
  </motion.div>
);

export default UniversityCard;
