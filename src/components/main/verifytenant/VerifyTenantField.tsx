"use client";

import { Form, Field } from "formik";
import {
  User,
  Lock,
  Phone,
  CheckCircle,
  Loader2,
  EyeOff,
  Eye,
} from "lucide-react";
import React from "react";
import { VerifyTenantFormValues } from "@/types/verifyTenant";

interface VerifyFormFieldsProps {
  values: VerifyTenantFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string | undefined };
  touched: { [key: string]: boolean | undefined };
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
}

const VerifyFormFields = ({
  values,
  handleChange,
  handleBlur,
  errors,
  touched,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isSubmitting,
}: VerifyFormFieldsProps) => {
  return (
    <Form className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Bisnis
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
              placeholder="Choose your name"
            />
            {touched.name && errors.name && (
              <div className="text-sm text-red-500">{errors.name}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {touched.password && errors.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi kata sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="text-sm text-red-500">
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Handphone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              type="text"
              name="no_handphone"
              value={values.no_handphone}
              onChange={handleChange}
              onBlur={handleBlur}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
              placeholder="Masukkan Nomor Handphone"
            />
            {touched.no_handphone && errors.no_handphone && (
              <div className="text-sm text-red-500">{errors.no_handphone}</div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:-translate-y-0.5"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Memverifikasi...
          </span>
        ) : (
          <span className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Verifikasi Lengkap
          </span>
        )}
      </button>
    </Form>
  );
};

export default VerifyFormFields;
