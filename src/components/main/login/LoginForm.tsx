// components/auth/LoginForm.tsx
import { Field, ErrorMessage } from "formik";
import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";

interface PasswordInputProps {
  showPassword: boolean;
  togglePassword: () => void;
}

export const PasswordInput = ({
  showPassword,
  togglePassword,
}: PasswordInputProps) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400" />
    </div>
    <Field
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Masukkan password"
      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
    />
    <button
      type="button"
      className="absolute inset-y-0 right-3 flex items-center"
      onClick={togglePassword}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
);

export const LoginForm = ({
  isLoading,
  showPassword,
  setShowPassword,
}: {
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Username / Email
      </label>
      <Field
        name="data"
        type="text"
        placeholder="Masukkan username atau email"
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
      />
      <ErrorMessage
        name="data"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <PasswordInput
        showPassword={showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
      />
      <ErrorMessage
        name="password"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>

    <div className="flex items-center justify-between">
      <Link
        href="/auth/tenant/login/forgot-password"
        className="text-sm text-red-600 hover:text-red-700"
      >
        Lupa password?
      </Link>
    </div>

    <button
      type="submit"
      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:translate-y-[-1px] focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      disabled={isLoading}
    >
      {isLoading ? <LoadingSpinner /> : "Masuk"}
    </button>
  </div>
);

const LoadingSpinner = () => (
  <span className="flex items-center justify-center">
    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    Loading...
  </span>
);
