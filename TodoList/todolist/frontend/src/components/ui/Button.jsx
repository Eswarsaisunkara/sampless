import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading, 
  className, 
  disabled, 
  leftIcon, 
  rightIcon,
  fullWidth = false,
  ...rest 
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-200 dark:shadow-blue-900",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md shadow-red-200 dark:shadow-red-900",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-emerald-900",
    warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-md shadow-amber-200 dark:shadow-amber-900",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium rounded",
    md: "px-4 py-2 text-sm font-medium rounded-lg",
    lg: "px-6 py-3 text-base font-medium rounded-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={loading || disabled}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
};

export { Button };

