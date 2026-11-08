import { Loader2 } from "lucide-react";

export function Spinner({ size = "md" }) {
  const s = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" }[size];
  return <Loader2 className={`${s} animate-spin text-indigo-500`} />;
}

export function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-slate-50/50 px-6 py-14 text-center dark:border-[#252839] dark:bg-[#131520]/40">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
          <Icon className="h-7 w-7" />
        </div>
      )}
      {title && <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>}
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`shimmer rounded-md ${className}`} />;
}

export function Card({ className, children, ...rest }) {
  return (
    <div className={`card p-5 ${className || ""}`} {...rest}>
      {children}
    </div>
  );
}
