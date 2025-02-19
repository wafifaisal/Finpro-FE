// components/PasswordField.tsx
"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  name: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  placeholder,
  show,
  onToggle,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {name === "newPassword" ? "Password Baru" : "Konfirmasi Kata Sandi"}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
        <Field
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-rose-500 text-sm mt-1"
      />
    </div>
  );
};

export default PasswordField;
