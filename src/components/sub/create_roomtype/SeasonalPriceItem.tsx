"use client";

import React from "react";
import { X } from "lucide-react";
import { formatCurrency } from "@/helpers/formatCurrency";
import { getHolidayName } from "@/helpers/HolidaysUtils";
import { getComputedDates } from "@/hooks/getComputeDates";
import { SeasonalPriceItemProps } from "@/types/SeasonalPriceItemProps";

const SeasonalPriceItem: React.FC<SeasonalPriceItemProps> = ({
  price,
  index,
  roomIndex,
  remove,
  setFieldValue,
  updateRecurringDates,
}) => {
  const parseCurrency = (value: string): number =>
    parseInt(value.replace(/[^\d]/g, "")) || 0;

  const recurringActive = price.apply_weekend || price.apply_holiday;

  return (
    <div className="relative bg-gray-50 p-4 rounded-lg">
      <button
        type="button"
        onClick={() => remove(index)}
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
            name={`rooms.${roomIndex}.seasonal_prices.${index}.price`}
            value={formatCurrency(price.price)}
            onChange={(e) => {
              const parsed = parseCurrency(e.target.value);
              setFieldValue(
                `rooms.${roomIndex}.seasonal_prices.${index}.price`,
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
            name={`rooms.${roomIndex}.seasonal_prices.${index}.start_date`}
            value={price.start_date}
            onChange={(e) => {
              const newStart = e.target.value;
              setFieldValue(
                `rooms.${roomIndex}.seasonal_prices.${index}.start_date`,
                newStart
              );
              updateRecurringDates(
                index,
                newStart,
                price.end_date,
                price.apply_weekend ?? false,
                price.apply_holiday ?? false
              );
            }}
            disabled={recurringActive}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
          {price.start_date && getHolidayName(price.start_date) && (
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
            name={`rooms.${roomIndex}.seasonal_prices.${index}.end_date`}
            value={price.end_date}
            onChange={(e) => {
              const newEnd = e.target.value;
              setFieldValue(
                `rooms.${roomIndex}.seasonal_prices.${index}.end_date`,
                newEnd
              );
              updateRecurringDates(
                index,
                price.start_date,
                newEnd,
                price.apply_weekend ?? false,
                price.apply_holiday ?? false
              );
            }}
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
            name={`rooms.${roomIndex}.seasonal_prices.${index}.apply_weekend`}
            checked={price.apply_weekend ?? false}
            onChange={(e) => {
              const checked = e.target.checked;
              setFieldValue(
                `rooms.${roomIndex}.seasonal_prices.${index}.apply_weekend`,
                checked
              );
              if (checked) {
                setFieldValue(
                  `rooms.${roomIndex}.seasonal_prices.${index}.apply_holiday`,
                  false
                );
              }
              updateRecurringDates(
                index,
                price.start_date,
                price.end_date,
                checked,
                checked ? false : price.apply_holiday ?? false
              );
            }}
            className="h-4 w-4"
          />
          <span className="text-sm">Terapkan untuk setiap akhir pekan</span>
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name={`rooms.${roomIndex}.seasonal_prices.${index}.apply_holiday`}
            checked={price.apply_holiday ?? false}
            onChange={(e) => {
              const checked = e.target.checked;
              setFieldValue(
                `rooms.${roomIndex}.seasonal_prices.${index}.apply_holiday`,
                checked
              );
              if (checked) {
                setFieldValue(
                  `rooms.${roomIndex}.seasonal_prices.${index}.apply_weekend`,
                  false
                );
              }
              updateRecurringDates(
                index,
                price.start_date,
                price.end_date,
                checked ? false : price.apply_weekend ?? false,
                checked
              );
            }}
            className="h-4 w-4"
          />
          <span className="text-sm">Terapkan untuk hari libur</span>
        </label>
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Catatan: Jika opsi ini dicentang, kalender akan dinonaktifkan dan harga
        yang sama akan diterapkan pada semua tanggal yang memenuhi kriteria.
      </p>
      {recurringActive && price.start_date && price.end_date && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p className="text-sm font-medium text-gray-700">
            Daftar tanggal yang mendapatkan harga musiman:
          </p>
          {getComputedDates(price).length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {getComputedDates(price).map((d: Date | string, i: number) => {
                if (typeof d === "string") {
                  return <li key={i}>{d}</li>;
                } else if (isNaN(d.getTime())) {
                  return <li key={i}>Invalid Date</li>;
                } else {
                  return <li key={i}>{d.toISOString().split("T")[0]}</li>;
                }
              })}
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
};
export default SeasonalPriceItem;
