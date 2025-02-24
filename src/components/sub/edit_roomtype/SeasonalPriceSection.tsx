"use client";

import React from "react";
import { FieldArray } from "formik";
import { Calendar } from "lucide-react";
import { computeRecurringDates } from "@/helpers/HolidaysUtils";
import SeasonalPriceItem from "./SeasonalPriceItem";
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
  const updateRecurringDates = (
    idx: number,
    start_date: string,
    end_date: string,
    apply_weekend: boolean | undefined,
    apply_holiday: boolean | undefined
  ) => {
    if (start_date && end_date && (apply_weekend || apply_holiday)) {
      const dates = computeRecurringDates(
        start_date,
        end_date,
        apply_weekend ?? false,
        apply_holiday ?? false
      );
      setFieldValue(`rooms.${roomIndex}.seasonal_prices.${idx}.dates`, dates);
    } else {
      setFieldValue(`rooms.${roomIndex}.seasonal_prices.${idx}.dates`, []);
    }
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
                {seasonalEntry.map((price, idx: number) => (
                  <SeasonalPriceItem
                    key={idx}
                    roomIndex={roomIndex}
                    idx={idx}
                    price={price}
                    remove={remove}
                    setFieldValue={setFieldValue}
                    updateRecurringDates={updateRecurringDates}
                    parseCurrency={parseCurrency}
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    push({
                      price: 0,
                      start_date: "",
                      end_date: "",
                      apply_weekend: false,
                      apply_holiday: false,
                      dates: [],
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
