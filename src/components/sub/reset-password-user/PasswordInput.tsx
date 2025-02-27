"use client";

import { Field, ErrorMessage } from "formik";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder: string;
  show: boolean;
  toggleShow: () => void;
}

export default function PasswordInput({
  name,
  label,
  placeholder,
  show,
  toggleShow,
}: PasswordInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
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
          onClick={toggleShow}
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
}
