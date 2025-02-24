"use client";

import React from "react";
import { FieldArray } from "formik";
import { Calendar } from "lucide-react";
import { computeRecurringDates } from "@/helpers/HolidaysUtils";
import { CreateRoomTypeFormValues } from "@/types/createRoomTypes";
import SeasonalPriceItem from "./SeasonalPriceItem";

interface SeasonalPriceSectionProps {
  roomIndex: number;
  values: CreateRoomTypeFormValues;
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
}

const SeasonalPriceSection: React.FC<SeasonalPriceSectionProps> = ({
  roomIndex,
  values,
  setFieldValue,
}) => {
  const seasonalEntry = values.rooms[roomIndex].seasonal_prices;
  const updateRecurringDates = (
    idx: number,
    newStart: string,
    newEnd: string,
    newApplyWeekend: boolean,
    newApplyHoliday: boolean
  ) => {
    if (newApplyWeekend && newApplyHoliday) {
      const currentDates = seasonalEntry[idx]?.dates || [];
      setFieldValue(
        `rooms.${roomIndex}.seasonal_prices.${idx}.dates`,
        currentDates
      );
    } else if (newStart && newEnd && (newApplyWeekend || newApplyHoliday)) {
      const dates = computeRecurringDates(
        newStart,
        newEnd,
        newApplyWeekend,
        newApplyHoliday
      );
      setFieldValue(`rooms.${roomIndex}.seasonal_prices.${idx}.dates`, dates);
    } else {
      setFieldValue(`rooms.${roomIndex}.seasonal_prices.${idx}.dates`, []);
    }
  };

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
                {seasonalEntry.map((price, idx) => (
                  <SeasonalPriceItem
                    key={idx}
                    price={price}
                    index={idx}
                    roomIndex={roomIndex}
                    remove={remove}
                    setFieldValue={setFieldValue}
                    updateRecurringDates={updateRecurringDates}
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
