"use client";

import { forwardRef } from "react";
import clsx from "clsx";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-ui font-medium text-gold-200/70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-400/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-xl bg-abyss/80 border text-gold-100 font-body",
              "placeholder:text-gold-200/20",
              "focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/30",
              "transition-all duration-200",
              error
                ? "border-danger/50 focus:ring-danger/30 focus:border-danger/30"
                : "border-gold-400/10 hover:border-gold-400/20",
              icon ? "pl-10 pr-4" : "px-4",
              "py-3 text-sm",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-gold-200/30">{hint}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
