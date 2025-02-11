import React from "react";
import "react-quill/dist/quill.snow.css";
import { FormikProps } from "formik";
import dynamic from "next/dynamic";
import { PropertyFormValues } from "./propertyForm";

interface TermsConditionsSectionProps {
  formik: FormikProps<PropertyFormValues>;
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const TermsConditionsSection: React.FC<TermsConditionsSectionProps> = ({
  formik,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Syarat & Ketentuan
      </label>
      <ReactQuill
        theme="snow"
        value={formik.values.terms_condition}
        onChange={(content) => formik.setFieldValue("terms_condition", content)}
        className={`w-full px-4 py-3 rounded-lg border ${
          formik.touched.terms_condition && formik.errors.terms_condition
            ? "border-rose-500"
            : "border-gray-300"
        } focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
      />
      {formik.touched.terms_condition && formik.errors.terms_condition && (
        <div className="text-rose-500 text-sm">
          {formik.errors.terms_condition}
        </div>
      )}
    </div>
  );
};

export default TermsConditionsSection;
