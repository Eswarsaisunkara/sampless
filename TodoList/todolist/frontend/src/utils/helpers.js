import { format, parseISO, isToday, isYesterday, differenceInDays, startOfWeek, addDays } from "date-fns";

export const formatDate = (date, fmt = "MMM dd, yyyy") => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
};

export const formatRelative = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  const diff = differenceInDays(new Date(), d);
  if (diff < 7) return `${diff} days ago`;
  return format(d, "MMM dd");
};

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
};

export const getWeekDates = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const initials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const priorityColor = {
  high: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-500/20" },
  medium: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-500/20" },
  low: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-500/20" },
};

export const examColors = {
  GATE: "from-indigo-500 to-violet-600",
  SSC: "from-emerald-500 to-teal-600",
  UPSC: "from-rose-500 to-pink-600",
  JEE: "from-amber-500 to-orange-600",
  Placements: "from-cyan-500 to-blue-600",
};

export const subjectColors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f43f5e", "#14b8a6"];

export const truncate = (str = "", n = 100) => (str.length > n ? str.slice(0, n) + "…" : str);

export const stripHtml = (html = "") => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
