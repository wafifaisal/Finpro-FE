// components/UnavailableSection.tsx
"use client";

import React from "react";
import { FieldArray } from "formik";
import { X, Calendar } from "lucide-react";
import {
  EditRoomTypeFormValues,
  UnavailablePeriod,
} from "@/types/EditRoomTypes";

interface UnavailableSectionProps {
  roomIndex: number;
  values: EditRoomTypeFormValues;
  setFieldValue: <T>(field: string, value: T, shouldValidate?: boolean) => void;
}

const UnavailableSection: React.FC<UnavailableSectionProps> = ({
  roomIndex,
  values,
  setFieldValue,
}) => {
  const unavailableEntry: UnavailablePeriod[] =
    values.rooms[roomIndex].unavailable || [];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
      <div className="p-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Periode Tidak Tersedia
        </h3>
        <FieldArray name={`rooms.${roomIndex}.unavailable`}>
          {({ push, remove }) => (
            <div className="mt-4 space-y-4">
              {unavailableEntry.map((period, idx: number) => (
                <div key={idx} className="relative bg-gray-50 p-4 rounded-lg">
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        name={`rooms.${roomIndex}.unavailable.${idx}.start_date`}
                        value={period.start_date}
                        onChange={(e) =>
                          setFieldValue(
                            `rooms.${roomIndex}.unavailable.${idx}.start_date`,
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Selesai
                      </label>
                      <input
                        type="date"
                        name={`rooms.${roomIndex}.unavailable.${idx}.end_date`}
                        value={period.end_date}
                        onChange={(e) =>
                          setFieldValue(
                            `rooms.${roomIndex}.unavailable.${idx}.end_date`,
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  push({ start_date: "", end_date: "" } as UnavailablePeriod)
                }
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                + Tambah Periode Tidak Tersedia
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default UnavailableSection;
