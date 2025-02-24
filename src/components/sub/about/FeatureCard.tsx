"use client";
import React from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-gray-100 rounded-lg">
        <Icon className="text-gray-900" size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default FeatureCard;
