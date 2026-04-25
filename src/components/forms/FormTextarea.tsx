/**
 * Reusable Form Textarea Component
 * Includes validation, error display, and accessibility features
 */

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  required?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    const textareaId = props.id || props.name;
    const hasError = !!error;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={textareaId}
          className="text-xs sm:text-sm font-bold text-[#5d6d87] tracking-wide"
        >
          {label}
          {required && <span className="text-[#c1a478] ml-1">*</span>}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${textareaId}-error` : undefined}
          className={`
            w-full px-4 py-3 sm:py-4
            bg-white border rounded-sm
            ${hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#c1a478]'}
            outline-none transition-all duration-300
            text-sm sm:text-base
            resize-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {hasError && (
          <p
            id={`${textareaId}-error`}
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

FormTextarea.displayName = 'FormTextarea';
