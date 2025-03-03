"use client";

import React from "react";
import { motion } from "framer-motion";
import CountUp from "@/components/sub/tenant_login/countUp";
import PropertyCount from "@/components/sub/tenant_login/PropertyCount";

const JoinCommunitySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Bergabung dengan Komunitas{" "}
          <span className="text-rose-400">Nginepin</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden group"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500 opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity"></div>
            <CountUp />
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.4 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden group"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity"></div>
            <PropertyCount />
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.6 }}
              viewport={{ once: true }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default JoinCommunitySection;
