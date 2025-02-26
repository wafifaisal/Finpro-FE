"use client";

import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: "all" | "new" | "waiting_payment" | "completed";
  setFilterStatus: React.Dispatch<
    React.SetStateAction<"all" | "new" | "waiting_payment" | "completed">
  >;
  reservationNo: string;
  setReservationNo: React.Dispatch<React.SetStateAction<string>>;
  filterCheckIn: Date | null;
  setFilterCheckIn: React.Dispatch<React.SetStateAction<Date | null>>;
  filterCheckOut: Date | null;
  setFilterCheckOut: React.Dispatch<React.SetStateAction<Date | null>>;
  showFilterOptions: boolean;
  setShowFilterOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  reservationNo,
  setReservationNo,
  filterCheckIn,
  setFilterCheckIn,
  filterCheckOut,
  setFilterCheckOut,
  showFilterOptions,
  setShowFilterOptions,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 mb-8 sticky top-4 md:top-28 z-20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama properti"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all duration-300"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-lg transition-all duration-300"
          >
            <FaFilter />
            <span>Filter</span>
          </button>
          <AnimatePresence>
            {showFilterOptions && (
              <motion.div
                className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl p-4 min-w-[250px] z-30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="flex flex-col gap-4">
                  {["all", "new", "waiting_payment", "completed"].map(
                    (statusOption) => (
                      <button
                        key={statusOption}
                        onClick={() => {
                          setFilterStatus(
                            statusOption as
                              | "all"
                              | "new"
                              | "waiting_payment"
                              | "completed"
                          );
                          setShowFilterOptions(false);
                        }}
                        className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                          filterStatus === statusOption
                            ? "bg-rose-100 text-rose-700 font-medium"
                            : ""
                        }`}
                      >
                        {statusOption === "all"
                          ? "Semua Pesanan"
                          : statusOption === "new"
                          ? "Menunggu Pembayaran"
                          : statusOption === "waiting_payment"
                          ? "Sedang Diproses"
                          : statusOption === "completed"
                          ? "Selesai"
                          : ""}
                      </button>
                    )
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      No. Reservasi
                    </label>
                    <input
                      type="text"
                      value={reservationNo}
                      onChange={(e) => setReservationNo(e.target.value)}
                      placeholder="Cari No. Reservasi"
                      className="mt-1 p-2 border rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Check-In
                    </label>
                    <input
                      type="date"
                      value={
                        filterCheckIn
                          ? filterCheckIn.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFilterCheckIn(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="p-2 border rounded-md"
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      value={
                        filterCheckOut
                          ? filterCheckOut.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setFilterCheckOut(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      className="p-2 border rounded-md"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilterOptions(false)}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;
