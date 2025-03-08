import React from "react";
import dynamic from "next/dynamic";
import { FormikProps } from "formik";
import { Position } from "@/types/index";
import { PropertyFormValues } from "@/types/propertyTypes";

const DynamicMap = dynamic(
  () => import("@/components/sub/create_property/map"),
  { ssr: false }
);

interface LocationSectionProps {
  formik: FormikProps<PropertyFormValues>;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  formik,
  position,
  setPosition,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Lokasi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Negara
          </label>
          <input
            {...formik.getFieldProps("country")}
            className={`w-full px-4 py-3 rounded-lg border ${
              formik.touched.country && formik.errors.country
                ? "border-rose-500"
                : "border-gray-300"
            } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
          />
          {formik.touched.country && formik.errors.country && (
            <div className="text-rose-500 text-sm">
              {typeof formik.errors.country === "string"
                ? formik.errors.country
                : ""}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kota
          </label>
          <input
            {...formik.getFieldProps("city")}
            className={`w-full px-4 py-3 rounded-lg border ${
              formik.touched.city && formik.errors.city
                ? "border-rose-500"
                : "border-gray-300"
            } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
          />
          {formik.touched.city && formik.errors.city && (
            <div className="text-rose-500 text-sm">
              {typeof formik.errors.city === "string" ? formik.errors.city : ""}
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Alamat
          </label>
          <input
            {...formik.getFieldProps("address")}
            className={`w-full px-4 py-3 rounded-lg border ${
              formik.touched.address && formik.errors.address
                ? "border-rose-500"
                : "border-gray-300"
            } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-rose-500 text-sm">
              {typeof formik.errors.address === "string"
                ? formik.errors.address
                : ""}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tandai Lokasi
        </label>
        <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
          <DynamicMap position={position} onPositionChange={setPosition} />
        </div>
        <p className="text-sm text-gray-500">
          Koordinat terpilih: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      </div>
    </div>
  );
};

export default LocationSection;
