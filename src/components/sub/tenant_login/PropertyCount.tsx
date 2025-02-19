"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Komponen CountUp untuk animasi penghitung
const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // durasi 2 detik
    const interval = 30; // interval update dalam milidetik
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
    <motion.span className="text-5xl font-bold text-blue-600">
      {count.toLocaleString()}
    </motion.span>
  );
};

// Komponen utama untuk menampilkan jumlah properti
const PropertyCount = () => {
  const [propertyCount, setPropertyCount] = useState<number | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchPropertyCount = async () => {
      try {
        const response = await fetch(`${base_url}/property/property-count`);
        const data = await response.json();
        setPropertyCount(data.count);
      } catch (error) {
        console.error("Error fetching property count:", error);
      }
    };

    fetchPropertyCount();
  }, [base_url]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-medium text-gray-700">Total Properti:</p>
      {propertyCount !== null ? (
        <CountUp end={propertyCount} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PropertyCount;
