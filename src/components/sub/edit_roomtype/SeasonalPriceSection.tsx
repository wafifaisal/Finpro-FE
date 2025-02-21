// components/SeasonalPriceSection.tsx
"use client";

import React from "react";
import { FieldArray } from "formik";
import { Calendar, X } from "lucide-react";
import { formatCurrency } from "@/helpers/formatCurrency";
import { getHolidayName, computeRecurringDates } from "@/helpers/HolidaysUtils";
import { EditRoomTypeFormValues } from "@/types/EditRoomTypes";

interface SeasonalPriceSectionProps {
  roomIndex: number;
  values: EditRoomTypeFormValues;
  setFieldValue: <T>(field: string, value: T, shouldValidate?: boolean) => void;
}

const SeasonalPriceSection: React.FC<SeasonalPriceSectionProps> = ({
  roomIndex,
  values,
  setFieldValue,
}) => {
  const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/[^\d]/g, "")) || 0;
  };

  const seasonalEntry = values.rooms[roomIndex].seasonal_prices || [];

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Harga Musiman
          </h3>
          <FieldArray name={`rooms.${roomIndex}.seasonal_prices`}>
            {({ push, remove }) => (
              <div className="mt-4 space-y-4">
                {seasonalEntry.map((price, idx: number) => {
                  const recurringActive =
                    price.apply_weekend || price.apply_holiday;
                  const recurringDates =
                    recurringActive && price.start_date && price.end_date
                      ? computeRecurringDates(
                          price.start_date,
                          price.end_date,
                          price.apply_weekend || false,
                          price.apply_holiday || false
                        )
                      : [];
                  return (
                    <div
                      key={idx}
                      className="relative bg-gray-50 p-4 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Harga
                          </label>
                          <input
                            type="text"
                            name={`rooms.${roomIndex}.seasonal_prices.${idx}.price`}
                            value={formatCurrency(price.price)}
                            onChange={(e) => {
                              const parsed = parseCurrency(e.target.value);
                              setFieldValue(
                                `rooms.${roomIndex}.seasonal_prices.${idx}.price`,
                                parsed
                              );
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Masukkan harga"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCurrency(price.price)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Mulai
                          </label>
                          <input
                            type="date"
                            name={`rooms.${roomIndex}.seasonal_prices.${idx}.start_date`}
                            value={price.start_date}
                            onChange={(e) =>
                              setFieldValue(
                                `rooms.${roomIndex}.seasonal_prices.${idx}.start_date`,
                                e.target.value
                              )
                            }
                            disabled={recurringActive}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                          {price.start_date &&
                            getHolidayName(price.start_date) && (
                              <p className="text-xs text-red-600">
                                Hari Libur: {getHolidayName(price.start_date)}
                              </p>
                            )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Selesai
                          </label>
                          <input
                            type="date"
                            name={`rooms.${roomIndex}.seasonal_prices.${idx}.end_date`}
                            value={price.end_date}
                            onChange={(e) =>
                              setFieldValue(
                                `rooms.${roomIndex}.seasonal_prices.${idx}.end_date`,
                                e.target.value
                              )
                            }
                            disabled={recurringActive}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                          {price.end_date && getHolidayName(price.end_date) && (
                            <p className="text-xs text-red-600">
                              Hari Libur: {getHolidayName(price.end_date)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            name={`rooms.${roomIndex}.seasonal_prices.${idx}.apply_weekend`}
                            checked={price.apply_weekend || false}
                            onChange={(e) =>
                              setFieldValue(
                                `rooms.${roomIndex}.seasonal_prices.${idx}.apply_weekend`,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm">
                            Terapkan untuk setiap akhir pekan
                          </span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            name={`rooms.${roomIndex}.seasonal_prices.${idx}.apply_holiday`}
                            checked={price.apply_holiday || false}
                            onChange={(e) =>
                              setFieldValue(
                                `rooms.${roomIndex}.seasonal_prices.${idx}.apply_holiday`,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm">
                            Terapkan untuk hari libur
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Catatan: Jika opsi ini dicentang, kalender akan
                        dinonaktifkan dan harga yang sama akan diterapkan pada
                        semua tanggal yang memenuhi kriteria.
                      </p>
                      {recurringActive &&
                        price.start_date &&
                        price.end_date && (
                          <div className="mt-2 p-2 bg-gray-100 rounded">
                            <p className="text-sm font-medium text-gray-700">
                              Daftar tanggal yang mendapatkan harga musiman:
                            </p>
                            {recurringDates.length > 0 ? (
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {recurringDates.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Tidak ada tanggal yang memenuhi kriteria.
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    push({
                      price: 0,
                      start_date: "",
                      end_date: "",
                      apply_weekend: false,
                      apply_holiday: false,
                    })
                  }
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  + Tambah Harga Musiman
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      </div>
    </div>
  );
};

export default SeasonalPriceSection;
