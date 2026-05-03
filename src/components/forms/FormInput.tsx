/**
 * Reusable Form Input Component
 * Includes validation, error display, and accessibility features
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  icon?: React.ReactNode;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, required, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide"
        >
          {label}
          {required && <span className="text-[#c1a478] ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c1a478] pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            className={`
              w-full px-4 py-3 sm:py-4 
              ${icon ? 'pl-10' : ''}
              bg-white border rounded-sm
              ${hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#c1a478]'}
              outline-none transition-all duration-300
              text-sm sm:text-base
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
        </div>

        {hasError && (
          <p
            id={`${inputId}-error`}
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

FormInput.displayName = 'FormInput';
