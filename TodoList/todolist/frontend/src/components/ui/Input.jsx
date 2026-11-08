import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef(function Input({ label, error, leftIcon, rightIcon, className, ...rest }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{leftIcon}</div>}
        <input
          ref={ref}
          className={cn("input-base", leftIcon && "pl-10", rightIcon && "pr-10", error && "border-rose-400 focus:border-rose-500", className)}
          {...rest}
        />
        {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{rightIcon}</div>}
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, className, ...rest }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        className={cn("input-base min-h-[88px] resize-y", error && "border-rose-400 focus:border-rose-500", className)}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, options = [], className, ...rest }, ref) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select
        ref={ref}
        className={cn("input-base cursor-pointer", error && "border-rose-400 focus:border-rose-500", className)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
});
