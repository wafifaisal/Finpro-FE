"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, DollarSign, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Home className="w-10 h-10" />,
      title: "Sewakan dengan cara Anda",
      description:
        "Anda memiliki kendali penuh atas ruang, harga, dan aturan Anda. Kami memberikan fleksibilitas maksimal.",
      color: "from-rose-500 to-red-600",
      delay: 0.2,
    },
    {
      icon: <DollarSign className="w-10 h-10" />,
      title: "Dapatkan penghasilan tambahan",
      description:
        "Ubah ruang ekstra Anda menjadi penghasilan tambahan. Potensi pendapatan yang menjanjikan dengan pembayaran cepat.",
      color: "from-amber-500 to-yellow-600",
      delay: 0.4,
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Sewakan dengan percaya diri",
      description:
        "Kami menawarkan perlindungan kerusakan dan asuransi tanggung jawab untuk ketenangan pikiran Anda.",
      color: "from-blue-500 to-indigo-600",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-800 to-transparent opacity-20"></div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center mb-6"
        >
          Mengapa menjadi tenant di Nginepin?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16"
        >
          Dapatkan keuntungan dan kemudahan dalam menyewakan properti Anda
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: benefit.delay }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>

              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.6,
                  delay: benefit.delay + 0.3,
                  type: "spring",
                }}
                viewport={{ once: true }}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${benefit.color} text-white mb-6 shadow-lg`}
              >
                {benefit.icon}
              </motion.div>

              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-gray-600 text-lg">{benefit.description}</p>

              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r opacity-70"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, delay: benefit.delay + 0.4 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/auth/tenant/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Mulai Sekarang
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BenefitsSection;
