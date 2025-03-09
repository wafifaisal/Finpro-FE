import React from "react";
import "react-quill/dist/quill.snow.css";
import { FormikProps } from "formik";
import dynamic from "next/dynamic";
import { PropertyFormValues } from "@/types/propertyTypes";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface BasicInfoSectionProps {
  formik: FormikProps<PropertyFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formik }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nama Properti
          </label>
          <input
            {...formik.getFieldProps("name")}
            className={`w-full px-4 py-3 rounded-lg border ${
              formik.touched.name && formik.errors.name
                ? "border-rose-500"
                : "border-gray-300"
            } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-rose-500 text-sm">
              {typeof formik.errors.name === "string" ? formik.errors.name : ""}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <input
            {...formik.getFieldProps("category")}
            placeholder="mis :Hotel, Villa, Apartmen, Resor, Guest House"
            className={`w-full px-4 py-3 rounded-lg border ${
              formik.touched.category && formik.errors.category
                ? "border-rose-500"
                : "border-gray-300"
            } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
          />
          {formik.touched.category && formik.errors.category && (
            <div className="text-rose-500 text-sm">
              {typeof formik.errors.category === "string"
                ? formik.errors.category
                : ""}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <ReactQuill
          theme="snow"
          value={formik.values.desc}
          onChange={(content) => formik.setFieldValue("desc", content)}
          className={`w-full px-4 py-3 rounded-lg border ${
            formik.touched.desc && formik.errors.desc
              ? "border-rose-500"
              : "border-gray-300"
          } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
        />
        {formik.touched.desc && formik.errors.desc && (
          <div className="text-rose-500 text-sm">
            {typeof formik.errors.desc === "string" ? formik.errors.desc : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
