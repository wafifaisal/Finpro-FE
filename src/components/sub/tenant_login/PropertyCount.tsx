"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const interval = 30;
    const step = end / (duration / interval);

    const counter = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(counter);
  }, [end]);

  return (
    <div className="relative">
      <motion.span
        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {count.toLocaleString()}
      </motion.span>
      <motion.div
        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.5 }}
      />
    </div>
  );
};

const PropertyCount = () => {
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchPropertyCount = async () => {
      try {
        const response = await fetch(`${base_url}/property/property-count`);
        const data = await response.json();
        setPropertyCount(data.count);
        setTimeout(() => setIsVisible(true), 300);
      } catch (error) {
        console.error("Error fetching property count:", error);
      }
    };

    fetchPropertyCount();
  }, [base_url]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1">
              <div className="bg-white rounded-xl p-6">
                <motion.div
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{
                      delay: 0.5,
                      duration: 0.8,
                      times: [0, 0.6, 1],
                    }}
                    className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center"
                  >
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                  </motion.div>

                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    Temukan Properti Impian Anda
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Pilihan properti terlengkap untuk kebutuhan Anda
                  </p>

                  <div className="relative mb-2">
                    <p className="text-gray-600 text-sm font-medium">
                      Total Properti
                    </p>
                    {propertyCount !== null ? (
                      <div className="mt-1">
                        <CountUp end={propertyCount} />
                        <motion.div
                          className="absolute -right-4 -top-4"
                          animate={{ rotate: [0, 15, 0, 15, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            delay: 1.2,
                          }}
                        ></motion.div>
                      </div>
                    ) : (
                      <div className="h-12 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyCount;
