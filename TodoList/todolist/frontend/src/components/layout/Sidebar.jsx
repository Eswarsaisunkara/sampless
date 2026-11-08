import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  StickyNote,
  ListTodo,
  Timer,
  Target,
  CalendarDays,
  BarChart3,
  Settings,
  X,
  GraduationCap,
  LogOut,
  Sparkles,
  Brain,
  Award,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { initials, examColors } from "../../utils/helpers";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/notes", label: "Notes", icon: StickyNote },
  { to: "/app/tasks", label: "Tasks", icon: ListTodo },
  { to: "/app/pomodoro", label: "Pomodoro", icon: Timer },
  { to: "/app/quiz", label: "Quiz", icon: Brain },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/planner", label: "Planner", icon: CalendarDays },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { points } = useData();
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-white transition-transform duration-300 dark:border-[#252839] dark:bg-[#0d0e17] lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5 border-b dark:border-[#252839]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-lg shadow-indigo-200 dark:shadow-none">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none text-slate-900 dark:text-white">StudyOS</h1>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">Smart student OS</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#1f2233] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Exam Badge */}
        {user?.exam && (
          <div className="mx-4 mt-4">
            <div className={cn("rounded-xl p-3 text-white bg-gradient-to-br", examColors[user.exam] || examColors.GATE)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Preparing for</p>
                  <p className="text-sm font-bold">{user.exam}</p>
                </div>
                <Sparkles className="h-5 w-5 opacity-70" />
              </div>
            </div>
          </div>
        )}

        {/* Points */}
        <div className="mx-4 mt-3">
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Your points</p>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{points?.total ?? 0} XP</p>
              </div>
            </div>
            <span className="text-lg">🔥</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Workspace</p>
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-700 dark:text-indigo-300"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1f2233] dark:hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5", active && "text-indigo-600 dark:text-indigo-400")} size={18} />
                    <span className="flex-1">{item.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t p-3 dark:border-[#252839]">
          <div className="flex items-center gap-3 rounded-xl p-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-sm font-semibold text-white">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
