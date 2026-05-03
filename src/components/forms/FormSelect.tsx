/**
 * Reusable Form Select Component
 * Includes validation, error display, and accessibility features
 */

import { forwardRef, SelectHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  icon?: React.ReactNode;
  required?: boolean;
  options: { value: string; label: string }[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, icon, required, options, className = '', ...props }, ref) => {
    const selectId = props.id || props.name;
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide"
        >
          {label}
          {required && <span className="text-[#c1a478] ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478] pointer-events-none z-10">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${selectId}-error` : undefined}
            className={`
              w-full px-4 py-3 sm:py-4
              ${icon ? 'pl-10' : ''}
              bg-white border rounded-sm
              ${hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#c1a478]'}
              outline-none transition-all duration-300
              text-sm sm:text-base
              appearance-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-[#5d6d87]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {hasError && (
          <p
            id={`${selectId}-error`}
            className="text-red-500 text-xs sm:text-sm flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
