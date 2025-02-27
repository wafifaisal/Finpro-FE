"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
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
    <motion.span className="text-5xl font-bold text-rose-600">
      {count.toLocaleString()}
    </motion.span>
  );
};

const TenantCount = () => {
  const [tenantCount, setTenantCount] = useState<number | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchTenantCount = async () => {
      try {
        const response = await fetch(`${base_url}/tenant/tenant-count`);
        const data = await response.json();
        setTenantCount(data.count);
      } catch (error) {
        console.error("Error fetching tenant count:", error);
      }
    };

    fetchTenantCount();
  }, [base_url]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-medium text-gray-700">
        Total Tenant Terdaftar:
      </p>
      {tenantCount !== null ? <CountUp end={tenantCount} /> : <p>Loading...</p>}
    </div>
  );
};

export default TenantCount;
